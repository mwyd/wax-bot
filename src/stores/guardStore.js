import { ref, reactive, watch } from 'vue'
import { user } from '@/api/waxpeer'
import { updateItemDetails, updateItemDiscount } from '@/resources/csItem'
import { WXB_LOG } from '@/utils'
import { ordersResultLimit } from '@/config'

const config = reactive({
    bidStep: 0.01,
    safeDiscount: 0.97,
    updateDelay: 10
})

const items = ref(new Map())

watch(config, () => {
    localStorage.setItem('wxb-guard-config', JSON.stringify(config))
})

const loadConfig = () => {
    const savedConfig = JSON.parse(localStorage.getItem('wxb-guard-config'))

    if(savedConfig instanceof Object) {
        Object.assign(config, savedConfig)
    }
}

const getPage = async (pageNumber) => {
    let orders = []

    try {
        const query = new URLSearchParams({
            game: 'csgo',
            skip: pageNumber * ordersResultLimit,
            count: ordersResultLimit,
            sort: 'desc'
        })

        const { success, items } = await user.getItems(query)

        if(success) {
            orders = items
        }
    } catch(err) {
        WXB_LOG('Cannot load orders page', err)
    }

    return orders
}

const loadOrders = async () => {
    let page = 1
    let orders = []

    for(let i = 0; i < page; i++) {
        const pageOrders = await getPage(i)

        orders = [...orders, ...pageOrders]

        if(pageOrders.length < ordersResultLimit) {
            break
        }

        page++
    }

    const updatedOrders = new Map()

    for(let order of orders) {
        order.steam_price_number = order.steam_price?.average ?? order.price

        updateItemDiscount(order)

        await updateItemDetails(order)

        const existingOrder = items.value.get(order.item_id)

        if(existingOrder) {
            updatedOrders.set(order.item_id, {
                order,
                metadata: existingOrder.metadata
            })

            continue
        }

        let minPrice = order.$price
        let maxPrice = minPrice * config.safeDiscount

        if(maxPrice < minPrice) {
            maxPrice = minPrice + config.bidStep
        }

        updatedOrders.set(order.item_id, {
            order,
            metadata: {
                id: null,
                tracked: false,
                minPrice,
                maxPrice
            }
        })
    }

    items.value = updatedOrders
}

export {
    loadConfig,
    loadOrders
}