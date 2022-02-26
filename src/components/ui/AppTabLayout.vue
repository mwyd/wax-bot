<template>
    <div class="wxb-flex wxb-h-full wxb-p-[10px]">
        <div class="wxb-layout-left wxb-flex-[0_0_250px] wxb-p-[10px] wxb-pr-[20px] wxb-flex wxb-flex-col">
            <h4 class="wxb-mt-0">
                {{ leftTitle }}
            </h4>
            <slot name="left" />
        </div>
        <div class="wxb-p-[10px] wxb-pl-[20px] wxb-w-full wxb-flex wxb-flex-col">
            <h4 class="wxb-mt-0">
                {{ rightTitle }}
            </h4>
            <slot name="right" />
        </div>
    </div>
</template>

<script>
export default {
    props: {
        leftTitle: {
            type: String,
            required: true
        },
        rightTitle: {
            type: String,
            required: true
        }
    }
}
</script>

<style scoped>
.wxb-layout-left {
    border-right: 1px solid var(--bg-c-2);
}
</style>