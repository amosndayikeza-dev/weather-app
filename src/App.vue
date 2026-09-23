<template>
  <div class="app">
    <header class="app-header">
      <h1>🌤️ Vue Weather</h1>
      <div class="unit-toggle">
        <button
          :class="{ active: unit === 'C' }"
          @click="unit = 'C'"
        >°C</button>
        <button
          :class="{ active: unit === 'F' }"
          @click="unit = 'F'"
        >°F</button>
      </div>
    </header>

    <SearchBar @search="searchCity" />

    <!-- Loading state -->
    <LoadingMessage :visible="loading" message="Fetching weather data..." />

    <!-- Error state -->
    <div v-if="error && !loading" class="error-card">
      <span class="error-icon">⚠️</span>
      <p>{{ error }}</p>
    </div>

    <!-- Success state -->
    <WeatherCard
      v-if="weather && !loading && !error"
      :weather="weather"
      :unit="unit"
      :is-favorite="isCurrentFavorite"
      @toggle-favorite="toggleFavorite"
    />

    <!-- Empty / welcome state -->
    <div v-if="!weather && !loading && !error" class="empty-state">
      <p>Search for a city to see its weather.</p>
      <p class="hint">Try: Bujumbura, Tokyo, Nairobi, Shanghai, Paris</p>
    </div>

    <!-- Search history -->
    <div v-if="searchHistory.length" class="history-section">
      <h3>Recent Searches</h3>
      <div class="chip-row">
        <button
          v-for="city in searchHistory"
          :key="city"
          class="chip"
          @click="searchCity(city)"
        >{{ city }}</button>
      </div>
    </div>

    <!-- Favorites -->
    <div v-if="favorites.length" class="history-section">
      <h3>Favorites</h3>
      <div class="chip-row">
        <button
          v-for="city in favorites"
          :key="city"
          class="chip chip-fav"
          @click="searchCity(city)"
        >★ {{ city }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import SearchBar from './components/SearchBar.vue'
import WeatherCard from './components/WeatherCard.vue'
import LoadingMessage from './components/LoadingMessage.vue'
import { geocodeCity, fetchWeather } from './services/weatherApi.js'
import { getWeatherInfo } from './utils/weatherCodes.js'

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default {
  name: 'App',
  components: { SearchBar, WeatherCard, LoadingMessage },
  data() {
    return {
      weather: null,
      loading: false,
      error: '',
      unit: 'C',
      searchHistory: [],
      favorites: [],
      currentCity: '',
    }
  },
  computed: {
    isCurrentFavorite() {
      return this.favorites.includes(this.currentCity)
    },
  },
  mounted() {
    this.loadFromStorage()
    // Optional: load a default city on first visit
    if (!this.weather) {
      this.searchCity('Bujumbura')
    }
  },
  methods: {
    async searchCity(city) {
      this.loading = true
      this.error = ''
      this.weather = null

      try {
        const location = await geocodeCity(city)
        const data = await fetchWeather(location.latitude, location.longitude)

        const current = data.current
        const info = getWeatherInfo(current.weather_code)

        this.weather = {
          city: location.name,
          country: location.country,
          temperature: current.temperature_2m,
          humidity: current.relative_humidity_2m,
          windSpeed: current.wind_speed_10m,
          condition: info.label,
          icon: info.icon,
          forecast: this.buildForecast(data.daily),
        }

        this.currentCity = location.name
        this.addToHistory(location.name)
      } catch (err) {
        if (err.message === 'CITY_NOT_FOUND') {
          this.error = `City "${city}" not found. Please check the spelling and try again.`
        } else if (err.message === 'NETWORK_ERROR') {
          this.error = 'Network error. Please check your connection and try again.'
        } else {
          this.error = 'Something went wrong. Please try again later.'
        }
      } finally {
        this.loading = false
      }
    },

    buildForecast(daily) {
      if (!daily || !daily.time) return []
      return daily.time.slice(0, 5).map((date, i) => {
        const info = getWeatherInfo(daily.weather_code[i])
        const d = new Date(date)
        return {
          date,
          dayName: DAY_NAMES[d.getDay()],
          icon: info.icon,
          max: daily.temperature_2m_max[i],
          min: daily.temperature_2m_min[i],
        }
      })
    },

    addToHistory(city) {
      this.searchHistory = [
        city,
        ...this.searchHistory.filter(c => c !== city),
      ].slice(0, 6)
      this.saveToStorage()
    },

    toggleFavorite() {
      const city = this.currentCity
      if (this.favorites.includes(city)) {
        this.favorites = this.favorites.filter(c => c !== city)
      } else {
        this.favorites = [...this.favorites, city]
      }
      this.saveToStorage()
    },

    saveToStorage() {
      localStorage.setItem('weather-history', JSON.stringify(this.searchHistory))
      localStorage.setItem('weather-favorites', JSON.stringify(this.favorites))
      localStorage.setItem('weather-unit', this.unit)
    },

    loadFromStorage() {
      try {
        this.searchHistory = JSON.parse(localStorage.getItem('weather-history')) || []
        this.favorites = JSON.parse(localStorage.getItem('weather-favorites')) || []
        this.unit = localStorage.getItem('weather-unit') || 'C'
      } catch {
        // ignore malformed storage
      }
    },
  },
  watch: {
    unit() {
      this.saveToStorage()
    },
  },
}
</script>