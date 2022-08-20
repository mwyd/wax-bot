<template>
  <AppTabWrapper>
    <template #header>
      Instances - {{ botInstancesIds.length }}
    </template>
    <template #body>
      <AppScrollView>
        <div class="wxb-grid wxb-grid-cols-4 xl:wxb-grid-cols-5 wxb-gap-2">
          <BotInstance
            v-for="id in botInstancesIds"
            :key="id"
            :id="id"
          />
        </div>
      </AppScrollView>
      <AppActionsBar
        class="wxb-mt-4"
        :actions="actions"
      />
    </template>
  </AppTabWrapper>
</template>

<script>
import { computed, watch } from 'vue'
import AppActionsBar from '@/components/ui/AppActionsBar'
import AppScrollView from '@/components/ui/AppScrollView'
import AppTabWrapper from '@/components/ui/AppTabWrapper'
import BotInstance from '@/components/BotInstance'
import { botConfigs, addBotConfig, runningBotInstances, terminatedBotInstances } from '@/stores/botStore'
import { updateTabState } from '@/stores/tabsStore'
import processStateEnum from '@/enums/processStateEnum'

const actions = [
  { name: 'add', callback: addBotConfig },
  { name: 'start all', callback: () => terminatedBotInstances.value.forEach(instance => instance.toggle()) },
  { name: 'stop all', callback: () => runningBotInstances.value.forEach(instance => instance.toggle()) }
]

export default {
  components: {
    AppActionsBar,
    AppScrollView,
    AppTabWrapper,
    BotInstance
  },
  setup() {
    const botInstancesIds = computed(() => Object.keys(botConfigs.value))

    watch(() => runningBotInstances.value.length, (value) => {
      updateTabState('Bots', value ? processStateEnum.RUNNING : processStateEnum.TERMINATED)
    })

    return {
      botInstancesIds,
      actions
    }
  }
}
</script>

<style>

</style>