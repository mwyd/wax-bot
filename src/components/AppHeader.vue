<template>
    <div class="wxb-header wxb-pl-9 wxb-pr-4">
        <div class="wxb-uppercase">
            <span class="wxb-font-bold">
                wax-bot
            </span>
            <sup class="wxb-pl-1">
                {{ version }}
            </sup>
        </div>
        <div class="wxb-flex wxb-h-full">
            <div 
                v-for="[key, tab] of Object.entries(tabs)"
                :key="key"
                :class="tabClass(key)"
                @click="$emit('tabChange', key)"
            >
                <div :class="tabStateClass(tab.state)"></div>
                {{ key }}
            </div>
        </div>
        <div 
            class="wxb-header__settings-btn wxb-cursor-pointer wxb-relative wxb-z-20"
            @click="showSettings = true"
        >
            <div :class="settingsStatusClass"></div>
            <Teleport to="#wxb-root">
                <div 
                    v-if="showSettings"
                    class="wxb-settings-wrapper wxb-z-20"
                    @click.self="showSettings = false"
                >
                    <AppSettings />
                </div>
            </Teleport>
        </div>
    </div>
</template>

<script>
import { toRefs, ref, computed } from 'vue'
import { version } from '@/config'
import { session } from '@/stores/userStore'
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
            'wxb-header__tab',
            'wxb-px-2',
            'wxb-cursor-pointer',
            tab == activeTab.value ? 'wxb-header__tab--active' : ''
        ]

        const tabStateClass = (status) => [
            'wxb-tab__state',
            'wxb-rounded-full',
            `wxb-tab__state--${status}`
        ]

        const settingsStatusClass = computed(() => [
            'wxb-settings__status',
            'wxb-rounded-full',
            session.conduitName != null ? 'wxb-settings__status-ok' : 'wxb-settings__status-fail'
        ])

        return {
            version,
            showSettings,
            tabClass,
            tabStateClass,
            settingsStatusClass
        }
    }
}
</script>

<style scoped>
.wxb-header {
    background-color: var(--bg-c-2);
    display: flex; 
    flex: 0 0 70px; 
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.wxb-header__tab {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px;
    height: 100%
}

.wxb-header__tab--active {
    background-color: var(--bg-c-1);
}

.wxb-tab__state {
    position: absolute;
    top: 4px;
    left: 4px;
    height: 8px;
    width: 8px;
}

.wxb-tab__state--idle {
    background-color: var(--state-i);
}

.wxb-tab__state--running {
    background-color: var(--state-r);
}

.wxb-tab__state--terminating {
    background-color: var(--state-t1);
}

.wxb-tab__state--terminated {
    background-color: var(--state-t2);
}

.wxb-header__settings-btn {
    width: 16px;
    height: 16px;
    background-image: url('chrome-extension://__MSG_@@extension_id__/assets/img/settings.png');
    background-position: center; 
    background-repeat: no-repeat;
    background-size: contain;
}

.wxb-settings__status {
    position: absolute;
    top: -8px;
    left: -8px;
    height: 8px;
    width: 8px;
}

.wxb-settings__status-ok {
    background-color: var(--state-r);
}

.wxb-settings__status-fail {
    background-color: var(--state-e);
}

.wxb-settings-wrapper {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 100%;
    top: 0;
    background-color: rgba(0, 0, 0, 0.2);
}
</style>