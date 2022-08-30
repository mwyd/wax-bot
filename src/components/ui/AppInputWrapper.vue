<template>
  <div class="wxb-py-3.5">
    <label class="wxb-block wxb-pb-3.5">
      {{ label }}
    </label>
    <slot/>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: true
    }
  }
}
</script>

<style>

</style>