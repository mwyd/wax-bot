<template>
    <div class="wxb-cs-item-details-bar wxb-w-full wxb-p-[4px] wxb-flex wxb-items-center">
        <span
            class="wxb-px-[8px] wxb-py-[4px]"
            v-for="(detail, i) in existingDetails"
            :key="`${detail.name}-${i}`"
        >
            <span class="wxb-text-[#b5bbc3]">
                {{ detail.name }}
            </span>
            {{ detail.value }}
        </span> 
    </div>
</template>

<script>
import { computed, toRefs } from 'vue'

export default {
    props: {
        details: {
            type: Array,
            required: true
        },
        steamOwner: {
            type: String
        },
        waxOwner: {
            type: String
        },
        inspectLink: {
            type: String
        }
    },
    setup(props) {
        const { details } = toRefs(props)

        const existingDetails = computed(() => {
            return details.value.filter(e => e.value != null)
        })

        return {
            existingDetails
        }
    }
}
</script>

<style scoped>
.wxb-cs-item-details-bar {
    background-color: var(--bg-c-2);
}
</style>