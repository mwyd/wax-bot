<template>
  <CsItem :item="item">
    <div class="wxb-flex wxb-items-center wxb-flex-md wxb-px-3.5">
      <AppInput
        v-model.number="guardData.minPrice"
        type="number"
        :validator="value => (value > 0 && value <= guardData.maxPrice)"
      />
    </div>
    <div class="wxb-flex wxb-items-center wxb-flex-md wxb-px-3.5">
      <AppInput
        v-model.number="guardData.maxPrice"
        type="number"
        :validator="value => (value >= guardData.minPrice && value < 100000)"
      />
    </div>
    <div class="wxb-flex wxb-items-center wxb-flex-sm wxb-px-3.5">
      <AppButton
        class="wxb-btn-big"
        @click="guardData.ignored = !guardData.ignored"
      >
        {{ guardData.ignored ? 'Observe' : 'Ignore' }}
      </AppButton>
    </div>
  </CsItem>
</template>

<script>
import AppButton from '@/components/ui/AppButton'
import AppInput from '@/components/ui/AppInput'
import CsItem from '@/components/cs/CsItem'
import { getGuardItemData } from '@/stores/guardStore'

export default {
  components: {
    AppInput,
    AppButton,
    CsItem
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const guardData = getGuardItemData(props.item.$key)

    return {
      guardData
    }
  }
}
</script>

<style>

</style>