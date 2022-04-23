<template>
    <div class="wxb-flex wxb-items-center wxb-px-2 wxb-overflow-hidden wxb-whitespace-nowrap">
        <span>
            $ {{ price }}
            <sup 
                class="wxb-text-orange-500 wxb-font-bold wxb-text-sm" 
                v-html="discountElement"
            ></sup>
        </span>
    </div>
</template>

<script>
import { computed } from 'vue'
import { userPreferences } from '@/stores/userStore'

export default {
    props: {
        price: {
            type: Number,
            required: true
        },
        waxpeerDiscount: {
            type: Number,
            required: true
        },
        steamDiscount: {
            type: Number
        },
        buffDiscount: {
            type: Number
        }
    },
    setup(props) {
        const discountElement = computed(() => {
            let content = `${props.waxpeerDiscount}%`

            const targetMarketDiscount = props[`${userPreferences.targetMarket}Discount`]

            if(targetMarketDiscount != null) {
                content = `${targetMarketDiscount}% | ` + content
            }

            return `<span>${content}</span>`
        })

        return {
            discountElement
        }
    }
}
</script>

<style>

</style>