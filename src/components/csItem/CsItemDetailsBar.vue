<template>
    <div class="wxb-cs-item-details-bar wxb-w-full wxb-p-1 wxb-flex wxb-flex-wrap wxb-items-center">
        <span
            v-for="(detail, i) in existingDetails"
            :key="`${detail.name}-${i}`"
            :class="csItemDetailClass(detail.rarity)"
        >
            <span class="wxb-cs-item-detail-title">
                {{ detail.name }}
            </span>
            {{ detail.value }}
        </span> 
        <span 
            v-if="steamOwner"
            class="wxb-px-2 wxb-py-1"
        >
            <a 
                class="wxb-text-inherit"
                :href="'https://steamcommunity.com/profiles/' + steamOwner"
                target="_blank"
            >
                <span class="wxb-cs-item-detail-title">
                    Steam 
                </span>
                owner
            </a>
        </span> 
        <span 
            v-if="waxOwner"
            class="wxb-px-2 wxb-py-1"
        >
            <a 
                class="wxb-text-inherit"
                :href="'https://waxpeer.com/shop/' + waxOwner"
                target="_blank"
            >
                <span class="wxb-cs-item-detail-title">
                    Waxpeer  
                </span>
                owner
            </a>
        </span> 
        <span 
            class="wxb-px-2 wxb-py-1 wxb-cursor-pointer"
            v-if="inspectLink"
            @click="copyToClipboard(inspectLink)"
        >
            <span class="wxb-cs-item-detail-title">
                Inspect  
            </span>
            link
        </span> 
    </div>
</template>

<script>
import { computed, toRefs } from 'vue'
import { copyToClipboard } from '@/utils'

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

        const csItemDetailClass = (rarity) => [
            'wxb-px-2',
            'wxb-py-1',
            `wxb-cs-item-detail--${rarity}`
        ]

        return {
            existingDetails,
            copyToClipboard,
            csItemDetailClass
        }
    }
}
</script>

<style scoped>
.wxb-cs-item-details-bar {
    background-color: var(--bg-c-2);
}

.wxb-cs-item-detail-title {
    color: #b5bbc3;
}

.wxb-cs-item-detail--common {
    color: inherit;
}

.wxb-cs-item-detail--infrequent {
    color: sandybrown;
}

.wxb-cs-item-detail--rare {
    color: yellow;
}
</style>