import { reactive } from 'vue'
import csItemSortEnum from '@/enums/csItemSortEnum'

export default function useCsItemFilters(defaults = {}) {
    const filters = reactive({
        search: '',
        sortAsc: false,
        sortBy: csItemSortEnum.STEAM_DISCOUNT,
        ...defaults
    })

    const sortVariants = {
        [csItemSortEnum.STEAM_DISCOUNT]: {
            name: 'Steam discount',
            callback: (a, b) => ((b.$steam?.discount ?? 0) - (a.$steam?.discount ?? 0)) * (filters.sortAsc ? -1 : 1)
        },
        [csItemSortEnum.WAX_DISCOUNT]: {
            name: 'Waxpeer discount',
            callback: (a, b) => (b.$discount - a.$discount) * (filters.sortAsc ? -1 : 1)
        },
        [csItemSortEnum.FLOAT]: {
            name: 'Float',
            callback: (a, b) => ((b.$float || 1) - (a.$float || 1)) * (filters.sortAsc ? -1 : 1) 
        },
        [csItemSortEnum.MARKET_PRICE]: {
            name: 'Market price',
            callback: (a, b) => (b.price - a.price) * (filters.sortAsc ? -1 : 1)
        },
        [csItemSortEnum.DATE]: {
            name: 'Date',
            callback: (a, b) => ((b.$bought_at ?? 0) - (a.$bought_at ?? 0)) * (filters.sortAsc ? -1 : 1)
        }
    }

    return {
        filters,
        sortVariants
    }
}