<template>
  <div class="loading" v-show="visible">
    <div class="spinner"></div>
    <p>{{ message }}</p>
  </div>
</template>

<script>
export default {
  name: 'LoadingMessage',
  props: {
    message: {
      type: String,
      default: 'Loading weather data...',
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style scoped>
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
}
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.2);
  border-top-color: #60a5fa;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>