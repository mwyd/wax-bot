<template>
  <div class="wxb-settings wxb-p-3.5 wxb-shadow-md">
    <div class="wxb-settings-corner" />
    <AppInputWrapper label="Conduit">
      <AppInput
        v-model="token"
        type="password"
        placeholder="Api key..."
      />
    </AppInputWrapper>
    <AppInputWrapper label="Target market">
      <AppHorizontalSelect
        v-model="userPreferences.targetMarket"
        :options="Object.values(targetMarketEnum)"
      />
    </AppInputWrapper>
    <AppInputWrapper label="Notification volume">
      <AppInput
        v-model="userPreferences.notificationVolume"
        type="range"
        :validator="value => value >= 0 && value <= 100"
        @click="notificationSound.play()"
      />
    </AppInputWrapper>
    <AppButton
      class="wxb-btn-big wxb-mt-3.5"
      @click="authenticateConduit"
    >
      Save
    </AppButton>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { session, authenticateConduit, userPreferences } from '@/stores/userStore'
import { notificationSound } from '@/config'
import AppInput from '@/components/ui/AppInput'
import AppInputWrapper from '@/components/ui/AppInputWrapper'
import AppButton from '@/components/ui/AppButton'
import AppHorizontalSelect from '@/components/ui/AppHorizontalSelect'
import targetMarketEnum from '@/enums/targetMarketEnum'

const token = computed({
  get() {
    return session.token || ''
  },
  set(value) {
    session.token = value
  }
})
</script>

<style scoped>
.wxb-settings {
  position: absolute;
  top: 70px;
  right: 0;
  width: 250px;
  z-index: 10;
  @apply wxb-bg-gray-500;
}

.wxb-settings-corner {
  transform: rotate(45deg);
  width: 16px;
  height: 16px;
  position: absolute;
  top: -8px;
  right: 16px;
  @apply wxb-bg-gray-500;
}
</style>