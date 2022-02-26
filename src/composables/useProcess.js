import { ref } from 'vue'
import processStateEnum from '@/enums/processStateEnum'

export default function useProcess() {
    const state = ref(processStateEnum.TERMINATED)

    const is = (processState) => state.value == processState

    const update = (processState) => state.value = processState

    return {
        is,
        update
    }
}