<template>
    <div class="wxb-header wxb-flex wxb-flex-[0_0_70px] wxb-justify-between wxb-items-center wxb-px-[10px] wxb-w-full">
        <div class="wxb-uppercase">
            <span class="wxb-font-bold">wax-bot</span>
            <sup class="wxb-pl-[4px]">1.0.0</sup>
        </div>
        <div class="wxb-flex wxb-h-full">
            <div 
                v-for="tab of tabs"
                :key="tab"
                :class="tabClass(tab)"
                @click="$emit('tabChange', tab)"
            >
                {{ tab }}
            </div>
        </div>
        <div 
            class="wxb-settings-btn wxb-w-[16px] wxb-h-[16px] wxb-cursor-pointer wxb-bg-center wxb-bg-no-repeat wxb-bg-contain"
            @click="showSettings = !showSettings"
        >
            <Teleport to="#wxb-root">
                <AppSettings v-if="showSettings" />
            </Teleport>
        </div>
    </div>
</template>

<script>
import { toRefs, ref } from 'vue'
import AppSettings from '@/components/AppSettings.vue'

export default {
    components: {
        AppSettings
    },
    props: {
        tabs: {
            type: Array,
            required: true
        },
        activeTab: {
            type: String,
            required: true
        }
    },
    emits: ['tabChange'],
    setup(props) {
        const { activeTab } = toRefs(props)

        const showSettings = ref(false)

        const tabClass = (tab) => [
            'wxb-px-[10px]',
            'wxb-flex',
            'wxb-items-center',
            'wxb-justify-center',
            'wxb-cursor-pointer',
            'wxb-w-[100px]',
            'wxb-h-full',
            tab == activeTab.value ? 'wxb-active-tab' : ''
        ]

        return {
            showSettings,
            tabClass
        }
    }
}
</script>

<style scoped>
.wxb-header {
    background-color: var(--bg-c-2);
}

.wxb-active-tab {
    background-color: var(--bg-c-1);
}

.wxb-settings-btn {
    background-image: url('chrome-extension://__MSG_@@extension_id__/assets/img/settings.png');
}
</style>