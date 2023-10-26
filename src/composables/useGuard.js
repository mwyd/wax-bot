import { WXB_LOG, round } from "@/utils";
import {
  market as waxpeeerMarket,
  user as waxpeerUser,
} from "@/services/waxpeer";
import { normalizeItemPrice } from "@/resources/csItem";
import {
  config,
  getGuardItemData,
  getObservedItems,
  deleteGuardItem,
} from "@/stores/guardStore";
import { session } from "@/stores/userStore";
import { pushAlert } from "@/stores/alertsStore";
import processStateEnum from "@/enums/processStateEnum";
import useProcess from "./useProcess";
import waxpeerApiMsgEnum from "@/enums/waxpeerApiMsgEnum";
import alertTypeEnum from "@/enums/alertTypeEnum";

export default function useGuard() {
  let timeoutId = null;

  const process = useProcess();

  const updateObservedItemPrice = async (observedItem, newPrice) => {
    try {
      const { success, msg, position, price } = await waxpeerUser.editSellOffer(
        {
          item: {
            item_id: observedItem.item_id,
            image: observedItem.image,
            name: observedItem.name,
            price: newPrice * 1000,
            game: "csgo",
          },
        },
      );

      if (success) {
        observedItem.position = position;
        observedItem.price = price;

        normalizeItemPrice(observedItem);
      } else if (msg === waxpeerApiMsgEnum.NO_ITEM_FOUND) {
        deleteGuardItem(observedItem.$key);
      }
    } catch (err) {
      WXB_LOG("Cannot update item price", err);
    }
  };

  const checkObservedItemPrice = async (observedItem) => {
    const { minPrice, maxPrice } = getGuardItemData(observedItem.$key);

    const marketItems = await waxpeeerMarket.getItemsByPages(
      {
        sort: "ASC",
        order: "price",
        game: "csgo",
        all: 0,
        min_price: minPrice * 1000,
        max_price: maxPrice * 1000,
        search: observedItem.name,
        exact: 1,
      },
      config.pages,
    );

    let newPrice = maxPrice;

    for (const marketItem of marketItems) {
      if (marketItem.by === session.waxpeerId) {
        continue;
      }

      const nextPrice = round(marketItem.price / 1000 - config.bidStep);

      if (nextPrice > minPrice) {
        newPrice = nextPrice;

        break;
      }
    }

    if (observedItem.$price !== newPrice) {
      await updateObservedItemPrice(observedItem, newPrice);
    }
  };

  const handleObservedItems = async (observedItems) => {
    process.update(processStateEnum.RUNNING);

    const { value: observedItem, done } = observedItems.next();

    if (done) {
      run();

      return;
    }

    await checkObservedItemPrice(observedItem);

    if (process.is(processStateEnum.TERMINATING)) {
      toggle();

      return;
    }

    timeoutId = setTimeout(
      () => handleObservedItems(observedItems),
      config.updateDelay * 1000,
    );

    process.update(processStateEnum.IDLE);
  };

  const run = () => {
    process.update(processStateEnum.IDLE);

    if ([...getObservedItems()].length === 0) {
      pushAlert({
        type: alertTypeEnum.INFO,
        title: "Guard",
        body: "Terminating guard - no observed items",
      });

      toggle();

      return;
    }

    handleObservedItems(getObservedItems());
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

    process.update(processStateEnum.TERMINATED);
  };

  return {
    process,
    toggle,
  };
}
