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
        },
        onUpdate: {
            type: Function,
            default: () => {}
        }
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const { modelValue, validator, onUpdate } = toRefs(props)

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

            onUpdate.value()
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
.wxb-input {
    display: block;
    height: 30px;
    border-radius: 2px;
    width: 100%;
    background-color: rgba(32,33,38,.47);
    border: 1px solid #383e4a;
    padding: 4px;
    color: inherit;
    font-size: inherit;
}

.wxb-input--error {
    background-color: red;
}
</style>