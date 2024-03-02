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

<script setup>
const props = defineProps({
  options: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: [String, Number],
    required: true,
  },
  modelModifiers: {
    type: Object,
    default: () => ({}),
  },
});

defineEmits(["update:modelValue"]);

const optionClass = (isSelected) => [
  "wxb-p-1.5",
  "wxb-w-full",
  "wxb-text-center",
  "wxb-cursor-pointer",
  isSelected === props.modelValue ? "wxb-h-select-option-selected" : "",
];
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
