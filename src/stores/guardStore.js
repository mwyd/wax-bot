import { ref, reactive, watch } from 'vue'
import { user } from '@/services/waxpeer'
import { updateItemDetails, normalizeItemPrice } from '@/resources/csItem'
import { syncStorage, WXB_LOG, roundNumber } from '@/utils'
import { ordersResultLimit } from '@/config'
import moment from "moment";

const config = reactive({
  bidStep: 0.01,
  safeDiscount: 0.97,
  pages: 1,
  updateDelay: 10
})

const guardItems = ref(new Map())

const guardItemsData = ref({})

watch(config, () => {
  syncStorage.set({ guardConfig: config })
})

watch(guardItemsData, () => {
  syncStorage.set({ guardItemsData: guardItemsData.value })
}, { deep: true })

const loadConfig = async () => {
  const guardConfig = await syncStorage.get('guardConfig')

  if (guardConfig instanceof Object) {
    Object.assign(config, guardConfig)
  }
}

const loadGuardItemsData = async () => {
  const data = await syncStorage.get('guardItemsData')

  if (data instanceof Object) {
    guardItemsData.value = data
  }
}

const deleteGuardItem = (key) => {
  guardItems.value.delete(key)

  delete guardItemsData.value[key]
}

const getGuardItemData = (key) => {
  return guardItemsData.value[key]
}

const toggleGuardItemsStatus = (ignore) => {
  for (const data of Object.values(guardItemsData.value)) {
    data.ignored = ignore
  }
}

const getObservedItems = () => {
  const observedItems = []

  for (const [key, item] of guardItems.value) {
    const data = guardItemsData.value[key]

    if (data?.ignored === false) {
      observedItems.push(item)
    }
  }

  return observedItems
}

const getSellItems = async () => {
  let page = 1
  let sellItems = []

  try {
    for (let i = 0; i < page; i++) {
      const query = new URLSearchParams({
        game: 'csgo',
        skip: i * ordersResultLimit,
        count: ordersResultLimit,
        sort: 'desc'
      })

      const { success, items } = await user.getItems(query)

      if (success) {
        sellItems = [...sellItems, ...items]
      }

      if (!success || items.length < ordersResultLimit) {
        break
      }

      page++
    }
  } catch (err) {
    WXB_LOG('Cannot load orders page', err)
  }

  return sellItems
}

const loadGuardItems = async () => {
  const sellItems = await getSellItems()

  const updatedGuardItems = new Map()

  const updatedGuardItemsData = {}

  for (let item of ref(sellItems).value) {
    item.$key = `${item.item_id}_${moment(item.date).format('X')}`
    item.steam_price_number = item.steam_price?.average ?? item.price

    normalizeItemPrice(item)

    updateItemDetails(item)

    const itemGuardData = getGuardItemData(item.$key)

    if (!itemGuardData) {
      let minPrice = item.$price
      let maxPrice = roundNumber(item.$suggested_price * config.safeDiscount, 3)

      if (maxPrice < minPrice) {
        maxPrice = roundNumber(minPrice + config.bidStep, 3)
      }

      updatedGuardItemsData[item.$key] = {
        ignored: true,
        minPrice,
        maxPrice
      }
    } else {
      updatedGuardItemsData[item.$key] = itemGuardData
    }

    updatedGuardItems.set(item.$key, item)
  }

  guardItems.value = updatedGuardItems

  guardItemsData.value = updatedGuardItemsData
}

export {
  config,
  guardItems,
  deleteGuardItem,
  getGuardItemData,
  toggleGuardItemsStatus,
  getObservedItems,
  loadGuardItemsData,
  loadConfig,
  loadGuardItems
}