<template>
  <div class="wxb-flex wxb-h-select">
    <div
      v-for="(option, i) in options"
      :key="`${option}-${i}`"
      :class="optionClass(option)"
      @click="$emit('update:modelValue', option)"
    >
      {{ option }}
    </div>
  </div>
</template>

<script>
import { toRef } from 'vue'

export default {
  props: {
    options: {
      type: Array,
      required: true
    },
    modelValue: {
      type: [String, Number],
      required: true
    },
    modelModifiers: {
      default: () => ({})
    },
  },
  emits: ['update:modelValue'],
  setup(props) {
    const modelValue = toRef(props, 'modelValue')

    const optionClass = (isSelected) => [
      'wxb-p-1',
      'wxb-w-full',
      'wxb-text-center',
      'wxb-cursor-pointer',
      isSelected === modelValue.value ? 'wxb-h-select-option-selected' : '',
    ]

    return {
      optionClass
    }
  }
}
</script>

<style scoped>
.wxb-h-select {
  border-radius: 2px;
  @apply wxb-border wxb-border-solid wxb-border-gray-900;
  @apply wxb-bg-gray-800;
}

.wxb-h-select-option-selected {
  border-radius: inherit;
  @apply wxb-bg-gray-400;
}
</style>