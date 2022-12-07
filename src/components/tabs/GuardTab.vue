<template>
  <div class="wxb-flex wxb-h-full wxb-p-3.5">
    <div class="wxb-right-border wxb-flex-2xl wxb-p-3.5 wxb-pr-6 wxb-flex wxb-flex-col">
      <h4 class="wxb-mt-0 wxb-mb-3.5">
        Manage
      </h4>
      <AppScrollView>
        <AppInputWrapper label="$ Bid step">
          <AppInput
            v-model.number="config.bidStep"
            type="number"
            :validator="value => (value > 0 && value < 100)"
          />
        </AppInputWrapper>
        <AppInputWrapper label="% Limit">
          <div class="wxb-flex wxb-gap-3.5">
            <AppInput
              v-model.number="config.lowerLimit"
              type="number"
              :validator="value => (value > 0 && value <= config.upperLimit)"
            />
            <AppInput
              v-model.number="config.upperLimit"
              type="number"
              :validator="value => (value >= config.lowerLimit && value <= 10)"
            />
          </div>
        </AppInputWrapper>
        <AppInputWrapper label="Pages">
          <AppInput
            v-model.number="config.pages"
            type="number"
            :validator="value => (value >= 1 && value <= 10)"
          />
        </AppInputWrapper>
        <AppInputWrapper label="Update delay">
          <AppInput
            v-model.number="config.updateDelay"
            type="number"
            :validator="value => (value >= 0 && value <= 300)"
          />
        </AppInputWrapper>
      </AppScrollView>
      <AppButton
        class="wxb-btn-big wxb-mt-3.5 wxb-flex-xs"
        :disabled="isTerminating"
        @click="toggle"
      >
        {{ !isTerminated ? 'Stop' : 'Start' }}
      </AppButton>
    </div>
    <div class="wxb-p-3.5 wxb-pl-6 wxb-w-full wxb-flex wxb-flex-col">
      <h4 class="wxb-mt-0 wxb-mb-6 wxb-flex wxb-justify-between">
        <span>
          Items - {{ guardItems.size }}
        </span>
        <span>
          $ {{ guardItemsValue }}
        </span>
      </h4>
      <CsItemFilters
        :default-filters="defaultFilters"
        :items="[...guardItems.values()]"
        @filter="items => filteredItems = items"
      />
      <div class="wxb-flex wxb-py-3.5">
        <div class="wxb-w-full wxb-px-3.5">Name</div>
        <div class="wxb-flex-lg wxb-px-3.5">Price</div>
        <div class="wxb-flex-md wxb-px-3.5">Min price</div>
        <div class="wxb-flex-md wxb-px-3.5">Max price</div>
        <div class="wxb-flex-sm wxb-px-3.5">Status</div>
      </div>
      <AppScrollView>
        <CsGuardItem
          v-for="item in filteredItems"
          :key="item.item_id"
          :item="item"
        />
      </AppScrollView>
      <AppActionsBar
        class="wxb-mt-6"
        :actions="actions"
      />
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import AppActionsBar from '@/components/ui/AppActionsBar'
import AppButton from '@/components/ui/AppButton'
import AppInput from '@/components/ui/AppInput'
import AppInputWrapper from '@/components/ui/AppInputWrapper'
import AppScrollView from '@/components/ui/AppScrollView'
import CsGuardItem from '@/components/cs/CsGuardItem'
import CsItemFilters from '@/components/cs/CsItemFilters'
import useGuard from '@/composables/useGuard'
import processStateEnum from '@/enums/processStateEnum'
import { config, guardItems, loadGuardItems, ignoreGuardItems, adjustObservedItems } from '@/stores/guardStore'
import { updateTabState } from '@/stores/tabsStore'
import { round } from '@/utils'
import csItemSortEnum from '@/enums/csItemSortEnum'

const defaultFilters = {
  sortBy: csItemSortEnum.MARKET_PRICE
}

const actions = [
  { name: 'refresh', callback: loadGuardItems },
  { name: 'adjust', callback: adjustObservedItems },
  { name: 'observe all', callback: () => ignoreGuardItems(false) },
  { name: 'ignore all', callback: () => ignoreGuardItems(true) }
]

export default {
  components: {
    AppActionsBar,
    AppButton,
    AppInput,
    AppInputWrapper,
    AppScrollView,
    CsGuardItem,
    CsItemFilters
  },
  setup() {
    const filteredItems = ref([])

    const { process, toggle } = useGuard()

    const isTerminating = computed(() => process.is(processStateEnum.TERMINATING))

    const isTerminated = computed(() => process.is(processStateEnum.TERMINATED))

    process.subscribe((state) => updateTabState('Guard', state))

    const guardItemsValue = computed(() => round(
      [...guardItems.value.values()].reduce(((a, item) => a + item.$price), 0)
    ))

    return {
      actions,
      filteredItems,
      isTerminating,
      isTerminated,
      guardItems,
      guardItemsValue,
      config,
      toggle,
      defaultFilters
    }
  }
}
</script>

<style scoped>
.wxb-right-border {
  border-right: 1px solid;
  @apply wxb-border-r-gray-600;
}
</style>