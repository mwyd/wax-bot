<template>
    <div class="wxb-settings wxb-absolute wxb-top-[70px] wxb-right-[-100%] wxb-w-[250px] wxb-z-10 wxb-p-[10px] wxb-shadow-md">
        <div class="wxb-settings-corner wxb-w-[16px] wxb-h-[16px] wxb-absolute wxb-top-[-8px] wxb-right-[10px]">
            
        </div>
        <div class="wxb-py-[8px]">
            <label class="wxb-block wxb-pb-[8px]">
                Conduit
            </label>
            <AppInput 
                v-model="token"
                type="password"
                placeholder="Api key..."
            />
        </div>
    </div>
</template>

<script>
import { computed } from 'vue'
import { session } from '@/stores/userStore'
import AppInput from '@/components/ui/AppInput.vue'

export default {
    components: {
        AppInput
    },
    setup() {
        const token = computed({
            get() {
                return session.token || ''
            },
            set(value) {
                session.token = value
            }
        })

        return {
            token
        }
    }
}
</script>

<style scoped>
.wxb-settings {
    background-color: var(--bg-c-1);
}

.wxb-settings-corner {
    transform: rotate(45deg);
    background-color: var(--bg-c-1);
}
</style>