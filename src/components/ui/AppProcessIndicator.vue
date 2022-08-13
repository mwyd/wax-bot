<template>
  <div :class="indicatorClass"></div>
</template>

<script>
import { computed } from 'vue'

export default {
  props: {
    state: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const indicatorClass = computed(() => [
      'wxb-h-2',
      'wxb-w-2',
      'wxb-rounded-full',
      `wxb-indicator-${props.state}`
    ])

    return {
      indicatorClass
    }
  }
}
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