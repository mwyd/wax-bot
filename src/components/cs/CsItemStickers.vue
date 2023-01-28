<template>
  <div class="wxb-bg-gray-700 wxb-flex wxb-shrink-0 wxb-grow-0">
    <img
      v-for="(sticker, i) in stickersWithImage"
      :key="`${sticker.id}-${i}`"
      class="wxb-h-10"
      :alt="sticker.name"
      :src="sticker?.steam_price?.img"
      :title="sticker.name"
    >
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  stickers: {
    type: Array,
    required: true
  }
})

const stickersWithImage = computed(() => {
  return props.stickers.filter(sticker => (sticker?.steam_price?.img || '').indexOf('https://') > -1)
})
</script>

<style>

</style>