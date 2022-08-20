import { ref, reactive, watch } from 'vue'
import { user as waxpeerUser } from '@/services/waxpeer'
import { updateItemDetails, normalizeItemPrice } from '@/resources/csItem'
import { syncStorage, round } from '@/utils'
import moment from 'moment'

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

const ignoreGuardItems = (ignore) => {
  for (const data of Object.values(guardItemsData.value)) {
    data.ignored = ignore
  }
}

function* getObservedItems() {
  for (const [key, item] of guardItems.value) {
    const data = guardItemsData.value[key]

    if (data?.ignored === false) {
      yield item
    }
  }
}

const loadGuardItems = async () => {
  const sellItems = await waxpeerUser.getAllItems({
    game: 'csgo',
    sort: 'desc'
  })

  const updatedGuardItems = new Map()

  const updatedGuardItemsData = {}

  for (const item of ref(sellItems).value) {
    item.$key = `${item.item_id}_${moment(item.date).format('X')}`
    item.steam_price_number = item.steam_price?.average ?? item.price

    normalizeItemPrice(item)

    updateItemDetails(item)

    const itemGuardData = getGuardItemData(item.$key)

    if (!itemGuardData) {
      let minPrice = item.$price
      let maxPrice = round(item.$suggested_price * config.safeDiscount)

      if (maxPrice < minPrice) {
        maxPrice = round(minPrice + config.bidStep)
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
  ignoreGuardItems,
  getObservedItems,
  loadGuardItemsData,
  loadConfig,
  loadGuardItems
}