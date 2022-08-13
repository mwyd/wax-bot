<template>
  <CsItem :item="item">
    <div :class="statusClass">
      {{ status }}
    </div>
    <div class="wxb-flex wxb-items-center wxb-flex-lg wxb-px-2">
      {{ boughtDateTime }}
    </div>
  </CsItem>
</template>

<script>
import { computed, toRef } from 'vue'
import CsItem from '@/components/cs/CsItem'
import waxpeerCsItemStatusEnum from '@/enums/waxpeerCsItemStatusEnum'
import moment from 'moment'

export default {
  components: {
    CsItem
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const item = toRef(props, 'item')

    const status = computed(() => {
      let status = 'pending'

      switch (item.value.$status) {
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
      'wxb-px-2',
      `wxb-status-${status.value}`
    ])

    const boughtDateTime = computed(() => moment(item.value.$bought_at).format('YYYY-MM-DD HH:mm:ss'))

    return {
      status,
      statusClass,
      boughtDateTime
    }
  }
}
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