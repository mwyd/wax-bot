<template>
  <div class="wxb-header wxb-pl-14 wxb-pr-6">
    <div class="wxb-uppercase">
      <span class="wxb-font-bold">
        wax-bot
      </span>
      <sup class="wxb-pl-1.5">
        {{ version }}
      </sup>
    </div>
    <div class="wxb-flex wxb-h-full">
      <div
        v-for="[key, tab] of Object.entries(tabs)"
        :key="key"
        :class="tabClass(key)"
        @click="$emit('tabChange', key)"
      >
        <AppProcessIndicator
          class="wxb-absolute wxb-left-1.5 wxb-top-1.5"
          :state="tab.state"
        />
        {{ key }}
      </div>
    </div>
    <div
      class="wxb-header-settings-btn wxb-cursor-pointer wxb-relative wxb-z-20"
      @click="showSettings = true"
    >
      <div :class="settingsStatusClass" />
    </div>
  </div>
  <div
    v-if="showSettings"
    class="wxb-settings-wrapper wxb-z-20"
    @click.self="showSettings = false"
  >
    <AppSettings />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { version } from '@/config'
import { session } from '@/stores/userStore'
import AppProcessIndicator from '@/components/ui/AppProcessIndicator'
import AppSettings from '@/components/AppSettings'

const props = defineProps({
  tabs: {
    type: Object,
    required: true
  },
  activeTab: {
    type: String,
    required: true
  }
})

defineEmits(['tabChange'])

const showSettings = ref(false)

const tabClass = (tab) => [
  'wxb-header-tab',
  'wxb-px-3.5',
  'wxb-cursor-pointer',
  tab === props.activeTab ? 'wxb-header-tab-active' : ''
]

const settingsStatusClass = computed(() => [
  'wxb-settings-status',
  'wxb-rounded-full',
  session.conduitName != null ? 'wxb-settings-status-ok' : 'wxb-settings-status-fail'
])
</script>

<style scoped>
.wxb-header {
  display: flex;
  flex: 0 0 70px;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  @apply wxb-bg-gray-600;
}

.wxb-header-tab {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100%
}

.wxb-header-tab-active {
  @apply wxb-bg-gray-500;
}

.wxb-header-settings-btn {
  width: 16px;
  height: 16px;
  background-image: url('chrome-extension://__MSG_@@extension_id__/assets/img/settings.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}

.wxb-settings-status {
  position: absolute;
  top: -8px;
  left: -8px;
  height: 8px;
  width: 8px;
}

.wxb-settings-status-ok {
  @apply wxb-bg-green-400;
}

.wxb-settings-status-fail {
  @apply wxb-bg-red-400;
}

.wxb-settings-wrapper {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.2);
}
</style>