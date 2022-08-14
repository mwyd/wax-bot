import { WXB_LOG } from '@/utils'
import { market as waxpeeerMarket, user as waxpeerUser } from '@/services/waxpeer'
import { normalizeItemPrice } from '@/resources/csItem'
import { config, getGuardItemData, getObservedItems, deleteGuardItem } from '@/stores/guardStore'
import { session } from '@/stores/userStore'
import { pushAlert } from '@/stores/alertsStore'
import processStateEnum from '@/enums/processStateEnum'
import useProcess from './useProcess'
import waxpeerApiMsgEnum from '@/enums/waxpeerApiMsgEnum'
import alertTypeEnum from '@/enums/alertTypeEnum'

export default function useGuard() {
  let timeoutId = null

  const process = useProcess()

  const updateObservedItemPrice = async (observedItem, newPrice) => {
    try {
      const { success, msg, position } = await waxpeerUser.editSellOffer({
        item: {
          item_id: observedItem.item_id,
          image: observedItem.image,
          name: observedItem.name,
          price: newPrice,
          game: 'csgo'
        }
      })

      if (success) {
        observedItem.position = position
        observedItem.price = newPrice

        normalizeItemPrice(observedItem)
      } else if (msg === waxpeerApiMsgEnum.NO_ITEM_FOUND) {
        deleteGuardItem(observedItem.$key)
      }
    } catch (err) {
      WXB_LOG('Cannot update item price', err)
    }
  }

  const checkObservedItem = async (observedItem) => {
    const { minPrice, maxPrice } = getGuardItemData(observedItem.$key)

    const marketItems = await waxpeeerMarket.getItemsByPages({
      sort: 'ASC',
      order: 'price',
      game: 'csgo',
      all: 0,
      min_price: minPrice * 1000,
      max_price: maxPrice * 1000,
      search: observedItem.name,
      exact: 1
    }, config.pages)

    let newPrice = maxPrice

    for (const marketItem of marketItems) {
      if (marketItem.by === session.waxpeerId) {
        continue
      }

      const nextPrice = (marketItem.price / 1000) - config.bidStep

      if (nextPrice > minPrice) {
        newPrice = nextPrice

        break
      }
    }

    if (observedItem.$price !== newPrice) {
      await updateObservedItemPrice(observedItem, newPrice * 1000)
    }
  }

  const run = async () => {
    process.update(processStateEnum.RUNNING)

    const observedItems = getObservedItems()

    if (observedItems.length === 0) {
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