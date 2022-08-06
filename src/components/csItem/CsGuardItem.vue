<template>
  <div>
    <div class="wxb-cs-market-item wxb-w-full wxb-p-1 wxb-flex">
      <CsItemHeader
        class="wxb-w-[100%]"
        :hash-name="item.name"
        :image-url="item.image"
      />
      <CsItemPrice
        class="wxb-flex-[0_0_160px]"
        :price="item.$price"
        :waxpeer-discount="item.$discount"
        :steam-discount="item.$steam?.discount"
        :buff-discount="item.$buff?.discount"
      />
      <div class="wxb-flex wxb-items-center wxb-flex-[0_0_120px] wxb-px-2">
        <AppInput
          v-model.number="guardData.minPrice"
          type="number"
          :validator="value => (value > 0 && value <= guardData.maxPrice)"
        />
      </div>
      <div class="wxb-flex wxb-items-center wxb-flex-[0_0_120px] wxb-px-2">
        <AppInput
          v-model.number="guardData.maxPrice"
          type="number"
          :validator="value => (value >= guardData.minPrice && value < 100000)"
        />
      </div>
      <div class="wxb-flex wxb-items-center wxb-flex-[0_0_100px] wxb-px-2">
        <AppButton
          class="wxb-btn-big"
          @click="guardData.ignored = !guardData.ignored"
        >
          {{ guardData.ignored ? 'Observe' : 'Ignore' }}
        </AppButton>
      </div>
    </div>
    <CsItemDetailsBar
      :details="details"
      :steam-owner="item.$owner"
      :wax-owner="item.by"
      :inspect-link="item.$inspect_link"
      :hash-name="item.name"
      :buff-good-id="item.$buff?.good_id"
    />
  </div>
</template>

<script>
import { toRef } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import CsItemHeader from './CsItemHeader.vue'
import CsItemPrice from './CsItemPrice.vue'
import CsItemDetailsBar from './CsItemDetailsBar.vue'
import useCsItemDetails from '@/composables/useCsItemDetails'
import { getGuardItemData } from '@/stores/guardStore'

export default {
  components: {
    CsItemHeader,
    CsItemPrice,
    CsItemDetailsBar,
    AppInput,
    AppButton
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const item = toRef(props, 'item')

    const guardData = getGuardItemData(item.value.item_id)

    return {
      guardData,
      ...useCsItemDetails(item.value)
    }
  }
}
</script>

<style scoped>
.wxb-cs-market-item {
  background-color: var(--bg-c-3);
}
</style>