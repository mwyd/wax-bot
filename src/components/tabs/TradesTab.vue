<template>
    <div class="wxb-flex wxb-flex-col wxb-h-full wxb-p-[20px]">
        <h4 class="wxb-mt-0 wxb-flex wxb-justify-between">
            <span>
                Items - {{ itemsCount }}
            </span>
            <span>
                Limit - $ {{ moneyTotal + ' / ' + limit }}
            </span>
        </h4>
        <div class="wxb-cs-list-header wxb-flex wxb-py-[8px]">
            <div class="wxb-w-full wxb-px-[8px]">Name</div>
            <div class="wxb-flex-[0_0_160px] wxb-px-[8px]">Price</div>
            <div class="wxb-flex-[0_0_160px] wxb-px-[8px]">Status</div>
            <div class="wxb-flex-[0_0_160px] wxb-px-[8px]">Date</div>
        </div>
        <AppScrollView>
            <CsTradeItem
                class="wxb-py-[4px]"
                v-for="[id, item] in pendingItems"
                :key="id"
                :item="item"
            />
            <CsTradeItem
                class="wxb-py-[4px]"
                v-for="item in sortedFinishedItems"
                :key="item.item_id"
                :item="item"
            />
        </AppScrollView>
    </div>
</template>

<script>
import AppScrollView from '@/components/ui/AppScrollView.vue'
import CsTradeItem from '@/components/csItem/CsTradeItem.vue'
import { pendingItems, finishedItems, moneyFrozen, moneySpent, config } from '@/stores/botStore'
import { computed } from '@vue/runtime-core'

export default {
    components: {
        AppScrollView,
        CsTradeItem
    },
    setup() {
        const sortedFinishedItems = computed(() => [...finishedItems.value].reverse())

        const moneyTotal = computed(() => moneyFrozen.value + moneySpent.value)

        const limit = computed(() => config.limit)

        const itemsCount = computed(() => pendingItems.size + finishedItems.value.length)

        return {
            pendingItems,
            sortedFinishedItems,
            moneyTotal,
            limit,
            itemsCount
        }
    }
}
</script>

<style>

</style>