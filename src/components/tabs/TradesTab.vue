<template>
    <div class="wxb-flex wxb-flex-col wxb-h-full wxb-p-4">
        <h4 class="wxb-mt-0 wxb-flex wxb-justify-between">
            <span>
                Items - {{ itemsCount }}
            </span>
            <span>
                Limit - $ {{ moneyTotal + ' / ' + limit }}
            </span>
        </h4>
        <CsItemFilters 
            :defaultFilters="defaultFilters"
            :items="[...pendingItems.values(), ...finishedItems]"
            @filter="items => filteredItems = items"
        />
        <div class="wxb-cs-list-header wxb-flex wxb-py-2">
            <div class="wxb-w-full wxb-px-2">Name</div>
            <div class="wxb-flex-[0_0_160px] wxb-px-2">Price</div>
            <div class="wxb-flex-[0_0_160px] wxb-px-2">Status</div>
            <div class="wxb-flex-[0_0_160px] wxb-px-2">Date</div>
        </div>
        <AppScrollView>
            <CsTradeItem
                class="wxb-py-1"
                v-for="item in filteredItems"
                :key="item.item_id"
                :item="item"
            />
        </AppScrollView>
    </div>
</template>

<script>
import { computed, ref } from 'vue'
import AppScrollView from '@/components/ui/AppScrollView.vue'
import CsTradeItem from '@/components/csItem/CsTradeItem.vue'
import CsItemFilters from '@/components/csItem/CsItemFilters.vue'
import { pendingItems, finishedItems, moneyFrozen, moneySpent, config } from '@/stores/botStore'
import { process } from '@/stores/botStore'
import { updateTabState } from '@/stores/tabsStore'
import csItemSortEnum from '@/enums/csItemSortEnum'
import { roundNumber } from '@/utils'

const defaultFilters = {
    sortBy: csItemSortEnum.DATE
}

export default {
    components: {
        AppScrollView,
        CsTradeItem,
        CsItemFilters
    },
    setup() {
        const filteredItems = ref([])

        const moneyTotal = computed(() => roundNumber(moneyFrozen.value + moneySpent.value, 3))

        const limit = computed(() => config.limit)

        const itemsCount = computed(() => pendingItems.size + finishedItems.value.length)

        process.subscribe((value) => updateTabState('Trades', value))

        return {
            filteredItems,
            pendingItems,
            finishedItems,
            moneyTotal,
            limit,
            itemsCount,
            defaultFilters
        }
    }
}
</script>

<style>

</style>