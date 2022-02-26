<template>
    <AppTabLayout
        left-title="Manage"
        right-title="Items"
    >
        <template #left>
            <div>
                <div class="wxb-py-[8px]">
                    <label class="wxb-block wxb-pb-[8px]">
                        $ Bid step
                    </label>
                    <AppInput />
                </div>
                <div class="wxb-py-[8px]">
                    <label class="wxb-block wxb-pb-[8px]">
                        % Safe discount
                    </label>
                    <AppInput />
                </div>
                <div class="wxb-py-[8px]">
                    <label class="wxb-block wxb-pb-[8px]">
                        Update delay
                    </label>
                    <AppInput />
                </div>
                <AppButton class="wxb-btn-big wxb-mt-[8px]">
                    Start
                </AppButton>
            </div>
        </template>
        <template #right>
            <div>
                right 2
            </div>
        </template>
    </AppTabLayout>
</template>

<script>
import AppTabLayout from '@/components/ui/AppTabLayout.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'

export default {
    components: {
        AppTabLayout,
        AppButton,
        AppInput
    }
}
</script>

<style scoped>
.wxb-guard__start-btn {
    margin-top: 10px;
}
</style>