<template>
  <div
    :class="alertClass"
    @click="destroyAlert(id)"
  >
    <h4 class="wxb-m-0">
      {{ title }}
    </h4>
    <div
      v-if="body != ''"
      v-html="body"
      class="wxb-w-full wxb-h-full wxb-overflow-auto wxb-break-words wxb-mt-2"
    >
    </div>
  </div>
</template>

<script>
import { computed, toRef } from 'vue'
import { destroyAlert } from '@/stores/alertsStore'

export default {
  props: {
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
  },
  setup(props) {
    const type = toRef(props, 'type')

    const alertClass = computed(() => [
      'wxb-alert',
      'wxb-p-2',
      'wxb-m-2',
      'wxb-cursor-pointer',
      `wxb-alert--${type.value}`
    ])

    return {
      alertClass,
      destroyAlert
    }
  }
}
</script>

<style scoped>
.wxb-alert {
  width: 300px;
  max-height: 100px;
  border-radius: 2px;
  display: flex;
  flex-direction: column;
}

.wxb-alert--success {
  background-color: var(--state-r);
  border-left: 4px solid #5fa777;
}

.wxb-alert--info {
  background-color: var(--state-i);
  border-left: 4px solid #5693c3;
}

.wxb-alert--error {
  background-color: var(--state-e);
  border-left: 4px solid #b56777;
}
</style>