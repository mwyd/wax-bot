<template>
    <div class="wxb-flex wxb-h-select">
        <div 
            v-for="(option, i) in options"
            :key="`${option}-${i}`"
            :class="optionClass(option)"
            @click="$emit('update:modelValue', option)"
        >
            {{ option }}
        </div>
    </div>
</template>

<script>
import { toRef } from 'vue'

export default {
    props: {
        options: {
            type: Array,
            required: true
        },
        modelValue: {
            type: [String, Number],
            required: true
        },
        modelModifiers: {
            default: () => ({})
        },
    },
    emits: ['update:modelValue'],
    setup(props) {
        const modelValue = toRef(props, 'modelValue')

        const optionClass = (isSelected) => [
            'wxb-p-1',
            'wxb-w-full',
            'wxb-text-center',
            'wxb-cursor-pointer',
            isSelected == modelValue.value ? 'wxb-h-select__option--selected' : '',
        ]

        return {
            optionClass
        }
    }
}
</script>

<style scoped>
.wxb-h-select {
    background: var(--i-bg-c);
    border: 1px solid var(--i-br-c);
    border-radius: 2px;
}

.wxb-h-select__option--selected {
    border-radius: inherit;
    background: var(--state-t2);
}
</style>