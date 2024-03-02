import { reactive, watch, ref, computed } from "vue";
import { calculateDiscount } from "@/utils";
import { market as waxpeeerMarket } from "@/services/waxpeer";
import { getSteamMarketItemData, getBuffMarketItemData } from "@/cache/conduit";
import {
  normalizeItemPrice,
  updateItemDetails,
  destroyItemAlerts,
} from "@/resources/csItem";
import { buyItem } from "@/stores/botStore";
import { session, userPreferences } from "@/stores/userStore";
import { steamBuffDiscountOffset } from "@/config";
import processStateEnum from "@/enums/processStateEnum";
import useProcess from "./useProcess";
import targetMarketEnum from "@/enums/targetMarketEnum";

export default function useBot(config) {
  let timeoutId = null;

  const process = useProcess();

  const activeItems = reactive(new Map());

  const computedDealMargin = computed({
    get() {
      let dealMargin = config.dealMargin;

      if (userPreferences.targetMarket === targetMarketEnum.BUFF) {
        dealMargin -= steamBuffDiscountOffset;
      }

      return dealMargin;
    },
    set(value) {
      let dealMargin = value;

      if (userPreferences.targetMarket === targetMarketEnum.BUFF) {
        dealMargin += steamBuffDiscountOffset;
      }

      config.dealMargin = dealMargin;
    },
  });

  watch([() => config.deal, () => config.dealMargin, () => config.volume], () =>
    tryBuyItems(),
  );

  const tryBuyItems = () => {
    if (
      process.is(processStateEnum.TERMINATING) ||
      process.is(processStateEnum.TERMINATED)
    ) {
      return;
    }

    activeItems.forEach((activeItem) => {
      if (itemFulfilCriteria(activeItem)) {
        buyItem(activeItem);
      }
    });
  };

  const itemFulfilCriteria = (activeItem) => {
    const marketData = activeItem[`$${userPreferences.targetMarket}`];

    return (
      marketData instanceof Object &&
      marketData.volume >= config.volume &&
      marketData.discount >= config.deal + computedDealMargin.value
    );
  };

  const updateItems = (marketItems) => {
    for (const [id, activeItem] of activeItems) {
      const marketItem = marketItems.find(
        (marketItem) => marketItem.item_id === id,
      );

      if (!marketItem) {
        activeItems.delete(id);

        destroyItemAlerts(activeItem.$alerts);

        continue;
      }

      if (marketItem.price !== activeItem.price) {
        activeItem.price = marketItem.price;
        activeItem.steam_price_number = marketItem.steam_price_number;

        normalizeItemPrice(activeItem);

        if (activeItem.$buff instanceof Object) {
          activeItem.$buff.discount = calculateDiscount(
            activeItem.$price,
            activeItem.$buff.price,
          );
        }

        if (activeItem.$steam instanceof Object) {
          activeItem.$steam.discount = calculateDiscount(
            activeItem.$price,
            activeItem.$steam.price,
          );
        }

        if (itemFulfilCriteria(activeItem)) {
          buyItem(activeItem);
        }
      }
    }
  };

  const handleMarketItem = async (marketItem) => {
    updateItemDetails(marketItem);

    const [steamData, buffData] = await Promise.all([
      getSteamMarketItemData(marketItem.$conduit_hash_name),
      getBuffMarketItemData(marketItem.name),
    ]);

    if (steamData) {
      marketItem.$steam = {
        ...steamData,
        discount: calculateDiscount(marketItem.$price, steamData.price),
      };
    }

    if (buffData) {
      marketItem.$buff = {
        ...buffData,
        discount: calculateDiscount(marketItem.$price, buffData.price),
      };
    }

    if (itemFulfilCriteria(marketItem)) {
      buyItem(marketItem);
    }

    activeItems.set(marketItem.item_id, marketItem);
  };

  const run = async () => {
    process.update(processStateEnum.RUNNING);

    let marketItems = await waxpeeerMarket.getItemsByPages(
      {
        sort: "DESC",
        order: "profit",
        game: "csgo",
        all: 0,
        min_price: config.minPrice * 1000,
        max_price: config.maxPrice * 1000,
        search: config.search,
        exact: 0,
      },
      config.pages,
    );

    for (const marketItem of marketItems) {
      normalizeItemPrice(marketItem);
    }

    marketItems = marketItems.filter((marketItem) => {
      return (
        marketItem.$discount >= config.deal &&
        marketItem.by !== session.waxpeerId
      );
    });

    updateItems(marketItems);

    for (const marketItem of ref(marketItems).value) {
      if (activeItems.has(marketItem.item_id)) {
        continue;
      }

      await handleMarketItem(marketItem);
    }

    if (process.is(processStateEnum.TERMINATING)) {
      toggle();

      return;
    }

    timeoutId = setTimeout(run, config.updateDelay * 1000);

    process.update(processStateEnum.IDLE);
  };

  const toggle = () => {
    if (process.is(processStateEnum.RUNNING)) {
      process.update(processStateEnum.TERMINATING);

      return;
    }

    if (process.is(processStateEnum.TERMINATED)) {
      run();

      return;
    }

    clearTimeout(timeoutId);

    activeItems.forEach((activeItem) => destroyItemAlerts(activeItem.$alerts));

    activeItems.clear();

    process.update(processStateEnum.TERMINATED);
  };

  return {
    process,
    activeItems,
    computedDealMargin,
    toggle,
  };
}
