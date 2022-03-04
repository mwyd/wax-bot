<template>
    <div class="wxb-header wxb-flex wxb-flex-[0_0_70px] wxb-justify-between wxb-items-center wxb-px-[10px] wxb-w-full">
        <div class="wxb-uppercase">
            <span class="wxb-font-bold">wax-bot</span>
            <sup class="wxb-pl-[4px]">1.0.0</sup>
        </div>
        <div class="wxb-flex wxb-h-full">
            <div 
                v-for="[key, tab] of Object.entries(tabs)"
                :key="key"
                :class="tabClass(key)"
                @click="$emit('tabChange', key)"
            >
                <div :class="tabStatusClass(tab.state)"></div>
                {{ key }}
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
            type: Object,
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
            'wxb-relative',
            'wxb-px-[10px]',
            'wxb-flex',
            'wxb-items-center',
            'wxb-justify-center',
            'wxb-cursor-pointer',
            'wxb-w-[100px]',
            'wxb-h-full',
            tab == activeTab.value ? 'wxb-active-tab' : ''
        ]

        const tabStatusClass = (status) => [
            'wxb-absolute',
            'wxb-top-[4px]',
            'wxb-left-[4px]',
            'wxb-h-[8px]',
            'wxb-w-[8px]',
            'wxb-rounded-[4px]',
            `wxb-tab-status-${status}`
        ]

        return {
            showSettings,
            tabClass,
            tabStatusClass
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

.wxb-tab-status-idle {
    background-color: blue;
}

.wxb-tab-status-running {
    background-color: green;
}

.wxb-tab-status-terminating {
    background-color: grey;
}

.wxb-tab-status-terminated {
    background-color: black;
}
</style>