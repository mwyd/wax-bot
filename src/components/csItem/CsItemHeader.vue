<template>
    <div class="wxb-flex wxb-items-center wxb-px-[8px]">   
        <img 
            class="wxb-h-[50px] wxb-w-auto wxb-pr-[8px]"
            :src="imageUrl" 
        />
        <a 
            class="wxb-text-inherit"
            :href="steamMarketUrl" 
            target="_blank"
        >
            <div>
                {{ hashName }}
            </div>
        </a>
    </div>
</template>

<script>
import { computed, toRefs } from 'vue'

export default {
    props: {
        hashName: {
            type: String,
            required: true
        },
        imageUrl: {
            type: String,
            required: true
        }
    },
    setup(props) {
        const { hashName } = toRefs(props)

        const steamMarketUrl = computed(() => `https://steamcommunity.com/market/listings/730/${hashName.value}`)

        return {
            steamMarketUrl
        }
    }
}
</script>

<style>

</style>