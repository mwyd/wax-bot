import { computed, reactive } from 'vue'
import { v4 as uuidv4 } from 'uuid'

const alerts = reactive(new Map())

const latestAlerts = computed(() => [...alerts.entries()].reverse())

const pushAlert = (alert, lifetime = 2 * 1000) => {
    const uuid = uuidv4()

    alerts.set(uuid, alert)

    if(lifetime != null) {
        setTimeout(() => destroyAlert(uuid), lifetime)
    }

    return uuid
}

const destroyAlert = (id) => {
    alerts.delete(id)
}

export {
    latestAlerts,
    pushAlert,
    destroyAlert
}