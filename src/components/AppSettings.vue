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
        <div class="wxb-py-2">
            <label class="wxb-block wxb-pb-2">
                Target market
            </label>
            <AppHorizontalSelect
                :options="Object.values(targetMarketEnum)"
                v-model="userPreferences.targetMarket"
            />
        </div>
        <AppButton 
            class="wxb-btn-big wxb-mt-2"
            @click="authenticateConduit"
        >
            Save
        </AppButton>
    </div>
</template>

<script>
import { computed } from 'vue'
import { session, authenticateConduit, userPreferences } from '@/stores/userStore'
import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppHorizontalSelect from '@/components/ui/AppHorizontalSelect.vue'
import targetMarketEnum from '@/enums/targetMarketEnum'

export default {
    components: {
        AppInput,
        AppButton,
        AppHorizontalSelect
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
            userPreferences,
            token,
            authenticateConduit,
            targetMarketEnum
        }
    }
}
</script>

<style scoped>
.wxb-settings {
    background-color: var(--bg-c-1);
    position: absolute;
    top: 70px;
    right: 0; 
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