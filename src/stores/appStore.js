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

const updateTabState = (key, newState) => {
    tabs[key].state = newState
}

export {
    tabs,
    activeTab,
    updateTabState
}