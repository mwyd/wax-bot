import { ref, watchEffect } from 'vue'
import processStateEnum from '@/enums/processStateEnum'

export default function useProcess() {
    const state = ref(processStateEnum.TERMINATED)

    const is = (processState) => state.value == processState

    const update = (processState) => state.value = processState

    const subscribe = (callback) => {
        return watchEffect(() => callback(state.value)) 
    }

    return {
        is,
        update,
        subscribe
    }
}