<template>
  <div class="wxb-bg-gray-700 wxb-p-2">
    <div class="wxb-flex wxb-justify-between wxb-items-center">
      <AppProcessIndicator :state="state"/>
      <span
        class="wxb-font-bold wxb-text-gray-300 wxb-cursor-pointer"
        @click="deleteBotInstance(id)"
      >
        -
      </span>
    </div>
    <div class="wxb-py-2">
      <label class="wxb-block wxb-pb-2">
        % Deal
      </label>
      <div class="wxb-flex wxb-gap-2">
        <AppInput
          v-model.number="config.deal"
          type="number"
          :validator="value => (value >= -1000 && value <= 100)"
        />
        <AppInput
          v-model.number="computedDealMargin"
          type="number"
          :validator="value => (value >= -config.deal && value <= 1000 - config.deal)"
        />
      </div>
    </div>
    <div class="wxb-py-2">
      <label class="wxb-block wxb-pb-2">
        $ Price
      </label>
      <div class="wxb-flex wxb-gap-2">
        <AppInput
          v-model.number="config.minPrice"
          type="number"
          :validator="value => (value >= 0 && value <= config.maxPrice)"
        />
        <AppInput
          v-model.number="config.maxPrice"
          type="number"
          :validator="value => (value >= config.minPrice && value <= 1000000)"
        />
      </div>
    </div>
    <div class="wxb-py-2">
      <label class="wxb-block wxb-pb-2">
        Search
      </label>
      <AppInput
        v-model="config.search"
        type="text"
        placeholder="Item name..."
      />
    </div>
    <div class="wxb-py-2">
      <label class="wxb-block wxb-pb-2">
        Pages
      </label>
      <AppInput
        v-model.number="config.pages"
        type="number"
        :validator="value => (value >= 1 && value <= 10)"
      />
    </div>
    <div class="wxb-py-2">
      <label class="wxb-block wxb-pb-2">
        Volume
      </label>
      <AppInput
        v-model.number="config.volume"
        type="number"
        :validator="value => (value >= 0 && value <= 10000)"
      />
    </div>
    <div class="wxb-py-2">
      <label class="wxb-block wxb-pb-2">
        Update delay
      </label>
      <AppInput
        v-model.number="config.updateDelay"
        type="number"
        :validator="value => (value >= 0 && value <= 300)"
      />
    </div>
    <AppButton
      class="wxb-btn-big wxb-mt-2 wxb-flex-xs"
      :disabled="isTerminating"
      @click="toggle"
    >
      {{ !isTerminated ? 'Stop' : 'Start' }}
    </AppButton>
  </div>
</template>

<script>
import { ref, computed, onUnmounted } from 'vue'
import AppProcessIndicator from '@/components/ui/AppProcessIndicator'
import AppInput from '@/components/ui/AppInput'
import AppButton from '@/components/ui/AppButton'
import { getBotConfig, deleteBotInstance, registerBotInstance } from '@/stores/botStore'
import useBot from '@/composables/useBot'
import processStateEnum from '@/enums/processStateEnum'

export default {
  components: {
    AppProcessIndicator,
    AppInput,
    AppButton
  },
  props: {
    id: {
      type: String,
      require: true
    }
  },
  setup(props) {
    const config = getBotConfig(props.id)

    const state = ref(processStateEnum.TERMINATED)

    const { process, activeItems, computedDealMargin, toggle } = useBot(config)

    const isTerminating = computed(() => process.is(processStateEnum.TERMINATING))

    const isTerminated = computed(() => process.is(processStateEnum.TERMINATED))

    process.subscribe((newState) => state.value = newState)

    onUnmounted(() => (!isTerminated.value && !isTerminating.value) && toggle())

    registerBotInstance(props.id, {
      state,
      activeItems,
      toggle
    })

    return {
      config,
      state,
      isTerminating,
      isTerminated,
      toggle,
      computedDealMargin,
      deleteBotInstance
    }
  }
}
</script>

<style>

</style>