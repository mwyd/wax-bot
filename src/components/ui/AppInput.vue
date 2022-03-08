<template>
    <input
        v-model="internalModel" 
        :class="inputClass" 
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        @focusout="rollbackInternalModel"
        @keydown.enter="validateInternalModel"
    />
</template>

<script>
import { computed, ref, toRefs, watch } from 'vue'

export default {
    props: {
        type: {
            type: String,
            required: true,
        },
        modelValue: {
            type: [String, Number],
            required: true
        },
        modelModifiers: {
            default: () => ({})
        },
        disabled: {
            type: Boolean,
            default: false
        },
        placeholder: {
            type: String,
            default: ''
        },
        validator: {
            type: Function,
            default: () => true
        }
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const { modelValue, validator } = toRefs(props)

        const internalModel = ref(modelValue.value)

        const errorOccured = ref(false)

        const inputClass = computed(() => [
            'wxb-input',
            errorOccured.value ? 'wxb-input--error': ''
        ])

        watch(modelValue, (newValue) => internalModel.value = newValue)

        const rollbackInternalModel = () => {
            internalModel.value = modelValue.value
        }

        const updateModelValue = () => {
            emit('update:modelValue', internalModel.value)
        }

        const validateInternalModel = () => {
            if(!validator.value(internalModel.value)) {
                errorOccured.value = true

                setTimeout(() => errorOccured.value = false, 0.25 * 1000)

                return
            }

            updateModelValue()
        }

        return {
            internalModel,
            inputClass,
            rollbackInternalModel,
            validateInternalModel
        }
    }
}
</script>

<style scoped>
.wxb-input--error {
    background-color: var(--state-e);
}
</style>