<template>
    <div>
        <div class="wxb-cs-market-item wxb-w-full wxb-p-[4px] wxb-flex">
            <CsItemHeader
                class="wxb-w-[100%]"
                :hashName="item.name"
                :imageUrl="item.image"
            />
            <CsItemPrice 
                class="wxb-flex-[0_0_160px]"
                :price="item.$price" 
                :waxpeer-discount="item.$discount"
                :steam-discount="item.$steam?.discount"
            />
            <div class="wxb-flex wxb-items-center wxb-flex-[0_0_100px] wxb-px-[8px]">
                <AppButton 
                    class="wxb-btn-big"
                    @click="buy"
                >
                    Buy
                </AppButton>
            </div>
        </div>
        <CsItemDetailsBar 
            :details="details" 
            :steam-owner="steamOwner"
            :wax-owner="waxOwner"
            :inspect-link="inspectLink"
        />
    </div>
</template>

<script>
import { toRef } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import CsItemHeader from './CsItemHeader.vue'
import CsItemPrice from './CsItemPrice.vue'
import CsItemDetailsBar from './CsItemDetailsBar.vue'
import useCsItemDetails from '@/composables/useCsItemDetails'
import { buyItem } from '@/stores/botStore'

export default {
    components: {
        CsItemHeader,
        CsItemPrice,
        AppButton,
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

        const buy = () => buyItem(item.value)

        return {
            buy,
            ...useCsItemDetails(item)
        }
    }
}
</script>

<style scoped>
.wxb-cs-market-item {
    background-color: var(--bg-c-3);
}
</style>