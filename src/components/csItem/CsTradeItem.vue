<template>
    <div>
        <div class="wxb-cs-market-item wxb-w-full wxb-p-1 wxb-flex">
            <CsItemHeader
                class="wxb-w-[100%]"
                :hash-name="item.name"
                :image-url="item.image"
            />
            <CsItemPrice 
                class="wxb-flex-[0_0_160px]"
                :price="item.$price" 
                :waxpeer-discount="item.$discount"
                :steam-discount="item.$steam?.discount"
            />
            <div :class="statusClass">
                {{ status }}
            </div>
            <div class="wxb-flex wxb-items-center wxb-flex-[0_0_160px] wxb-px-2">
                {{ boughtDateTime }}
            </div>
        </div>
        <CsItemDetailsBar 
            :details="details" 
            :steam-owner="item.$owner"
            :wax-owner="item.by"
            :inspect-link="item.$inspect_link"
            :hash-name="item.name"
        />
    </div>
</template>

<script>
import { computed, toRef } from 'vue'
import CsItemHeader from './CsItemHeader.vue'
import CsItemPrice from './CsItemPrice.vue'
import CsItemDetailsBar from './CsItemDetailsBar.vue'
import useCsItemDetails from '@/composables/useCsItemDetails'
import waxpeerCsItemStatusEnum from '@/enums/waxpeerCsItemStatusEnum'
import moment from 'moment'

export default {
    components: {
        CsItemHeader,
        CsItemPrice,
        CsItemDetailsBar
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

            switch(item.value.$status) {
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
            'wxb-flex-[0_0_160px]',
            'wxb-px-2',
            `wxb-cs-item-status--${status.value}`
        ])

        const boughtDateTime = computed(() => moment(item.value.$bought_at).format('YYYY-MM-DD HH:mm:ss'))

        return {
            status,
            statusClass,
            boughtDateTime,
            ...useCsItemDetails(item.value)
        }
    }
}
</script>

<style scoped>
.wxb-cs-market-item {
    background-color: var(--bg-c-3);
}

.wxb-cs-item-status--pending {
    color: var(--state-i);
}

.wxb-cs-item-status--accepted {
    color: var(--state-r);
}

.wxb-cs-item-status--canceled {
    color: var(--state-e);
}
</style>