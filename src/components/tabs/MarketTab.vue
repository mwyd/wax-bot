<template>
  <div class="wxb-flex wxb-flex-col wxb-h-full wxb-p-4">
    <h4 class="wxb-mt-0 wxb-flex wxb-justify-between">
      Items - {{ activeItems.size }}
    </h4>
    <CsItemFilters
      :default-filters="defaultFilters"
      :items="[...activeItems.values()]"
      @filter="items => filteredItems = items"
    />
    <div class="wxb-flex wxb-py-2">
      <div class="wxb-w-full wxb-px-2">Name</div>
      <div class="wxb-flex-lg wxb-px-2">Price</div>
      <div class="wxb-flex-sm wxb-px-2">Status</div>
    </div>
    <AppScrollView>
      <CsMarketItem
        v-for="item in filteredItems"
        :key="item.item_id"
        :item="item"
      />
    </AppScrollView>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { activeItems } from '@/stores/botStore'
import { userPreferences } from '@/stores/userStore'
import AppScrollView from '@/components/ui/AppScrollView'
import CsMarketItem from '@/components/cs/CsMarketItem'
import CsItemFilters from '@/components/cs/CsItemFilters'
import targetMarketEnum from '@/enums/targetMarketEnum'
import csItemSortEnum from '@/enums/csItemSortEnum'

const defaultFilters = computed(() => ({
  sortBy: userPreferences.targetMarket === targetMarketEnum.BUFF
    ? csItemSortEnum.BUFF_DISCOUNT
    : csItemSortEnum.STEAM_DISCOUNT
}))

export default {
  components: {
    AppScrollView,
    CsMarketItem,
    CsItemFilters
  },
  setup() {
    const filteredItems = ref([])

    return {
      defaultFilters,
      filteredItems,
      activeItems
    }
  }
}
</script>

<style>

</style>