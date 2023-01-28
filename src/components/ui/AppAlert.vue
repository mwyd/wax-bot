<template>
  <div
    :class="alertClass"
    @click="destroyAlert(id)"
  >
    <h4 class="wxb-m-0">
      {{ title }}
    </h4>
    <div
      v-if="body"
      class="wxb-w-full wxb-h-full wxb-overflow-auto wxb-break-words wxb-mt-3.5"
      v-html="body"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { destroyAlert } from '@/stores/alertsStore'

const props = defineProps({
  id: {
    type: [String, Number],
    required: true
  },
  type: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    default: ''
  }
})

const alertClass = computed(() => [
  'wxb-alert',
  'wxb-p-3.5',
  'wxb-m-3.5',
  'wxb-cursor-pointer',
  `wxb-alert-${props.type}`
])
</script>

<style scoped>
.wxb-alert {
  width: 300px;
  max-height: 100px;
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  border-left: 4px solid;
}

.wxb-alert-success {
  @apply wxb-bg-green-400;
  @apply wxb-border-l-green-700;
}

.wxb-alert-info {
  @apply wxb-bg-blue-400;
  @apply wxb-border-l-blue-700;
}

.wxb-alert-error {
  @apply wxb-bg-red-400;
  @apply wxb-border-l-red-700;
}
</style>