<template>
  <input
    v-model="internalModel"
    :class="inputClass"
    :type="type"
    :placeholder="placeholder"
    :disabled="disabled"
    @change="validateInternalModel"
  >
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { inputHighlightTimeout } from "@/config";

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  modelValue: {
    type: [String, Number],
    required: true,
  },
  modelModifiers: {
    type: Object,
    default: () => ({}),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: "",
  },
  validator: {
    type: Function,
    default: () => true,
  },
});

const emit = defineEmits(["update:modelValue"]);

const internalModel = ref(props.modelValue);

const errorOccurred = ref(false);

const inputClass = computed(() => [
  "wxb-input",
  errorOccurred.value ? "wxb-input-error" : "",
]);

watch(
  () => props.modelValue,
  (newValue) => (internalModel.value = newValue),
);

const updateModelValue = () => emit("update:modelValue", internalModel.value);

const validateInternalModel = () => {
  if (!props.validator(internalModel.value)) {
    errorOccurred.value = true;

    setTimeout(() => {
      internalModel.value = props.modelValue;

      errorOccurred.value = false;
    }, inputHighlightTimeout * 1000);

    return;
  }

  updateModelValue();
};
</script>

<style scoped>
.wxb-input-error {
  @apply wxb-bg-red-400 !important;
}
</style>
