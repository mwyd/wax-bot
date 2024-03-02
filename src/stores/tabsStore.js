import { ref, shallowReactive, nextTick } from "vue";
import processStateEnum from "@/enums/processStateEnum";
import MarketTab from "@/components/tabs/MarketTab";
import BotsTab from "@/components/tabs/BotsTab";
import TradesTab from "@/components/tabs/TradesTab";
import GuardTab from "@/components/tabs/GuardTab";

export const tabs = {
  Market: shallowReactive({
    component: MarketTab,
    state: processStateEnum.TERMINATED,
  }),
  Bots: shallowReactive({
    component: BotsTab,
    state: processStateEnum.TERMINATED,
  }),
  Trades: shallowReactive({
    component: TradesTab,
    state: processStateEnum.TERMINATED,
  }),
  Guard: shallowReactive({
    component: GuardTab,
    state: processStateEnum.TERMINATED,
  }),
};

export const activeTab = ref("Market");

export const updateTabState = (key, state) => {
  tabs[key].state = state;
};

export const initializeTabsCache = async () => {
  const initialTab = activeTab.value;

  for (const key in tabs) {
    if (key === initialTab) {
      continue;
    }

    activeTab.value = key;

    await nextTick();
  }

  activeTab.value = initialTab;
};
