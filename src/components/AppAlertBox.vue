<template>
    <div class="wxb-fixed wxb-top-0 wxb-left-full wxb-z-10000">
        <TransitionGroup name="wxb-alerts">
            <AppAlert 
                v-for="[id, alert] in latestAlerts"
                v-bind="alert"
                :key="id"
                :id="id"    
            />
        </TransitionGroup>
    </div>
</template>

<script>
import { latestAlerts } from '@/stores/alertsStore'
import AppAlert from '@/components/ui/AppAlert.vue'

export default {
    components: {
        AppAlert
    },
    setup() {
        return {
            latestAlerts
        }
    }
}
</script>

<style scoped>
.wxb-alerts-enter-active, .wxb-alerts-leave-active {
    transition: all 0.5s ease;
}

.wxb-alerts-enter-from, .wxb-alerts-leave-to {
    opacity: 0;
    transform: translateX(-30px);
}

</style>