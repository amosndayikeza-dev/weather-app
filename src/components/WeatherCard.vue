<template>
  <div class="weather-card" v-if="weather">
    <div class="card-header">
      <div>
        <h2 class="city-name">{{ weather.city }}</h2>
        <p class="country">{{ weather.country }}</p>
      </div>
      <button
        class="fav-btn"
        :class="{ active: isFavorite }"
        @click="$emit('toggle-favorite')"
        :title="isFavorite ? 'Remove from favorites' : 'Add to favorites'"
      >
        {{ isFavorite ? '★' : '☆' }}
      </button>
    </div>

    <div class="current">
      <span class="weather-icon">{{ weather.icon }}</span>
      <div class="temp-block">
        <span class="temperature">{{ displayTemp(weather.temperature) }}</span>
        <span class="condition">{{ weather.condition }}</span>
      </div>
    </div>

    <div class="details">
      <div class="detail-item">
        <span class="label">Humidity</span>
        <span class="value">{{ weather.humidity }}%</span>
      </div>
      <div class="detail-item">
        <span class="label">Wind</span>
        <span class="value">{{ displayWind(weather.windSpeed) }}</span>
      </div>
    </div>

    <div class="forecast" v-if="weather.forecast && weather.forecast.length">
      <h3>5-Day Forecast</h3>
      <div class="forecast-grid">
        <div v-for="day in weather.forecast" :key="day.date" class="forecast-item">
          <span class="fc-day">{{ day.dayName }}</span>
          <span class="fc-icon">{{ day.icon }}</span>
          <span class="fc-temp">{{ displayTemp(day.max) }} / {{ displayTemp(day.min) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WeatherCard',
  props: {
    weather: { type: Object, required: true },
    unit: { type: String, default: 'C' },
    isFavorite: { type: Boolean, default: false },
  },
  emits: ['toggle-favorite'],
  methods: {
    displayTemp(celsius) {
      if (this.unit === 'F') {
        return `${Math.round(celsius * 9/5 + 32)}°F`
      }
      return `${Math.round(celsius)}°C`
    },
    displayWind(kmh) {
      if (this.unit === 'F') {
        return `${Math.round(kmh * 0.621371)} mph`
      }
      return `${Math.round(kmh)} km/h`
    },
  },
}
</script>

<style scoped>
.weather-card {
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 20px;
  padding: 1.5rem;
  backdrop-filter: blur(12px);
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.city-name { margin: 0; font-size: 1.5rem; }
.country { margin: 0.25rem 0 0; opacity: 0.6; font-size: 0.9rem; }
.fav-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: rgba(255,255,255,0.4);
  transition: color 0.2s;
}
.fav-btn.active { color: #fbbf24; }
.current {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin: 1.5rem 0;
}
.weather-icon { font-size: 4rem; line-height: 1; }
.temp-block { display: flex; flex-direction: column; }
.temperature { font-size: 2.5rem; font-weight: 700; }
.condition { opacity: 0.7; font-size: 0.95rem; }
.details {
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
}
.detail-item { display: flex; flex-direction: column; gap: 0.25rem; }
.label { font-size: 0.8rem; opacity: 0.5; text-transform: uppercase; letter-spacing: 0.05em; }
.value { font-size: 1.1rem; font-weight: 600; }
.forecast h3 { font-size: 1rem; margin: 0 0 0.75rem; opacity: 0.7; }
.forecast-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 0.5rem;
}
.forecast-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  background: rgba(255,255,255,0.05);
  border-radius: 10px;
  padding: 0.5rem;
  font-size: 0.8rem;
}
.fc-day { font-weight: 600; }
.fc-icon { font-size: 1.4rem; }
.fc-temp { opacity: 0.8; }
</style>