<template>
    <div class="wxb-settings wxb-p-2 wxb-shadow-md">
        <div class="wxb-settings__corner"></div>
        <div class="wxb-py-2">
            <label class="wxb-block wxb-pb-2">
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
    position: absolute;
    top: 70px;
    right: -100%; 
    width: 250px;
    z-index: 10; 
}

.wxb-settings__corner {
    transform: rotate(45deg);
    background-color: var(--bg-c-1);
    width: 16px;
    height: 16px;
    position: absolute;
    top: -8px;
    right: 16px;
}
</style>