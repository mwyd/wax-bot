<template>
  <div class="wxb-bg-gray-700 wxb-flex wxb-shrink-0 wxb-grow-0">
    <img
      class="wxb-h-6"
      v-for="(sticker, i) in stickersWithImage"
      :key="`${sticker.id}-${i}`"
      :alt="sticker.name"
      :src="sticker?.steam_price?.img"
      :title="sticker.name"
    />
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  props: {
    stickers: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const stickersWithImage = computed(() => {
      return props.stickers.filter(sticker => (sticker?.steam_price?.img || '').indexOf('https://') > -1)
    })

    return {
      stickersWithImage
    }
  }
}
</script>

<style>

</style>