<template>
  <input
    v-model="internalModel"
    :class="inputClass"
    :type="type"
    :placeholder="placeholder"
    :disabled="disabled"
    @change="validateInternalModel"
  />
</template>

<script>
import { computed, ref, toRefs, watch } from 'vue'
import { inputHighlightTimeout } from '@/config'

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

    const errorOccurred = ref(false)

    const inputClass = computed(() => [
      'wxb-input',
      errorOccurred.value ? 'wxb-input-error' : ''
    ])

    watch(modelValue, (newValue) => internalModel.value = newValue)

    const updateModelValue = () => emit('update:modelValue', internalModel.value)

    const validateInternalModel = () => {
      if (!validator.value(internalModel.value)) {
        errorOccurred.value = true

        setTimeout(() => {
          internalModel.value = modelValue.value

          errorOccurred.value = false
        }, inputHighlightTimeout * 1000)

        return
      }

      updateModelValue()
    }

    return {
      internalModel,
      inputClass,
      validateInternalModel
    }
  }
}
</script>

<style scoped>
.wxb-input-error {
  @apply wxb-bg-red-400;
}
</style>