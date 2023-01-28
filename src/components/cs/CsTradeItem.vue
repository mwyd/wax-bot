<template>
  <CsItem :item="item">
    <div :class="statusClass">
      {{ status }}
    </div>
    <div class="wxb-flex wxb-items-center wxb-flex-lg wxb-px-3.5">
      {{ boughtDateTime }}
    </div>
  </CsItem>
</template>

<script setup>
import { computed } from 'vue'
import CsItem from '@/components/cs/CsItem'
import waxpeerCsItemStatusEnum from '@/enums/waxpeerCsItemStatusEnum'
import moment from 'moment'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const status = computed(() => {
  let status = 'pending'

  switch (props.item.$status) {
    case waxpeerCsItemStatusEnum.ACCEPTED:
      status = 'accepted'
      break

    case waxpeerCsItemStatusEnum.CANCELED:
      status = 'canceled'
      break
  }

  return status
})

const statusClass = computed(() => [
  'wxb-flex',
  'wxb-items-center',
  'wxb-flex-lg',
  'wxb-px-3.5',
  `wxb-status-${status.value}`
])

const boughtDateTime = computed(() => moment(props.item.$bought_at).format('YYYY-MM-DD HH:mm:ss'))
</script>

<style scoped>
.wxb-status-pending {
  @apply wxb-text-blue-400;
}

.wxb-status-accepted {
  @apply wxb-text-green-400;
}

.wxb-status-canceled {
  @apply wxb-text-red-400;
}
</style>