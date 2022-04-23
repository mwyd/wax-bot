<template>
    <AppTabLayout
        left-title="Manage"
        :right-title="'Items - ' + filteredItems.length"
    >
        <template #left>
            <AppScrollView>
                <div class="wxb-py-2">
                    <label class="wxb-block wxb-pb-2">
                        % Deal
                    </label>
                    <div class="wxb-flex wxb-gap-2">
                        <AppInput 
                            v-model.number="config.deal"
                            type="number"
                            :validator="value => (value >= -1000 && value <= 100)"
                        />
                        <AppInput
                            v-model.number="config.dealMargin" 
                            type="number"
                            :validator="value => (value >= -config.deal && value <= 1000 - config.deal)"
                        />
                    </div>
                </div>
                <div class="wxb-py-2">
                    <label class="wxb-block wxb-pb-2">
                        $ Price
                    </label>
                    <div class="wxb-flex wxb-gap-2">
                        <AppInput 
                            v-model.number="config.minPrice" 
                            type="number"
                            :validator="value => (value >= 0 && value <= config.maxPrice)"
                        />
                        <AppInput 
                            v-model.number="config.maxPrice" 
                            type="number"
                            :validator="value => (value >= config.minPrice && value <= config.limit)"
                        />
                    </div>
                </div>
                <div class="wxb-py-2">
                    <label class="wxb-block wxb-pb-2">
                        $ Limit
                    </label>
                    <AppInput 
                        v-model.number="config.limit" 
                        type="number"
                        :validator="value => (value >= config.maxPrice && value <= 1000000)"
                    />
                </div>
                <div class="wxb-py-2">
                    <label class="wxb-block wxb-pb-2">
                        Search
                    </label>
                    <AppInput 
                        v-model="config.search" 
                        type="text"
                        placeholder="Item name..."
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
                        Steam volume
                    </label>
                    <AppInput 
                        v-model.number="config.steamVolume"
                        type="number"
                        :validator="value => (value >= 0 && value <= 10000)" 
                    />
                </div>
                <div class="wxb-py-2">
                    <label class="wxb-block wxb-pb-2">
                        Update delay
                    </label>
                    <AppInput 
                        v-model.number="config.updateDelay" 
                        type="number"
                        :validator="value => (value >= 1 && value <= 300)"
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
                :items="[...activeItems.values()]" 
                @filter="items => filteredItems = items"
            />
            <div class="wxb-flex wxb-py-2">
                <div class="wxb-w-full wxb-px-2">Name</div>
                <div class="wxb-flex-[0_0_160px] wxb-px-2">Price</div>
                <div class="wxb-flex-[0_0_100px] wxb-px-2">Status</div>
            </div>
            <AppScrollView>
                <CsMarketItem
                    class="wxb-py-1"
                    v-for="item in filteredItems"
                    :key="item.item_id"
                    :item="item"
                />
            </AppScrollView>
        </template>
    </AppTabLayout>
</template>

<script>
import { computed, ref } from 'vue'
import { config } from '@/stores/botStore'
import { updateTabState } from '@/stores/tabsStore'
import { userPreferences } from '@/stores/userStore'
import AppTabLayout from '@/components/ui/AppTabLayout.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppScrollView from '@/components/ui/AppScrollView.vue'
import AppLoader from '@/components/ui/AppLoader.vue'
import CsMarketItem from '@/components/csItem/CsMarketItem.vue'
import CsItemFilters from '@/components/csItem/CsItemFilters.vue'
import useBot from '@/composables/useBot'
import processStateEnum from '@/enums/processStateEnum'
import targetMarketEnum from '@/enums/targetMarketEnum'
import csItemSortEnum from '@/enums/csItemSortEnum'

export default {
    components: {
        AppTabLayout,
        AppButton,
        AppInput,
        AppScrollView,
        AppLoader,
        CsMarketItem,
        CsItemFilters
    },
    setup() {
        const defaultFilters = {
            sortBy: userPreferences.targetMarket == targetMarketEnum.BUFF
                ? csItemSortEnum.BUFF_DISCOUNT
                : csItemSortEnum.STEAM_DISCOUNT
        }

        const filteredItems = ref([])

        const { process, activeItems, toggle } = useBot()

        const isTerminating = computed(() => process.is(processStateEnum.TERMINATING))

        const isTerminated = computed(() => process.is(processStateEnum.TERMINATED))

        process.subscribe((state) => updateTabState('Market', state))

        return {
            defaultFilters,
            filteredItems,
            isTerminating,
            isTerminated,
            config,
            activeItems,
            toggle
        }
    }
}
</script>

<style>
</style>