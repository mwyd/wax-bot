<template>
    <AppTabLayout
        left-title="Manage"
        :right-title="'Items - ' + filteredItems.length"
    >
        <template #left>
            <AppScrollView>
                <div class="wxb-py-2">
                    <label class="wxb-block wxb-pb-2">
                        $ Bid step
                    </label>
                    <AppInput 
                        v-model.number="config.bidStep"
                        type="number"
                        :validator="value => (value > 0 && value < 100)"
                    />
                </div>
                <div class="wxb-py-2">
                    <label class="wxb-block wxb-pb-2">
                        % Safe discount
                    </label>
                    <AppInput 
                        v-model.number="config.safeDiscount"
                        type="number"
                        :validator="value => (value > 0 && value < 10)"
                    />
                </div>
                <div class="wxb-py-2">
                    <label class="wxb-block wxb-pb-2">
                        Pages
                    </label>
                    <AppInput 
                        v-model.number="config.pages"
                        type="number"
                        :validator="value => (value >= 1 && value <= 10)"
                    />
                </div>
                <div class="wxb-py-2">
                    <label class="wxb-block wxb-pb-2">
                        Update delay
                    </label>
                    <AppInput 
                        v-model.number="config.updateDelay" 
                        type="number"
                        :validator="value => (value >= 0 && value <= 300)"
                    />
                </div>
            </AppScrollView>
            <AppButton 
                class="wxb-btn-big wxb-mt-2 wxb-flex-[0_0_30px]"
                :disabled="isTerminating"
                @click="toggle"
            >
                <AppLoader 
                    v-if="isTerminating"
                    class="wxb-my-0 wxb-mx-auto" 
                />
                <span v-else>
                    {{ !isTerminated ? 'Stop' : 'Start' }}
                </span>
            </AppButton>
        </template>
        <template #right>
            <CsItemFilters 
                :default-filters="defaultFilters"
                :items="[...guardItems.values()]"
                @filter="items => filteredItems = items"
            />
            <div class="wxb-flex wxb-py-2">
                <div class="wxb-w-full wxb-px-2">Name</div>
                <div class="wxb-flex-[0_0_160px] wxb-px-2">Price</div>
                <div class="wxb-flex-[0_0_120px] wxb-px-2">Min price</div>
                <div class="wxb-flex-[0_0_120px] wxb-px-2">Max price</div>
                <div class="wxb-flex-[0_0_100px] wxb-px-2">Status</div>
            </div>
            <AppScrollView>
                <CsGuardItem
                    class="wxb-py-1"
                    v-for="item in filteredItems"
                    :key="item.item_id"
                    :item="item"
                />
            </AppScrollView>
            <div class="wxb-flex wxb-justify-end">
                <div class="wxb-text-xs wxb-text-right">
                    <span 
                        class="wxb-px-1 wxb-cursor-pointer wxb-text-[#616a80] hover:wxb-text-[#fff]"
                        @click="loadGuardItems"
                    >
                        refresh
                    </span>
                </div>
                <div class="wxb-text-xs wxb-text-right">
                    <span 
                        class="wxb-px-1 wxb-cursor-pointer wxb-text-[#616a80] hover:wxb-text-[#fff]"
                        @click="toggleGuardItemsStatus(false)"
                    >
                        observe all
                    </span>
                </div>
                <div class="wxb-text-xs wxb-text-right">
                    <span 
                        class="wxb-px-1 wxb-cursor-pointer wxb-text-[#616a80] hover:wxb-text-[#fff]"
                        @click="toggleGuardItemsStatus(true)"
                    >
                        ignore all
                    </span>
                </div>
            </div>
        </template>
    </AppTabLayout>
</template>

<script>
import { computed, ref } from 'vue'
import AppTabLayout from '@/components/ui/AppTabLayout.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppScrollView from '@/components/ui/AppScrollView.vue'
import AppLoader from '@/components/ui/AppLoader.vue'
import CsGuardItem from '@/components/csItem/CsGuardItem.vue'
import CsItemFilters from '@/components/csItem/CsItemFilters.vue'
import useGuard from '@/composables/useGuard'
import processStateEnum from '@/enums/processStateEnum'
import { config, guardItems, loadGuardItems, toggleGuardItemsStatus } from '@/stores/guardStore'
import { updateTabState } from '@/stores/tabsStore'
import csItemSortEnum from '@/enums/csItemSortEnum'

const defaultFilters = {
    sortBy: csItemSortEnum.MARKET_PRICE
}

export default {
    components: {
        AppTabLayout,
        AppButton,
        AppInput,
        AppScrollView,
        AppLoader,
        CsGuardItem,
        CsItemFilters
    },
    setup() {
        const filteredItems = ref([])

        const { process, toggle } = useGuard()

        const isTerminating = computed(() => process.is(processStateEnum.TERMINATING))

        const isTerminated = computed(() => process.is(processStateEnum.TERMINATED))

        process.subscribe((state) => updateTabState('Guard', state))

        return {
            filteredItems,
            isTerminating,
            isTerminated,
            guardItems,
            config,
            loadGuardItems,
            toggle,
            toggleGuardItemsStatus,
            defaultFilters
        }
    }
}
</script>

<style scoped>
.wxb-guard__start-btn {
    margin-top: 10px;
}
</style>