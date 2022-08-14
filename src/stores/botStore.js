import { reactive, ref, watch, computed } from 'vue'
import { syncStorage, waxpeerDate, WXB_LOG } from '@/utils'
import { user as waxpeerUser, market as waxpeerMarket } from '@/services/waxpeer'
import { updateTradesDelay, tradesResultLimit, notificationSound, botConfigsLimit } from '@/config'
import { pushAlert } from './alertsStore'
import { v4 as uuidv4 } from 'uuid'
import useProcess from '@/composables/useProcess'
import processStateEnum from '@/enums/processStateEnum'
import waxpeerCsItemStatusEnum from '@/enums/waxpeerCsItemStatusEnum'
import alertTypeEnum from '@/enums/alertTypeEnum'

let timestamp = waxpeerDate()

const process = useProcess()

const botConfigs = ref({})

const botInstances = reactive(new Map())

const pendingItems = reactive(new Map())

const finishedItems = ref([])

const activeItems = computed(() => {
  const items = new Map()

  for (const instance of botInstances.values()) {
    for (const item of instance.activeItems.values()) {
      items.set(item.item_id, item)
    }
  }

  return items
})

const runningBotInstances = computed(() => {
  return [...botInstances.values()].filter(instance => instance.state !== processStateEnum.TERMINATED)
})

const terminatedBotInstances = computed(() => {
  return [...botInstances.values()].filter(instance => instance.state === processStateEnum.TERMINATED)
})

const registerBotInstance = (id, instance) => {
  botInstances.set(id, instance)
}

watch(botConfigs, () => {
  syncStorage.set({ botConfigs: botConfigs.value })
}, { deep: true })

const loadBotConfigs = async () => {
  const data = await syncStorage.get('botConfigs')

  if (data instanceof Object) {
    botConfigs.value = data
  }
}

const addBotConfig = () => {
  if (Object.keys(botConfigs.value).length >= botConfigsLimit) {
    pushAlert({
      type: alertTypeEnum.INFO,
      title: 'Bot',
      body: 'Configs limit reached'
    })

    return
  }

  const uuid = uuidv4()

  botConfigs.value[uuid] = {
    deal: 0,
    dealMargin: 100,
    minPrice: 50,
    maxPrice: 500,
    limit: 500,
    search: '',
    pages: 1,
    volume: 10,
    updateDelay: 4
  }
}

const deleteBotInstance = (id) => {
  botInstances.delete(id)

  delete botConfigs.value[id]
}

const getBotConfig = (id) => {
  return botConfigs.value[id]
}

const updatePendingItems = async () => {
  process.update(processStateEnum.RUNNING)

  const trades = await waxpeerUser.getAllTrades({
    page: 'steam_trades',
    start: timestamp.format('YYYY-MM-DD HH:mm:ss')
  })

  for (const [id, item] of pendingItems) {
    const tradeItem = trades.find(trade => trade.id === item.$trade_id)

    if (!tradeItem) {
      return
    }

    if ([waxpeerCsItemStatusEnum.CANCELED, waxpeerCsItemStatusEnum.ACCEPTED].indexOf(tradeItem.status) > -1) {
      item.$status = tradeItem.status

      pendingItems.delete(id)

      finishedItems.value.push(item)

      // if (tradeItem.status == waxpeerCsItemStatusEnum.ACCEPTED) {
      //   moneySpent.value += item.$price
      // }
    }
  }

  if (pendingItems.size === 0) {
    process.update(processStateEnum.TERMINATED)

    return
  }

  setTimeout(updatePendingItems, updateTradesDelay * 1000)

  process.update(processStateEnum.IDLE)
}

const buyItem = async (item) => {
  if (pendingItems.has(item.item_id)) {
    return
  }

  item.$status = waxpeerCsItemStatusEnum.PENDING
  item.$trade_id = null
  item.$bought_at = Date.now()

  pendingItems.set(item.item_id, item)

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

      pendingItems.delete(item.item_id)
    }

    pushAlert(alert)

    WXB_LOG('Buy info', data)
  } catch (err) {
    pendingItems.delete(item.item_id)

    WXB_LOG('Cannot buy item', err)
  }
}

export {
  process,
  botConfigs,
  activeItems,
  pendingItems,
  finishedItems,
  runningBotInstances,
  terminatedBotInstances,
  registerBotInstance,
  loadBotConfigs,
  addBotConfig,
  deleteBotInstance,
  getBotConfig,
  buyItem
}