import { reactive, watch } from 'vue'
import { calculateDiscount, WXB_LOG } from '@/utils'
import { market as waxpeeerMarket } from '@/api/waxpeer'
import { steamMarket } from '@/api/conduit'
import { updateItemPrice, updateItemDiscount, updateItemDetails } from '@/resources/csItem'
import { config, moneySpent, buyItem } from '@/stores/botStore'
import processStateEnum from '@/enums/processStateEnum'
import useProcess from './useProcess'

export default function useBot() {
    let timeoutId = null

    const process = useProcess()

    const items = reactive(new Map())

    watch([
        () => config.deal, 
        () => config.dealMargin, 
        () => config.steamVolume,
        () => config.limit
    ], () => tryBuyItems())

    const tryBuyItems = () => {
        items.forEach(item => {
            if(itemFulfillCriteria(item)) {
                buyItem(item)
            }
        })
    }

    const itemFulfillCriteria = (item) => {
        return item.$steam instanceof Object
            && item.$steam.volume >= config.steamVolume 
            && item.$steam.discount >= config.deal + config.dealMargin
    }

    const getPage = async (pageNumber) => {
        let marketItems = []

        try {
            const query = new URLSearchParams({
                skip: pageNumber * 50,
                sort: 'DESC',
                order: 'deals',
                game: 'csgo',
                all: 0,
                min_price: config.minPrice * 1000,
                max_price: config.maxPrice * 1000,
                search: config.search,
                exact: 0
            })

            const { success, items } = await waxpeeerMarket.getItems(query)

            if(success) {
                marketItems = items
            }
        } catch(err) {
            WXB_LOG('Cannot load item page', err)
        }

        return marketItems
    }

    const updateItems = (marketItems) => {
        for(const [id, item] of items) {
            const marketItem = marketItems.find(marketItem => marketItem.item_id == id)

            if(!marketItem) {
                items.delete(id)

                continue
            }

            if(marketItem.price != item.price) {
                updateItemPrice(item, marketItem.price, marketItem.steam_price_number)
                updateItemDiscount(item)

                if(item.$steam instanceof Object) {
                    item.$steam.discount = calculateDiscount(item.$price, item.$steam.price)
                }

                if(itemFulfillCriteria(item)) {
                    buyItem(item)
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

        let marketItems = []

        for(let i = 0; i < config.pages; i++) {
            const pageItems = await getPage(i)

            marketItems = [...marketItems, ...pageItems]
        }

        //TO DO: filter self items

        for(const marketItem of marketItems) {
            updateItemDiscount(marketItem)
        }

        marketItems = marketItems.filter(marketItem => marketItem.$discount >= config.deal)

        for(const marketItem of marketItems) {
            if(items.has(marketItem.item_id)) {
                continue
            }
            
            await updateItemDetails(marketItem)

            const { success, data } = await steamMarket.getItem(marketItem.$hash_name)

            if(success) {
                marketItem.$steam = {
                    price: data.price,
                    volume: data.volume,
                    discount: calculateDiscount(marketItem.$price, data.price)
                }

                if(itemFulfillCriteria(marketItem)) {
                    buyItem(marketItem)
                }
            }

            items.set(marketItem.item_id, marketItem)
        }

        updateItems(marketItems)

        //await new Promise(r => setTimeout(r, 10 * 1000))

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
        
        items.clear()

        process.update(processStateEnum.TERMINATED)
    }

    return {
        process,
        config,
        items,
        toggle 
    }
}