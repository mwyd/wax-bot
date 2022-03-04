import { shallowRef, ref } from 'vue'
import GuardTab from '@/components/tabs/GuardTab.vue'
import MarketTab from '@/components/tabs/MarketTab.vue'
import TradesTab from '@/components/tabs/TradesTab.vue'

export default function useTabs() {
    const tabs = shallowRef({
        'Market': MarketTab,
        'Trades': TradesTab,
        'Guard': GuardTab
    })

    const activeTab = ref('Market')

    return {
        tabs,
        activeTab
    }
}