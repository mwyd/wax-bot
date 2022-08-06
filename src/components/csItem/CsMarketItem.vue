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
      <div class="wxb-flex wxb-items-center wxb-flex-[0_0_100px] wxb-px-2">
        <AppButton
          class="wxb-btn-big"
          :disabled="buyBtnDisabled"
          @click="buy"
        >
          <AppLoader
            v-if="buyBtnDisabled"
            class="wxb-my-0 wxb-mx-auto"
          />
          <span v-else>
            Buy
          </span>
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
import { toRef, ref } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppLoader from '@/components/ui/AppLoader.vue'
import CsItemHeader from './CsItemHeader.vue'
import CsItemPrice from './CsItemPrice.vue'
import CsItemDetailsBar from './CsItemDetailsBar.vue'
import useCsItemDetails from '@/composables/useCsItemDetails'
import { buyItem } from '@/stores/botStore'

export default {
  components: {
    CsItemHeader,
    CsItemPrice,
    AppButton,
    AppLoader,
    CsItemDetailsBar
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
      buy,
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