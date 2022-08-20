<template>
  <div class="wxb-flex wxb-flex-col wxb-h-full wxb-p-4">
    <h4 class="wxb-mt-0 wxb-flex wxb-justify-between">
      <slot name="header"/>
    </h4>
    <div class="wxb-flex wxb-flex-col wxb-h-full">
      <slot name="body"/>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style>

</style>