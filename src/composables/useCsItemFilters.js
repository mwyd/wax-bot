import { reactive } from 'vue'
import { steamBuffDiscountOffset } from '@/config'
import csItemSortEnum from '@/enums/csItemSortEnum'

const sortVariants = {
    [csItemSortEnum.BUFF_DISCOUNT]: {
        name: 'Buff discount',
        callback: (a, b) => ((b.$buff?.discount ?? -steamBuffDiscountOffset) - (a.$buff?.discount ?? -steamBuffDiscountOffset))
    },
    [csItemSortEnum.STEAM_DISCOUNT]: {
        name: 'Steam discount',
        callback: (a, b) => ((b.$steam?.discount ?? 0) - (a.$steam?.discount ?? 0))
    },
    [csItemSortEnum.WAX_DISCOUNT]: {
        name: 'Waxpeer discount',
        callback: (a, b) => (b.$discount - a.$discount)
    },
    [csItemSortEnum.FLOAT]: {
        name: 'Float',
        callback: (a, b) => ((b.$float || 1) - (a.$float || 1))
    },
    [csItemSortEnum.MARKET_PRICE]: {
        name: 'Market price',
        callback: (a, b) => (b.price - a.price)
    },
    [csItemSortEnum.DATE]: {
        name: 'Date',
        callback: (a, b) => ((b.$bought_at ?? 0) - (a.$bought_at ?? 0))
    }
}

export default function useCsItemFilters(defaults = {}) {
    const filters = reactive({
        search: '',
        sortAsc: false,
        sortBy: csItemSortEnum.STEAM_DISCOUNT,
        ...defaults
    })

    const comparator = (a, b) => sortVariants[filters.sortBy].callback(a, b) * (filters.sortAsc ? -1 : 1)

    return {
        filters,
        sortVariants,
        comparator
    }
}