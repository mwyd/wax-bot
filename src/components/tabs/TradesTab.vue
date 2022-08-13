<template>
  <div class="wxb-flex wxb-flex-col wxb-h-full wxb-p-4">
    <h4 class="wxb-mt-0 wxb-flex wxb-justify-between">
      <span>
        Items - {{ itemsCount }}
      </span>
      <span>
        $ {{ itemsValue.accepted }} / {{ itemsValue.total }}
      </span>
    </h4>
    <CsItemFilters
      :default-filters="defaultFilters"
      :items="[...pendingItems.values(), ...finishedItems]"
      @filter="items => filteredItems = items"
    />
    <div class="wxb-flex wxb-py-2">
      <div class="wxb-w-full wxb-px-2">Name</div>
      <div class="wxb-flex-lg wxb-px-2">Price</div>
      <div class="wxb-flex-lg wxb-px-2">Status</div>
      <div class="wxb-flex-lg wxb-px-2">Date</div>
    </div>
    <AppScrollView>
      <CsTradeItem
        v-for="item in filteredItems"
        :key="item.item_id"
        :item="item"
      />
    </AppScrollView>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import AppScrollView from '@/components/ui/AppScrollView'
import CsTradeItem from '@/components/cs/CsTradeItem'
import CsItemFilters from '@/components/cs/CsItemFilters'
import { pendingItems, finishedItems } from '@/stores/botStore'
import { process } from '@/stores/botStore'
import { updateTabState } from '@/stores/tabsStore'
import { roundNumber } from '@/utils'
import csItemSortEnum from '@/enums/csItemSortEnum'
import waxpeerCsItemStatusEnum from '@/enums/waxpeerCsItemStatusEnum'

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

    const itemsCount = computed(() => pendingItems.size + finishedItems.value.length)

    process.subscribe((state) => updateTabState('Trades', state))

    const itemsValue = computed(() => {
      const pendingValue = [...pendingItems.values()].reduce((a, item) => a + item.$price, 0)

      let acceptedValue = 0
      let finishedValue = 0

      for (const item of finishedItems.value) {
        if (item.$status == waxpeerCsItemStatusEnum.ACCEPTED) {
          acceptedValue += item.$price
        }

        finishedValue += item.$price
      }

      return {
        accepted: roundNumber(acceptedValue, 3),
        total: roundNumber(pendingValue + finishedValue, 3)
      }
    })

    return {
      filteredItems,
      pendingItems,
      finishedItems,
      itemsValue,
      itemsCount,
      defaultFilters
    }
  }
}
</script>

<style>

</style>