<template>
  <button
    class="wxb-btn"
    :type="type"
    :disabled="disabled"
  >
    <AppLoader
      v-if="disabled"
      class="wxb-mx-auto"
    />
    <span v-else>
      <slot>Click</slot>
    </span>
  </button>
</template>

<script setup>
import AppLoader from "@/components/ui/AppLoader";

defineProps({
  type: {
    type: String,
    default: "button",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.wxb-btn {
  border: none;
  outline: none;
  background: linear-gradient(264.88deg, #285de5, #25a9f3 50%, #285de5) 0 0;
  background-size: 200% 100%;
  box-shadow:
    0 -1px 0 0 #45bcff,
    0 1px 0 0 #21408e;
  font-family: inherit;
  color: inherit;
  cursor: pointer;
  display: block;
  font-weight: bold;
  border-radius: 2px;
}

.wxb-btn:hover {
  background-position-x: 100%;
  box-shadow:
    0 0 0 0 #45bcff,
    0 0 0 0 #21408e;
}
</style>
