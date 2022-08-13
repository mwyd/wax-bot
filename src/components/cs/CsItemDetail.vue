<template>
  <span :class="detailClass">
      <span class="wxb-text-gray-300">
        {{ name }}
      </span>
      {{ value }}
  </span>
</template>

<script>
export default {
  props: {
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
  },
  setup(props) {
    const detailClass = [
      'wxb-px-2',
      'wxb-py-1',
      props.rarity ? `wxb-rarity-${props.rarity}` : ''
    ]

    return {
      detailClass
    }
  }
}
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