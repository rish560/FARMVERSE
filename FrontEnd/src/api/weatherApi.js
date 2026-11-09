import axiosInstance from './axiosInstance';
import { getWeather as mockGetWeather } from '../services/mockApi';

export const getWeather = async () => {
  return mockGetWeather();
};

// NEW: real-time weather for a specific farm location, via backend (OpenWeatherMap)
// Simple in-memory cache so switching pages / re-rendering cards doesn't spam the API.
const farmWeatherCache = new Map(); // location -> { data, fetchedAt }
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

export const getFarmWeather = async (location) => {
  if (!location) return null;

  const cached = farmWeatherCache.get(location);
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return cached.data;
  }

  const response = await axiosInstance.get('/weather', { params: { location } });
  farmWeatherCache.set(location, { data: response.data, fetchedAt: Date.now() });
  return response.data;
};

