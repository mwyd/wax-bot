<template>
    <AppTabLayout
        left-title="Manage"
        :right-title="'Items - ' + sortedItems.length"
    >
        <template #left>
            <AppScrollView>
                <div class="wxb-py-[8px]">
                    <label class="wxb-block wxb-pb-[8px]">
                        % Deal
                    </label>
                    <div class="wxb-flex wxb-gap-[8px]">
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
                <div class="wxb-py-[8px]">
                    <label class="wxb-block wxb-pb-[8px]">
                        $ Price
                    </label>
                    <div class="wxb-flex wxb-gap-[8px]">
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
                <div class="wxb-py-[8px]">
                    <label class="wxb-block wxb-pb-[8px]">
                        $ Limit
                    </label>
                    <AppInput 
                        v-model.number="config.limit" 
                        type="number"
                        :validator="value => (value >= config.maxPrice && value <= 1000000)"
                    />
                </div>
                <div class="wxb-py-[8px]">
                    <label class="wxb-block wxb-pb-[8px]">
                        Search
                    </label>
                    <AppInput 
                        v-model="config.search" 
                        type="text"
                        placeholder="Item name..."
                    />
                </div>
                <div class="wxb-py-[8px]">
                    <label class="wxb-block wxb-pb-[8px]">
                        Pages
                    </label>
                    <AppInput 
                        v-model.number="config.pages"
                        type="number"
                        :validator="value => (value >= 1 && value <= 10)" 
                    />
                </div>
                <div class="wxb-py-[8px]">
                    <label class="wxb-block wxb-pb-[8px]">
                        Steam volume
                    </label>
                    <AppInput 
                        v-model.number="config.steamVolume"
                        type="number"
                        :validator="value => (value >= 0 && value <= 10000)" 
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
                <div class="wxb-flex-[0_0_100px] wxb-px-[8px]">Status</div>
            </div>
            <AppScrollView>
                <CsMarketItem
                    class="wxb-py-[4px]"
                    v-for="item in sortedItems"
                    :key="item.item_id"
                    :item="item"
                />
            </AppScrollView>
        </template>
    </AppTabLayout>
</template>

<script>
import { computed } from 'vue'
import AppTabLayout from '@/components/ui/AppTabLayout.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppScrollView from '@/components/ui/AppScrollView.vue'
import CsMarketItem from '@/components/csItem/CsMarketItem.vue'
import useBot from '@/composables/useBot'
import processStateEnum from '@/enums/processStateEnum'
import { updateTabState } from '@/stores/appStore'

export default {
    components: {
        AppTabLayout,
        AppButton,
        AppInput,
        AppScrollView,
        CsMarketItem
    },
    setup() {
        const { process, config, items, toggle } = useBot()

        const isTerminating = computed(() => process.is(processStateEnum.TERMINATING))

        const isTerminated = computed(() => process.is(processStateEnum.TERMINATED))

        const sortedItems = computed(() => {
            return [...items.values()]
                .sort((a, b) => (b.$steam?.discount || b.$discount) - (a.$steam?.discount || a.$discount))
        })

        process.subscribe((state) => updateTabState('Market', state))

        return {
            isTerminating,
            isTerminated,
            config,
            sortedItems,
            toggle
        }
    }
}
</script>

<style>
</style>