<template>
  <div class="wxb-flex wxb-flex-col wxb-h-full wxb-p-4">
    <h4 class="wxb-mt-0 wxb-flex wxb-justify-between">
      <span>
        Instances - {{ botInstancesIds.length }}
      </span>
      <span>
        Limit $ 0 / {{ limit }}
      </span>
    </h4>
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
  </div>
</template>

<script>
import { computed, watch } from 'vue'
import AppActionsBar from '@/components/ui/AppActionsBar'
import AppScrollView from '@/components/ui/AppScrollView'
import BotInstance from '@/components/BotInstance'
import { botConfigs, addBotConfig, runningBotInstances, terminatedBotInstances } from '@/stores/botStore'
import { updateTabState } from '@/stores/tabsStore'
import { roundNumber } from '@/utils'
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
    BotInstance
  },
  setup() {
    const botInstancesIds = computed(() => Object.keys(botConfigs.value))

    const limit = computed(() => roundNumber(
      Object.values(botConfigs.value).reduce((a, config) => a + config.limit, 0),
      3
    ))

    watch(() => runningBotInstances.value.length, (value) => {
      updateTabState('Bots', value ? processStateEnum.RUNNING : processStateEnum.TERMINATED)
    })

    return {
      botInstancesIds,
      limit,
      actions
    }
  }
}
</script>

<style>

</style>