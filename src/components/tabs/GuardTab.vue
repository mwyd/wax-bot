<template>
    <AppTabLayout
        left-title="Manage"
        :right-title="'Items - ' + guardItems.size"
    >
        <template #left>
            <AppScrollView>
                <div class="wxb-py-[8px]">
                    <label class="wxb-block wxb-pb-[8px]">
                        $ Bid step
                    </label>
                    <AppInput 
                        v-model.number="config.bidStep"
                        type="number"
                        :validator="value => (value > 0 && value < 100)"
                    />
                </div>
                <div class="wxb-py-[8px]">
                    <label class="wxb-block wxb-pb-[8px]">
                        % Safe discount
                    </label>
                    <AppInput 
                        v-model.number="config.safeDiscount"
                        type="number"
                        :validator="value => (value > 0 && value < 10)"
                    />
                </div>
                <div class="wxb-py-[8px]">
                    <label class="wxb-block wxb-pb-[8px]">
                        Pages
                    </label>
                    <AppInput 
                        v-model.number="config.pages"
                        type="number"
                        :validator="value => (value > 0 && value < 10)"
                    />
                </div>
                <div class="wxb-py-[8px]">
                    <label class="wxb-block wxb-pb-[8px]">
                        Update delay
                    </label>
                    <AppInput 
                        v-model.number="config.updateDelay" 
                        type="number"
                        :validator="value => (value >= 1 && value <= 10)"
                    />
                </div>
            </AppScrollView>
            <AppButton 
                class="wxb-btn-big wxb-mt-[8px] wxb-flex-[0_0_30px]"
                :disabled="isTerminating"
                @click="toggle"
            >
                {{ !isTerminated ? 'Stop' : 'Start' }}
            </AppButton>
        </template>
        <template #right>
            <div class="wxb-flex wxb-py-[8px]">
                <div class="wxb-w-full wxb-px-[8px]">Name</div>
                <div class="wxb-flex-[0_0_160px] wxb-px-[8px]">Price</div>
                <div class="wxb-flex-[0_0_120px] wxb-px-[8px]">Min price</div>
                <div class="wxb-flex-[0_0_120px] wxb-px-[8px]">Max price</div>
                <div class="wxb-flex-[0_0_100px] wxb-px-[8px]">Status</div>
            </div>
            <AppScrollView>
                <CsGuardItem
                    class="wxb-py-[4px]"
                    v-for="[id, item] in guardItems"
                    :key="id"
                    :item="item"
                />
            </AppScrollView>
            <div class="wxb-text-[12px] wxb-text-right">
                <span 
                    class="wxb-px-[4px] wxb-cursor-pointer wxb-text-[#616a80] hover:wxb-text-[#fff]"
                    @click="loadGuardItemsData"
                >
                    refresh
                </span>
            </div>
        </template>
    </AppTabLayout>
</template>

<script>
import { computed } from 'vue'
import AppTabLayout from '@/components/ui/AppTabLayout.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppScrollView from '@/components/ui/AppScrollView.vue'
import CsGuardItem from '@/components/csItem/CsGuardItem.vue'
import useGuard from '@/composables/useGuard'
import processStateEnum from '@/enums/processStateEnum'
import { config, guardItems, loadGuardItemsData } from '@/stores/guardStore'

export default {
    components: {
        AppTabLayout,
        AppButton,
        AppInput,
        AppScrollView,
        CsGuardItem
    },
    setup() {
        const { process, toggle } = useGuard()

        const isTerminating = computed(() => process.is(processStateEnum.TERMINATING))

        const isTerminated = computed(() => process.is(processStateEnum.TERMINATED))

        return {
            isTerminating,
            isTerminated,
            guardItems,
            config,
            loadGuardItemsData,
            toggle
        }
    }
}
</script>

<style scoped>
.wxb-guard__start-btn {
    margin-top: 10px;
}
</style>