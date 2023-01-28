<template>
  <div class="wxb-py-1.5">
    <div class="wxb-bg-gray-700 wxb-p-1.5 wxb-flex">
      <div class="wxb-w-full wxb-flex wxb-items-center wxb-px-3.5">
        <div class="wxb-w-full wxb-flex wxb-items-center wxb-overflow-hidden wxb-text-ellipsis wxb-whitespace-nowrap">
          <img
            class="wxb-h-20 wxb-pr-3.5"
            :alt="item.item_id"
            :src="item.image"
          >
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
        <CsItemStickers
          v-if="item.inspect_item?.stickers"
          :stickers="item.inspect_item?.stickers"
        />
      </div>
      <div class="wxb-flex wxb-flex-lg wxb-items-center wxb-px-3.5 wxb-overflow-hidden wxb-whitespace-nowrap">
        <span>
          $ {{ item.$price }}
          <sup
            class="wxb-text-orange-500 wxb-font-bold wxb-text-xl"
          >
            {{ discount }}
          </sup>
        </span>
      </div>
      <slot />
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

<script setup>
import { computed, toRef } from 'vue'
import { userPreferences } from '@/stores/userStore'
import CsItemDetailsBar from '@/components/cs/CsItemDetailsBar'
import CsItemStickers from '@/components/cs/CsItemStickers'
import useCsItemDetails from '@/composables/useCsItemDetails'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const item = toRef(props, 'item')

const { details } = useCsItemDetails(item)

const discount = computed(() => {
  let content = `${item.value.$discount}%`

  const target = item.value[`$${userPreferences.targetMarket}`]

  if (target != null) {
    content = `${target.discount}% | ` + content
  }

  return content
})
</script>

<style>

</style>