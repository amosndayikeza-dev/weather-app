# Vue Weather App

A weather application built with **Vue 3 (Options API)** and **JavaScript**, using the free Open-Meteo API.

## Live Demo
https://weather-app-1plh.vercel.app

## Features
- Search any city worldwide
- Current temperature, humidity, wind speed, and conditions
- 5-day forecast
- °C / °F unit toggle
- Recent search history (persisted)
- Favorite cities (persisted)
- Loading, error, and success states
- Responsive design

## Tech Stack
- Vue 3 (Options API)
- Vite
- Open-Meteo API (geocoding + forecast)
- Vercel (deployment)

## Project Structure
- `src/App.vue` — root component, state, API orchestration
- `src/components/SearchBar.vue` — city input + search button
- `src/components/WeatherCard.vue` — weather display
- `src/components/LoadingMessage.vue` — loading spinner
- `src/services/weatherApi.js` — API calls
- `src/utils/weatherCodes.js` — WMO code mapping

## Run Locally
\`\`\`bash
npm install
npm run dev
\`\`\`

## Author
Amos Ndayikeza