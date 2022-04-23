import { reactive, watch, ref } from 'vue'
import { calculateDiscount, WXB_LOG } from '@/utils'
import { market as waxpeeerMarket } from '@/api/waxpeer'
import { steamMarket, buffMarket } from '@/api/conduit'
import { updateItemDiscount, updateItemDetails, destroyItemAlerts } from '@/resources/csItem'
import { config, moneySpent, buyItem } from '@/stores/botStore'
import { session } from '@/stores/userStore'
import { marketResultLimit } from '@/config'
import processStateEnum from '@/enums/processStateEnum'
import useProcess from './useProcess'

export default function useBot() {
    let timeoutId = null

    const process = useProcess()

    const activeItems = reactive(new Map())

    watch([
        () => config.deal, 
        () => config.dealMargin, 
        () => config.volume,
        () => config.limit
    ], () => tryBuyItems())

    const tryBuyItems = () => {
        if(process.is(processStateEnum.TERMINATING) || process.is(processStateEnum.TERMINATED)) {
            return
        }

        activeItems.forEach(activeItem => {
            if(itemFulfillCriteria(activeItem)) {
                buyItem(activeItem)
            }
        })
    }

    const itemFulfillCriteria = (activeItem) => {
        return activeItem.$steam instanceof Object
            && activeItem.$steam.volume >= config.volume 
            && activeItem.$steam.discount >= config.deal + config.dealMargin
    }

    const getMarketItems = async () => {
        let marketItems = []

        try {
            for(let i = 0; i < config.pages; i++) {
                const query = new URLSearchParams({
                    skip: i * marketResultLimit,
                    sort: 'DESC',
                    order: 'profit',
                    game: 'csgo',
                    all: 0,
                    min_price: config.minPrice * 1000,
                    max_price: config.maxPrice * 1000,
                    search: config.search,
                    exact: 0
                })
    
                const { success, items } = await waxpeeerMarket.getItems(query)
    
                if(success) {
                    marketItems = [...marketItems, ...items]
                }
    
                if(!success || items.length < marketResultLimit) {
                    break
                }
            }
        } catch(err) {
            WXB_LOG('Cannot load item page', err)
        }

        return marketItems
    }

    const updateItems = (marketItems) => {
        for(const [id, activeItem] of activeItems) {
            const marketItem = marketItems.find(marketItem => marketItem.item_id == id)

            if(!marketItem) {
                activeItems.delete(id)

                destroyItemAlerts(activeItem.$alerts)

                continue
            }

            if(marketItem.price != activeItem.price) {
                activeItem.price = marketItem.price
                activeItem.steam_price_number = marketItem.steam_price_number

                updateItemDiscount(activeItem)

                if(activeItem.$buff instanceof Object) {
                    activeItem.$buff.discount = calculateDiscount(activeItem.$price, activeItem.$buff.price)
                }

                if(activeItem.$steam instanceof Object) {
                    activeItem.$steam.discount = calculateDiscount(activeItem.$price, activeItem.$steam.price)
                }

                if(itemFulfillCriteria(activeItem)) {
                    buyItem(activeItem)
                }
            }
        }
    }

    const run = async () => {
        process.update(processStateEnum.RUNNING)
        
        if(config.limit - moneySpent.value < config.minPrice) {
            WXB_LOG('Limit reached')

            toggle()
        }

        let marketItems = await getMarketItems()

        for(const marketItem of marketItems) {
            updateItemDiscount(marketItem)
        }

        marketItems = marketItems.filter(marketItem => marketItem.$discount >= config.deal && marketItem.by != session.waxpeerId)

        updateItems(marketItems)

        for(const marketItem of ref(marketItems).value) {
            if(activeItems.has(marketItem.item_id)) {
                continue
            }
            
            updateItemDetails(marketItem)

            // test

            const [buffResponse, steamResponse] = await Promise.all([
                buffMarket.getItem(marketItem.name),
                steamMarket.getItem(marketItem.$conduit_hash_name)
            ])

            if(buffResponse.success) {
                const { price, volume, good_id } = buffResponse.data
                
                marketItem.$buff = {
                    price,
                    volume,
                    good_id,
                    discount: calculateDiscount(marketItem.$price, price)
                }
            }

            if(steamResponse.success) {
                const { price, volume } = steamResponse.data

                marketItem.$steam = {
                    price,
                    volume,
                    discount: calculateDiscount(marketItem.$price, price)
                }
            }

            if(itemFulfillCriteria(marketItem)) {
                buyItem(marketItem)
            }

            // test

            activeItems.set(marketItem.item_id, marketItem)
        }

        if(process.is(processStateEnum.TERMINATING)) {
            toggle()

            return
        }

        timeoutId = setTimeout(run, config.updateDelay * 1000)

        process.update(processStateEnum.IDLE)
    }

    const toggle = () => {
        if(process.is(processStateEnum.RUNNING)) {
            process.update(processStateEnum.TERMINATING)

            return 
        } 
        
        if(process.is(processStateEnum.TERMINATED)) {
            run()

            return
        }

        clearTimeout(timeoutId)
        
        activeItems.forEach(activeItem => destroyItemAlerts(activeItem.$alerts))

        activeItems.clear()

        process.update(processStateEnum.TERMINATED)
    }

    return {
        process,
        activeItems,
        toggle 
    }
}