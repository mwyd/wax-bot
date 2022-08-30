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
      <component :is="tabs[activeTab].componentName"/>
    </KeepAlive>
  </div>
  <AppAlertBox/>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { tabs, activeTab, initializeTabsCache } from '@/stores/tabsStore'
import GuardTab from '@/components/tabs/GuardTab'
import MarketTab from '@/components/tabs/MarketTab'
import TradesTab from '@/components/tabs/TradesTab'
import BotsTab from '@/components/tabs/BotsTab'
import AppHeader from '@/components/AppHeader'
import AppButton from '@/components/ui/AppButton'
import AppAlertBox from '@/components/AppAlertBox'

export default {
  components: {
    GuardTab,
    MarketTab,
    TradesTab,
    BotsTab,
    AppHeader,
    AppButton,
    AppAlertBox
  },
  setup() {
    const isHidden = ref(true)

    const appClass = computed(() => [
      'wxb-shadow-md',
      'wxb-app',
      isHidden.value ? 'wxb-app-hidden' : ''
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
  font-weight: 300;
  font-family: Commissioner, sans-serif;
  font-size: 1.4rem;
}

#wxb-root * {
  box-sizing: border-box;
}

.wxb-app {
  width: 100vw;
  height: 100vh;
  max-width: 1600px;
  max-height: 1200px;
  min-width: 1024px;
  display: flex;
  flex-direction: column;
  position: relative;
  @apply wxb-bg-gray-500;
}

.wxb-app-hidden {
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
