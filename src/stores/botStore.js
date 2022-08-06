import { reactive, ref, watch, computed } from 'vue'
import { syncStorage, waxpeerDate, WXB_LOG } from '@/utils'
import { user, market as waxpeerMarket } from '@/api/waxpeer'
import { updateTradesDelay, tradesResultLimit, notificationSound, steamBuffDiscountOffset } from '@/config'
import { userPreferences } from './userStore'
import { pushAlert } from './alertsStore'
import useProcess from '@/composables/useProcess'
import processStateEnum from '@/enums/processStateEnum'
import waxpeerCsItemStatusEnum from '@/enums/waxpeerCsItemStatusEnum'
import alertTypeEnum from '@/enums/alertTypeEnum'
import targetMarketEnum from '@/enums/targetMarketEnum'

let timestamp = waxpeerDate()

let timeoutId = null

const process = useProcess()

const config = reactive({
  deal: 0,
  dealMargin: 100,
  minPrice: 50,
  maxPrice: 500,
  limit: 500,
  search: '',
  pages: 1,
  volume: 10,
  updateDelay: 4
})

const computedDealMargin = computed({
  get() {
    let dealMargin = config.dealMargin

    if (userPreferences.targetMarket == targetMarketEnum.BUFF) {
      dealMargin -= steamBuffDiscountOffset
    }

    return dealMargin
  },
  set(value) {
    let dealMargin = value

    if (userPreferences.targetMarket == targetMarketEnum.BUFF) {
      dealMargin += steamBuffDiscountOffset
    }

    config.dealMargin = dealMargin
  }
})

const pendingItems = reactive(new Map())

const finishedItems = ref([])

const moneySpent = ref(0)

const moneyFrozen = ref(0)

watch(config, () => {
  syncStorage.set({ botConfig: config })
})

const loadConfig = async () => {
  const botConfig = await syncStorage.get('botConfig')

  if (botConfig instanceof Object) {
    Object.assign(config, botConfig)
  }
}

const getTrades = async () => {
  let page = 1
  let trades = []

  try {
    for (let i = 0; i < page; i++) {
      const query = new URLSearchParams({
        skip: i * tradesResultLimit,
        count: tradesResultLimit,
        page: 'steam_trades',
        start: timestamp.format('YYYY-MM-DD HH:mm:ss')
      })

      const { success, data } = await user.getTrades(query)

      if (success) {
        trades = [...trades, ...data[0]]
      }

      if (!success || data[0].length < tradesResultLimit) {
        break
      }

      page++
    }
  } catch (err) {
    WXB_LOG('Cannot load trades page', err)
  }

  return trades
}

const deletePendingItem = (item) => {
  pendingItems.delete(item.item_id)

  moneyFrozen.value -= item.$price
}

const updatePendingItems = async () => {
  process.update(processStateEnum.RUNNING)

  const trades = await getTrades()

  pendingItems.forEach(item => {
    const tradeItem = trades.find(trade => trade.id === item.$trade_id)

    if (!tradeItem) {
      return
    }

    if ([waxpeerCsItemStatusEnum.CANCELED, waxpeerCsItemStatusEnum.ACCEPTED].indexOf(tradeItem.status) > -1) {
      item.$status = tradeItem.status

      deletePendingItem(item)

      finishedItems.value.push(item)

      if (tradeItem.status == waxpeerCsItemStatusEnum.ACCEPTED) {
        moneySpent.value += item.$price
      }
    }
  })

  if (pendingItems.size == 0) {
    process.update(processStateEnum.TERMINATED)

    clearTimeout(timeoutId)

    return
  }

  timeoutId = setTimeout(updatePendingItems, updateTradesDelay * 1000)

  process.update(processStateEnum.IDLE)
}

const buyItem = async (item) => {
  if (pendingItems.has(item.item_id) || item.$price + moneySpent.value + moneyFrozen.value > config.limit) {
    return
  }

  item.$status = waxpeerCsItemStatusEnum.PENDING
  item.$trade_id = null
  item.$bought_at = Date.now()

  pendingItems.set(item.item_id, item)

  moneyFrozen.value += item.$price

  try {
    const data = await waxpeerMarket.buyItem({
      id: item.item_id,
      image: item.image,
      name: item.name,
      price: item.price,
      shop: null
    })

    const { success, id, msg } = data

    const alert = {
      type: success ? alertTypeEnum.SUCCESS : alertTypeEnum.ERROR,
      title: 'Waxpeer'
    }

    if (success) {
      alert.body = 'Successful purchase'

      item.$trade_id = id

      if (process.is(processStateEnum.TERMINATED)) {
        timestamp = waxpeerDate()

        updatePendingItems()
      }

      notificationSound.play()
    } else {
      alert.body = msg

      deletePendingItem(item)
    }

    pushAlert(alert)

    WXB_LOG('Buy info', data)
  } catch (err) {
    deletePendingItem(item)

    WXB_LOG('Cannot buy item', err)
  }
}

export {
  process,
  config,
  computedDealMargin,
  pendingItems,
  finishedItems,
  moneySpent,
  moneyFrozen,
  loadConfig,
  buyItem
}