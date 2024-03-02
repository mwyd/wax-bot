<template>
  <div :class="indicatorClass" />
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  state: {
    type: String,
    required: true,
  },
});

const indicatorClass = computed(() => [
  "wxb-h-3.5",
  "wxb-w-3.5",
  "wxb-rounded-full",
  "wxb-transition-none",
  `wxb-indicator-${props.state}`,
]);
</script>

<style scoped>
.wxb-indicator-idle {
  @apply wxb-bg-blue-400;
}

.wxb-indicator-running {
  @apply wxb-bg-green-400;
}

.wxb-indicator-terminating {
  @apply wxb-bg-gray-300;
}

.wxb-indicator-terminated {
  @apply wxb-bg-gray-400;
}
</style>
