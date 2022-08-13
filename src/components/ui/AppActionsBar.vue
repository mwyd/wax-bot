<template>
  <div class="wxb-flex wxb-justify-end">
    <div
      class="wxb-text-xs wxb-text-right"
      v-for="(action, i) in actions"
      :key="`action-${i}`"
    >
      <span
        class="wxb-px-1 wxb-cursor-pointer wxb-text-gray-200 hover:wxb-text-white-500"
        @click="action.callback"
      >
        {{ action.name }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    actions: {
      type: Array,
      required: true
    }
  }
}
</script>

<style>

</style>