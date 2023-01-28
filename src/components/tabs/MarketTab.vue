<template>
  <AppTabWrapper>
    <template #header>
      Items - {{ activeItems.size }}
    </template>
    <template #body>
      <CsItemFilters
        :default-filters="defaultFilters"
        :items="[...activeItems.values()]"
        @filter="items => filteredItems = items"
      />
      <div class="wxb-flex wxb-py-3.5">
        <div class="wxb-w-full wxb-px-3.5">Name</div>
        <div class="wxb-flex-lg wxb-px-3.5">Price</div>
        <div class="wxb-flex-sm wxb-px-3.5">Status</div>
      </div>
      <AppScrollView>
        <CsMarketItem
          v-for="item in filteredItems"
          :key="item.item_id"
          :item="item"
        />
      </AppScrollView>
    </template>
  </AppTabWrapper>
</template>

<script setup>
import { computed, ref } from 'vue'
import { activeItems } from '@/stores/botStore'
import { userPreferences } from '@/stores/userStore'
import AppScrollView from '@/components/ui/AppScrollView'
import AppTabWrapper from '@/components/ui/AppTabWrapper'
import CsMarketItem from '@/components/cs/CsMarketItem'
import CsItemFilters from '@/components/cs/CsItemFilters'
import targetMarketEnum from '@/enums/targetMarketEnum'
import csItemSortEnum from '@/enums/csItemSortEnum'

const defaultFilters = computed(() => ({
  sortBy: userPreferences.targetMarket === targetMarketEnum.BUFF
    ? csItemSortEnum.BUFF_DISCOUNT
    : csItemSortEnum.STEAM_DISCOUNT
}))

const filteredItems = ref([])
</script>

<style>

</style>