<template>
  <div class="wxb-bg-gray-700 wxb-p-3.5">
    <div class="wxb-flex wxb-justify-between wxb-items-center">
      <AppProcessIndicator :state="state" />
      <span
        class="wxb-font-bold wxb-text-gray-300 wxb-cursor-pointer"
        @click="deleteBotInstance(id)"
      >
        -
      </span>
    </div>
    <AppInputWrapper label="% Deal">
      <div class="wxb-flex wxb-gap-3.5">
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
    </AppInputWrapper>
    <AppInputWrapper label="$ Price">
      <div class="wxb-flex wxb-gap-3.5">
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
    </AppInputWrapper>
    <AppInputWrapper label="Search">
      <AppInput
        v-model="config.search"
        type="text"
        placeholder="Item name..."
      />
    </AppInputWrapper>
    <AppInputWrapper label="Pages">
      <AppInput
        v-model.number="config.pages"
        type="number"
        :validator="value => (value >= 1 && value <= 10)"
      />
    </AppInputWrapper>
    <AppInputWrapper label="Volume">
      <AppInput
        v-model.number="config.volume"
        type="number"
        :validator="value => (value >= 0 && value <= 10000)"
      />
    </AppInputWrapper>
    <AppInputWrapper label="Update delay">
      <AppInput
        v-model.number="config.updateDelay"
        type="number"
        :validator="value => (value >= 0 && value <= 300)"
      />
    </AppInputWrapper>
    <AppButton
      class="wxb-btn-big wxb-mt-3.5 wxb-flex-xs"
      :disabled="isTerminating"
      @click="toggle"
    >
      {{ !isTerminated ? 'Stop' : 'Start' }}
    </AppButton>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import AppProcessIndicator from '@/components/ui/AppProcessIndicator'
import AppInput from '@/components/ui/AppInput'
import AppInputWrapper from '@/components/ui/AppInputWrapper'
import AppButton from '@/components/ui/AppButton'
import { getBotConfig, deleteBotInstance, registerBotInstance } from '@/stores/botStore'
import useBot from '@/composables/useBot'
import processStateEnum from '@/enums/processStateEnum'

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

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
</script>

<style>

</style>