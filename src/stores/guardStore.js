import { ref, reactive, watch } from 'vue'
import { user } from '@/api/waxpeer'
import { updateItemDetails, updateItemDiscount } from '@/resources/csItem'
import { WXB_LOG } from '@/utils'
import { ordersResultLimit } from '@/config'

const config = reactive({
    bidStep: 0.01,
    safeDiscount: 0.97,
    pages: 1,
    updateDelay: 10
})

const guardItems = ref(new Map())

const guardItemsData = ref({})

watch(config, () => {
    chrome.storage.sync.set({ guardConfig: config })
})

watch(guardItemsData, () => {
    chrome.storage.sync.set({ guardItemsData: guardItemsData.value })
}, { deep: true })

const loadConfig = () => {
    chrome.storage.sync.get(['guardConfig'], (result) => {
        const { guardConfig } = result

        if(guardConfig instanceof Object) {
            Object.assign(config, guardConfig)
        }
    })
}

const loadGuardItemsData = () => {
    chrome.storage.sync.get(['guardItemsData'], (result) => {
        const { guardItemsData: data } = result

        if(data instanceof Object) {
            guardItemsData.value = data
        }
    })
}

const deleteGuardItem = (id) => {
    guardItems.value.delete(id)

    delete guardItemsData.value[id]
}

const getGuardItemData = (id) => {
    return guardItemsData.value[id]
}

const getObservedItems = () => {
    let observedItems = []

    for(let [key, item] of guardItems.value) {
        const guardItemData = guardItemsData.value[key]

        if(guardItemData?.ignored === false) {
            observedItems.push(item)
        }
    }

    return observedItems
}

const getSellItems = async () => {
    let page = 1
    let sellItems = []

    try {
        for(let i = 0; i < page; i++) {
            const query = new URLSearchParams({
                game: 'csgo',
                skip: i * ordersResultLimit,
                count: ordersResultLimit,
                sort: 'desc'
            })

            const { success, items } = await user.getItems(query)

            if(success) {
                sellItems = [...sellItems, ...items]
            }
    
            if(items.length < ordersResultLimit) {
                break
            }
    
            page++
        }
    } catch(err) {
        WXB_LOG('Cannot load orders page', err)
    }

    return sellItems
}

const loadGuardItems = async () => {
    const sellItems = await getSellItems()

    const updatedGuardItems = new Map()

    const updatedGuardItemsData = {}

    for(let item of sellItems) {
        item.steam_price_number = item.steam_price?.average ?? item.price

        updateItemDiscount(item)

        await updateItemDetails(item)

        const itemGuardData = getGuardItemData(item.item_id)

        if(!itemGuardData) {
            let minPrice = item.$price
            let maxPrice = minPrice * config.safeDiscount
    
            if(maxPrice < minPrice) {
                maxPrice = minPrice + config.bidStep
            }

            updatedGuardItemsData[item.item_id] = {
                ignored: true,
                minPrice,
                maxPrice
            }
        } else {
            updatedGuardItemsData[item.item_id] = itemGuardData
        }

        updatedGuardItems.set(item.item_id, item)
    }

    guardItems.value = updatedGuardItems

    guardItemsData.value = updatedGuardItemsData
}

export {
    config,
    guardItems,
    deleteGuardItem,
    getGuardItemData,
    getObservedItems,
    loadGuardItemsData,
    loadConfig,
    loadGuardItems
}