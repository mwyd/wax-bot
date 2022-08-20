<template>
  <CsItem :item="item">
    <div class="wxb-flex wxb-items-center wxb-flex-sm wxb-px-2">
      <AppButton
        class="wxb-btn-big"
        :disabled="buyBtnDisabled"
        @click="buy"
      >
        Buy
      </AppButton>
    </div>
  </CsItem>
</template>

<script>
import { toRef, ref } from 'vue'
import AppButton from '@/components/ui/AppButton'
import CsItem from '@/components/cs/CsItem'
import { buyItem } from '@/stores/botStore'

export default {
  components: {
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
    const item = toRef(props, 'item')

    const buyBtnDisabled = ref(false)

    const buy = () => {
      buyBtnDisabled.value = true

      buyItem(item.value).then(() => buyBtnDisabled.value = false)
    }

    return {
      buyBtnDisabled,
      buy
    }
  }
}
</script>

<style>

</style>