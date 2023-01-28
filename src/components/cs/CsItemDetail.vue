<template>
  <span :class="detailClass">
      <span class="wxb-text-gray-300">
        {{ name }}
      </span>
      {{ value }}
  </span>
</template>

<script setup>
const props = defineProps({
  rarity: {
    type: String
  },
  name: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  }
})

const detailClass = [
  'wxb-px-3.5',
  'wxb-py-1.5',
  props.rarity ? `wxb-rarity-${props.rarity}` : ''
]
</script>

<style scoped>
.wxb-rarity-common {
  color: inherit;
}

.wxb-rarity-infrequent {
  @apply wxb-text-brown-200;
}

.wxb-rarity-rare {
  @apply wxb-text-yellow-500;
}
</style>