import { WXB_LOG } from '@/utils'
import { market as waxpeeerMarket, user as waxpeerUser } from '@/api/waxpeer'
import { updateItemDiscount } from '@/resources/csItem'
import { config, getGuardItemData, getObservedItems, deleteGuardItem } from '@/stores/guardStore'
import { session } from '@/stores/userStore'
import { marketResultLimit } from '@/config'
import { pushAlert } from '@/stores/alertsStore'
import processStateEnum from '@/enums/processStateEnum'
import useProcess from './useProcess'
import waxpeerApiMsgEnum from '@/enums/waxpeerApiMsgEnum'
import alertTypeEnum from '@/enums/alertTypeEnum'

export default function useGuard() {
  let timeoutId = null

  const process = useProcess()

  const getSimilarMarketItems = async (search, minPrice, maxPrice) => {
    let marketItems = []

    try {
      for (let i = 0; i < config.pages; i++) {
        const query = new URLSearchParams({
          skip: i * marketResultLimit,
          sort: 'ASC',
          order: 'price',
          game: 'csgo',
          all: 0,
          min_price: minPrice * 1000,
          max_price: maxPrice * 1000,
          search: search,
          exact: 1
        })

        const { success, items } = await waxpeeerMarket.getItems(query)

        if (success) {
          marketItems = [...marketItems, ...items]
        }

        if (!success || items.length < marketResultLimit) {
          break
        }
      }
    } catch (err) {
      WXB_LOG('Cannot load item page', err)
    }

    return marketItems
  }

  const updateObservedItemPrice = async (observedItem, newPrice) => {
    try {
      const { success, msg } = await waxpeerUser.editSellOffer({
        item: {
          item_id: observedItem.item_id,
          image: observedItem.image,
          name: observedItem.name,
          price: newPrice,
          game: 'csgo'
        }
      })

      if (success) {
        observedItem.price = newPrice

        updateItemDiscount(observedItem)
      } else {
        if (msg == waxpeerApiMsgEnum.NO_ITEM_FOUND) {
          deleteGuardItem(observedItem.item_id)
        }
      }
    } catch (err) {
      WXB_LOG('Cannot update item price', err)
    }
  }

  const checkObservedItem = async (observedItem) => {
    const { minPrice, maxPrice } = getGuardItemData(observedItem.item_id)

    let marketItems = await getSimilarMarketItems(observedItem.name, minPrice, maxPrice)

    let newPrice = maxPrice * 1000

    for (const marketItem of marketItems) {
      if (marketItem.by == session.waxpeerId) {
        continue
      }

      const nextPrice = marketItem.price - (config.bidStep * 1000)

      if (nextPrice > minPrice) {
        newPrice = nextPrice

        break
      }
    }

    if (observedItem.price != newPrice) {
      updateObservedItemPrice(observedItem, newPrice)
    }
  }

  const run = async () => {
    process.update(processStateEnum.RUNNING)

    const observedItems = getObservedItems()

    if (observedItems.length == 0) {
      pushAlert({
        type: alertTypeEnum.INFO,
        title: 'Guard',
        body: 'Terminating guard - no observed items'
      })

      toggle()
    }

    for (const observedItem of observedItems) {
      await checkObservedItem(observedItem)
    }

    if (process.is(processStateEnum.TERMINATING)) {
      toggle()

      return
    }

    timeoutId = setTimeout(run, config.updateDelay * 1000)

    process.update(processStateEnum.IDLE)
  }

  const toggle = () => {
    if (process.is(processStateEnum.RUNNING)) {
      process.update(processStateEnum.TERMINATING)

      return
    }

    if (process.is(processStateEnum.TERMINATED)) {
      run()

      return
    }

    clearTimeout(timeoutId)

    process.update(processStateEnum.TERMINATED)
  }

  return {
    process,
    toggle
  }
}