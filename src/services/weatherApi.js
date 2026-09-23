const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast'

export async function geocodeCity(city) {
  const url = `${GEO_URL}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('NETWORK_ERROR')
  }

  const data = await response.json()

  if (!data.results || data.results.length === 0) {
    throw new Error('CITY_NOT_FOUND')
  }

  const { latitude, longitude, name, country } = data.results[0]
  return { latitude, longitude, name, country }
}

export async function fetchWeather(latitude, longitude) {
  const params = [
    `latitude=${latitude}`,
    `longitude=${longitude}`,
    'current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code',
    'daily=weather_code,temperature_2m_max,temperature_2m_min',
    'timezone=auto',
  ].join('&')

  const response = await fetch(`${WEATHER_URL}?${params}`)

  if (!response.ok) {
    throw new Error('NETWORK_ERROR')
  }

  return response.json()
}