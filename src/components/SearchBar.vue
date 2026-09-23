<template>
  <form class="search-bar" @submit.prevent="handleSubmit">
    <input
      v-model="city"
      type="text"
      placeholder="Enter a city name..."
      class="search-input"
    />
    <button type="submit" class="search-btn" :disabled="!city.trim()">
      Search
    </button>
  </form>
</template>

<script>
export default {
  name: 'SearchBar',
  data() {
    return {
      city: '',
    }
  },
  methods: {
    handleSubmit() {
      const trimmed = this.city.trim()
      if (!trimmed) return
      this.$emit('search', trimmed)
    },
  },
}
</script>

<style scoped>
.search-bar {
  display: flex;
  gap: 0.75rem;
}
.search-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.2);
  background: rgba(255,255,255,0.08);
  color: #fff;
  font-size: 1rem;
  outline: none;
}
.search-input::placeholder { color: rgba(255,255,255,0.5); }
.search-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  border: none;
  background: #3b82f6;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.search-btn:hover:not(:disabled) { background: #2563eb; }
.search-btn:disabled { opacity: 0.5; cursor: not-allowed; }
</style>