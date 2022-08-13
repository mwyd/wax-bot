import { ref, reactive, nextTick } from 'vue'
import processStateEnum from '@/enums/processStateEnum'

const tabs = reactive({
  'Market': {
    componentName: 'MarketTab',
    state: processStateEnum.TERMINATED
  },
  'Bots': {
    componentName: 'BotsTab',
    state: processStateEnum.TERMINATED
  },
  'Trades': {
    componentName: 'TradesTab',
    state: processStateEnum.TERMINATED
  },
  'Guard': {
    componentName: 'GuardTab',
    state: processStateEnum.TERMINATED
  }
})

const activeTab = ref('Market')

const updateTabState = (key, state) => {
  tabs[key].state = state
}

const initializeTabsCache = async () => {
  const initialTab = activeTab.value

  for (const key in tabs) {
    if (key === initialTab) {
      continue
    }

    activeTab.value = key

    await nextTick()
  }

  activeTab.value = initialTab
}

export {
  tabs,
  activeTab,
  updateTabState,
  initializeTabsCache
}