<template>
    <AppButton
        class="wxb-toggle-btn"
        @click="isHidden = !isHidden"
    >
        {{ isHidden ? '›' : '‹' }}
    </AppButton>
    <div :class="appClass">
        <AppHeader 
            :tabs="tabs"
            :active-tab="activeTab"
            @tabChange="tab => activeTab = tab"
        />
        <KeepAlive>
            <component :is="tabs[activeTab].componentName" />
        </KeepAlive>
    </div>
    <AppAlertBox />
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { setupStores } from '@/stores'
import { tabs, activeTab, initializeTabsCache } from '@/stores/tabsStore'
import GuardTab from '@/components/tabs/GuardTab.vue'
import MarketTab from '@/components/tabs/MarketTab.vue'
import TradesTab from '@/components/tabs/TradesTab.vue'
import AppHeader from '@/components/AppHeader.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppAlertBox from '@/components/AppAlertBox.vue'

export default {
    components: {
        GuardTab,
        MarketTab,
        TradesTab,
        AppHeader,
        AppButton,
        AppAlertBox
    },
    setup() {
        setupStores()

        const isHidden = ref(true)

        const appClass = computed(() => [
            'wxb-shadow-md',
            'wxb-app',
            isHidden.value ? 'wxb-app--hidden' : ''
        ])

        onMounted(initializeTabsCache)

        return {
            tabs,
            activeTab,
            isHidden,
            appClass
        }
    }
}

</script>

<style>
#wxb-root {
    width: 100vw;
    max-width: 1280px;
    height: 100vh;
    max-height: 720px;
    position: fixed;
    top: 0;
    left: 0;
    transform: translateX(-100%);
    z-index: 1000;
    color: white;
    font-family: Montserrat, sans-serif;
}

#wxb-root * {
    box-sizing: border-box;
}

.wxb-app {
    width: 100%;
    height: 100%;
    background-color: var(--bg-c-1);
    transform: translateX(100%);
    display: flex;
    flex-direction: column;
}

.wxb-app--hidden {
    transform: translateX(0%);
}

.wxb-toggle-btn {
    position: fixed;
    top: 0;
    left: 100%;
    width: 20px;
    height: 70px;
    font-size: 20px;
    z-index: 10;
}
</style>
