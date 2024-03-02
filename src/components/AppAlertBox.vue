<template>
  <div
    class="wxb-fixed wxb-bottom-0 wxb-right-0 wxb-z-40 wxb-max-h-full wxb-overflow-y-auto wxb-overflow-x-hidden"
  >
    <TransitionGroup name="wxb-alerts">
      <AppAlert
        v-for="[id, alert] in alerts"
        v-bind="alert"
        :id="id"
        :key="id"
      />
    </TransitionGroup>
  </div>
</template>

<script setup>
import { alerts } from "@/stores/alertsStore";
import AppAlert from "@/components/ui/AppAlert";
</script>

<style scoped>
.wxb-alerts-enter-active,
.wxb-alerts-leave-active {
  transition: all 0.5s ease;
}

.wxb-alerts-enter-from,
.wxb-alerts-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
