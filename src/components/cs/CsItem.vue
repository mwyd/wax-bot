<template>
  <div class="wxb-py-1">
    <div class="wxb-bg-gray-700 wxb-p-1 wxb-flex">
      <div class="wxb-w-full wxb-flex wxb-items-center wxb-px-2">
        <img
          class="wxb-h-12 wxb-pr-2"
          :alt="item.item_id"
          :src="item.image"
        />
        <a
          class="wxb-text-inherit"
          :href="`https://steamcommunity.com/market/listings/730/${item.name}`"
          target="_blank"
        >
          <div>
            {{ item.name }}
          </div>
        </a>
      </div>
      <div class="wxb-flex wxb-flex-lg wxb-items-center wxb-px-2 wxb-overflow-hidden wxb-whitespace-nowrap">
        <span>
          $ {{ item.$price }}
          <sup
            class="wxb-text-orange-500 wxb-font-bold wxb-text-sm"
          >
            {{ discount }}
          </sup>
        </span>
      </div>
      <slot/>
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
import { computed, toRef } from 'vue'
import { userPreferences } from '@/stores/userStore'
import CsItemDetailsBar from '@/components/cs/CsItemDetailsBar'
import useCsItemDetails from '@/composables/useCsItemDetails'

export default {
  components: {
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

    const discount = computed(() => {
      let content = `${item.value.$discount}%`

      const target = item.value[`$${userPreferences.targetMarket}`]

      if (target != null) {
        content = `${target.discount}% | ` + content
      }

      return content
    })

    return {
      discount,
      ...useCsItemDetails(item)
    }
  }
}
</script>

<style>

</style>