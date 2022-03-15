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
    position: fixed;
    top: 0;
    left: 0;
    width: 0;
    height: 0;
    z-index: 1000;
    color: white;
    font-family: Montserrat, sans-serif;
}

#wxb-root * {
    box-sizing: border-box;
}

.wxb-app {
    width: 100vw;
    height: 100vh;
    max-width: 1600px;
    max-height: 1200px;
    background-color: var(--bg-c-1);
    display: flex;
    flex-direction: column;
    position: relative;
}

.wxb-app--hidden {
    transform: translateX(-100%);
}

.wxb-toggle-btn {
    position: fixed;
    top: 0;
    left: 0;
    width: 20px;
    height: 70px;
    font-size: 20px;
    z-index: 10;
}
</style>
