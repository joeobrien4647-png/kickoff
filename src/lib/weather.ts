// ============ WEATHER UTILITY ============
// Fetches 7-day forecasts from Open-Meteo (free, no API key required).
// Graceful fallback — returns empty array on any error.

import { ROUTE_STOPS } from "./constants";

export type DayForecast = {
  date: string;
  highF: number;
  lowF: number;
  rainPct: number;
};

type OpenMeteoDaily = {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_probability_max: number[];
};

type OpenMeteoResponse = {
  daily: OpenMeteoDaily;
};

/**
 * Fetch a 7-day forecast for a specific latitude/longitude.
 * Uses Open-Meteo's free API — no key required.
 */
export async function fetchCityWeather(
  lat: number,
  lng: number
): Promise<DayForecast[]> {
  try {
    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${lat}` +
      `&longitude=${lng}` +
      `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
      `&temperature_unit=fahrenheit` +
      `&timezone=America/New_York` +
      `&forecast_days=7`;

    const res = await fetch(url);

    if (!res.ok) return [];

    const data: OpenMeteoResponse = await res.json();
    const { time, temperature_2m_max, temperature_2m_min, precipitation_probability_max } =
      data.daily;

    return time.map((date, i) => ({
      date,
      highF: Math.round(temperature_2m_max[i]),
      lowF: Math.round(temperature_2m_min[i]),
      rainPct: precipitation_probability_max[i],
    }));
  } catch {
    return [];
  }
}

/**
 * Convenience: fetch weather for a city by name.
 * Looks up lat/lng from ROUTE_STOPS in constants.ts.
 */
export async function fetchWeatherForCity(
  city: string
): Promise<DayForecast[]> {
  const stop = ROUTE_STOPS.find((s) => s.name === city);
  if (!stop) return [];
  return fetchCityWeather(stop.lat, stop.lng);
}
