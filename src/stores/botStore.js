import { reactive, ref, watch, computed } from "vue";
import { syncStorage, waxpeerTimestamp, WXB_LOG } from "@/utils";
import {
  user as waxpeerUser,
  market as waxpeerMarket,
} from "@/services/waxpeer";
import {
  updateTradesDelay,
  notificationSound,
  botConfigsLimit,
  botDateFormat,
} from "@/config";
import { pushAlert } from "./alertsStore";
import { v4 as uuidv4 } from "uuid";
import dateFormat from "dateformat";
import useProcess from "@/composables/useProcess";
import processStateEnum from "@/enums/processStateEnum";
import waxpeerCsItemStatusEnum from "@/enums/waxpeerCsItemStatusEnum";
import alertTypeEnum from "@/enums/alertTypeEnum";

let timestamp = waxpeerTimestamp();

export const process = useProcess();

export const botConfigs = ref({});

const botInstances = reactive(new Map());

export const pendingItems = reactive(new Map());

export const finishedItems = ref([]);

export const activeItems = computed(() => {
  const items = new Map();

  for (const instance of botInstances.values()) {
    for (const item of instance.activeItems.values()) {
      items.set(item.item_id, item);
    }
  }

  return items;
});

export const runningBotInstances = computed(() => {
  return [...botInstances.values()].filter(
    (instance) => instance.state !== processStateEnum.TERMINATED,
  );
});

export const terminatedBotInstances = computed(() => {
  return [...botInstances.values()].filter(
    (instance) => instance.state === processStateEnum.TERMINATED,
  );
});

export const registerBotInstance = (id, instance) => {
  botInstances.set(id, instance);
};

watch(
  botConfigs,
  () => {
    syncStorage.set({ botConfigs: botConfigs.value });
  },
  { deep: true },
);

export const loadBotConfigs = async () => {
  const data = await syncStorage.get("botConfigs");

  if (data instanceof Object) {
    botConfigs.value = Object.fromEntries(
      Object.entries(data).sort((a, b) => a[1].createdAt - b[1].createdAt),
    );
  }
};

export const addBotConfig = () => {
  if (Object.keys(botConfigs.value).length >= botConfigsLimit) {
    pushAlert({
      type: alertTypeEnum.INFO,
      title: "Bot",
      body: "Configs limit reached",
    });

    return;
  }

  const uuid = uuidv4();

  botConfigs.value[uuid] = {
    deal: 0,
    dealMargin: 100,
    minPrice: 50,
    maxPrice: 500,
    search: "",
    pages: 1,
    volume: 10,
    updateDelay: 4,
    createdAt: Date.now(),
  };
};

export const deleteBotInstance = (id) => {
  botInstances.delete(id);

  delete botConfigs.value[id];
};

export const getBotConfig = (id) => {
  return botConfigs.value[id];
};

const updatePendingItems = async () => {
  process.update(processStateEnum.RUNNING);

  const trades = await waxpeerUser.getAllTrades({
    page: "steam_trades",
    start: dateFormat(timestamp, botDateFormat),
  });

  for (const [id, item] of pendingItems) {
    const tradeItem = trades.find((trade) => trade.id === item.$trade_id);

    if (!tradeItem) {
      continue;
    }

    if (
      [
        waxpeerCsItemStatusEnum.CANCELED,
        waxpeerCsItemStatusEnum.ACCEPTED,
      ].indexOf(tradeItem.status) > -1
    ) {
      item.$status = tradeItem.status;

      pendingItems.delete(id);

      finishedItems.value.push(item);
    }
  }

  if (pendingItems.size === 0) {
    process.update(processStateEnum.TERMINATED);

    return;
  }

  setTimeout(updatePendingItems, updateTradesDelay * 1000);

  process.update(processStateEnum.IDLE);
};

export const buyItem = async (item) => {
  if (pendingItems.has(item.item_id)) {
    return;
  }

  item.$status = waxpeerCsItemStatusEnum.PENDING;
  item.$trade_id = null;
  item.$bought_at = Date.now();

  pendingItems.set(item.item_id, item);

  try {
    const data = await waxpeerMarket.buyItem({
      id: item.item_id,
      image: item.image,
      name: item.name,
      price: item.price,
      shop: null,
    });

    const { success, id, msg } = data;

    const alert = {
      title: "Waxpeer",
    };

    if (success) {
      item.$trade_id = id;

      alert.type = alertTypeEnum.SUCCESS;
      alert.body = "Successful purchase";

      if (process.is(processStateEnum.TERMINATED)) {
        timestamp = waxpeerTimestamp();

        updatePendingItems();
      }

      notificationSound.play();
    } else {
      alert.type = alertTypeEnum.ERROR;
      alert.body = msg;

      pendingItems.delete(item.item_id);
    }

    pushAlert(alert);

    WXB_LOG("Buy info", data);
  } catch (err) {
    pendingItems.delete(item.item_id);

    WXB_LOG("Cannot buy item", err);
  }
};
