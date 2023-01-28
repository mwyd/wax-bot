<template>
  <div class="wxb-flex wxb-flex-col wxb-h-full wxb-p-6">
    <h4 class="wxb-mt-0 wxb-mb-6 wxb-flex wxb-justify-between">
      <slot name="header" />
    </h4>
    <div class="wxb-flex wxb-flex-col wxb-h-full">
      <slot name="body" />
    </div>
  </div>
</template>

<script setup>
</script>

<style>

</style>