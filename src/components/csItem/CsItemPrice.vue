<template>
    <div class="wxb-flex wxb-items-center wxb-px-2">
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
import { computed, toRefs } from 'vue'

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
        }
    },
    setup(props) {
        const { waxpeerDiscount, steamDiscount } = toRefs(props)

        const discountElement = computed(() => {
            let content = `${waxpeerDiscount.value}%`

            if(steamDiscount.value) {
                content = `${steamDiscount.value}% | ` + content
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