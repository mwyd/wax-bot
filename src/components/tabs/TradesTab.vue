<template>
  <AppTabWrapper>
    <template #header>
      <span>
        Items - {{ itemsCount }}
      </span>
      <span>
        $ {{ itemsValue.accepted }} / {{ itemsValue.total }}
      </span>
    </template>
    <template #body>
      <CsItemFilters
        :default-filters="defaultFilters"
        :items="[...pendingItems.values(), ...finishedItems]"
        @filter="items => filteredItems = items"
      />
      <div class="wxb-flex wxb-py-3.5">
        <div class="wxb-w-full wxb-px-3.5">
          Name
        </div>
        <div class="wxb-flex-lg wxb-px-3.5">
          Price
        </div>
        <div class="wxb-flex-lg wxb-px-3.5">
          Status
        </div>
        <div class="wxb-flex-lg wxb-px-3.5">
          Date
        </div>
      </div>
      <AppScrollView>
        <CsTradeItem
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
import AppScrollView from '@/components/ui/AppScrollView'
import AppTabWrapper from '@/components/ui/AppTabWrapper'
import CsTradeItem from '@/components/cs/CsTradeItem'
import CsItemFilters from '@/components/cs/CsItemFilters'
import { pendingItems, finishedItems } from '@/stores/botStore'
import { process } from '@/stores/botStore'
import { updateTabState } from '@/stores/tabsStore'
import { round } from '@/utils'
import csItemSortEnum from '@/enums/csItemSortEnum'
import waxpeerCsItemStatusEnum from '@/enums/waxpeerCsItemStatusEnum'

const defaultFilters = {
  sortBy: csItemSortEnum.DATE
}

const filteredItems = ref([])

const itemsCount = computed(() => pendingItems.size + finishedItems.value.length)

process.subscribe((state) => updateTabState('Trades', state))

const itemsValue = computed(() => {
  const pendingValue = [...pendingItems.values()].reduce((a, item) => a + item.$price, 0)

  let acceptedValue = 0
  let finishedValue = 0

  for (const item of finishedItems.value) {
    if (item.$status === waxpeerCsItemStatusEnum.ACCEPTED) {
      acceptedValue += item.$price
    }

    finishedValue += item.$price
  }

  return {
    accepted: round(acceptedValue),
    total: round(pendingValue + finishedValue)
  }
})
</script>

<style>

</style>