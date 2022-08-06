<template>
  <div class="wxb-loader"></div>
</template>

<script>
export default {}
</script>

<style scoped>
.wxb-loader {
  border: 2px solid #f3f3f3;
  border-radius: 50%;
  border-top: 2px solid var(--state-t1);
  width: 16px;
  height: 16px;
  animation: wxb-spin 0.5s linear infinite;
}

@keyframes wxb-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>