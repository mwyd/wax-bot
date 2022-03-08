import { ref, reactive } from 'vue'
import processStateEnum from '@/enums/processStateEnum'

const tabs = reactive({
    'Market': {
        componentName: 'MarketTab',
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

const initializeTabsCache = () => {
    const initialTab = activeTab.value

    activeTab.value = 'Trades'

    setTimeout(() => activeTab.value = 'Guard', 0.1 * 1000)

    setTimeout(() => activeTab.value = initialTab, 0.2 * 1000)
}

export {
    tabs,
    activeTab,
    updateTabState,
    initializeTabsCache
}