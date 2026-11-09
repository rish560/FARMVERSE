/**
 * mockApi.js — localStorage-backed mock data layer.
 *
 * Strategy:
 *   - On first launch, seed localStorage from the static arrays in data.js.
 *   - All subsequent reads pull from localStorage.
 *   - Every mutation (create / update / delete) persists the updated array back to localStorage.
 *   - Users registered via mockRegister are also persisted.
 *   - Weather is still fetched live (with a 15-minute in-memory cache) and never stored in localStorage.
 */

import {
  farms as seedFarms,
  crops as seedCrops,
  users as seedUsers,
  marketPrices,
  notifications,
  schemes,
  soilReports,
  reports,
  weatherData,
  upagStats,
  analytics,
} from '../mock/data.js';

// ─── Delay helper ────────────────────────────────────────────────────────────
const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms));

// ─── localStorage helpers ─────────────────────────────────────────────────────
const KEYS = {
  farms: 'farmverse_farms',
  crops: 'farmverse_crops',
  users: 'farmverse_users',
};

/**
 * Read a collection from localStorage.
 * Falls back to the seed array on first launch (key not yet set).
 */
const readStore = (resource) => {
  try {
    const raw = localStorage.getItem(KEYS[resource]);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    // First-time or empty: seed from static data
    const seed =
      resource === 'farms' ? seedFarms :
      resource === 'crops' ? seedCrops :
      resource === 'users' ? seedUsers : [];
    // Deep-clone to avoid mutating the imported arrays
    const cloned = JSON.parse(JSON.stringify(seed));
    localStorage.setItem(KEYS[resource], JSON.stringify(cloned));
    return cloned;
  } catch {
    // If localStorage is unavailable, fall back to in-memory seed
    return resource === 'farms' ? [...seedFarms] :
           resource === 'crops' ? [...seedCrops] :
           [...seedUsers];
  }
};

/**
 * Persist an entire collection back to localStorage.
 */
const writeStore = (resource, data) => {
  try {
    localStorage.setItem(KEYS[resource], JSON.stringify(data));
  } catch {
    // Storage quota exceeded or unavailable — fail silently
  }
};

// ─── Token helper ─────────────────────────────────────────────────────────────
const createToken = (user) =>
  `mock-token-${user.id}-${Math.random().toString(36).slice(2, 10)}`;

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const mockLogin = async (email, password) => {
  await delay();
  const users = readStore('users');
  const user = users.find(
    (entry) => entry.email === email && entry.password === password,
  );
  if (user) {
    return { success: true, token: createToken(user), user: { ...user } };
  }
  return { success: false, message: 'Invalid credentials. Check your email and password.' };
};

export const mockRegister = async (payload) => {
  await delay();
  const users = readStore('users');
  const exists = users.some((entry) => entry.email === payload.email);
  if (exists) {
    return { success: false, message: 'This email is already registered.' };
  }

  const newUser = {
    id: Date.now(),
    fullName: payload.fullName || 'New User',
    email: payload.email,
    password: payload.password,
    role: payload.role || 'Guest',
    phone: payload.phone || '',
    address: payload.address || '',
    bio: payload.bio || 'Newly onboarded user',
    experience: payload.experience || '0 years',
    skills: payload.skills || ['Field Monitoring'],
    farmCount: 0,
    cropCount: 0,
    achievements: ['Joined FarmVerse'],
  };

  users.push(newUser);
  writeStore('users', users);  // ← persisted

  return {
    success: true,
    message: 'Registration successful',
    user: { ...newUser },
  };
};

// ─── Farms ────────────────────────────────────────────────────────────────────
export const getFarms = async () => {
  await delay();
  return readStore('farms');
};

// ─── Crops ────────────────────────────────────────────────────────────────────
export const getCrops = async () => {
  await delay();
  return readStore('crops');
};

// ─── Users ────────────────────────────────────────────────────────────────────
export const getUsers = async () => {
  await delay();
  return readStore('users');
};

// ─── Static / live data ───────────────────────────────────────────────────────
export const getNotifications = async () => { await delay(); return notifications; };
export const getSchemes = async () => { await delay(); return schemes; };
export const getMarketPrices = async () => { await delay(); return marketPrices; };
export const getSoilReports = async () => { await delay(); return soilReports; };
export const getReports = async () => { await delay(); return reports; };
export const getUpagStats = async () => { await delay(); return upagStats; };
export const getAnalytics = async () => { await delay(); return analytics; };

// ─── Live weather (in-memory cache, 15 min TTL) ───────────────────────────────
const weatherCache = { data: null, fetchedAt: 0 };

export const getWeather = async () => {
  const now = Date.now();
  if (weatherCache.data && now - weatherCache.fetchedAt < 15 * 60 * 1000) {
    return weatherCache.data;
  }

  await delay();

  try {
    const response = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=11.0168&longitude=76.9558' +
      '&current=temperature_2m,relative_humidity_2m,precipitation_probability,wind_speed_10m,uv_index' +
      '&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code' +
      '&timezone=auto&forecast_days=7',
    );
    if (!response.ok) throw new Error('Weather unavailable');
    const data = await response.json();
    const current = data.current;
    const forecast = (data.daily?.time ?? []).slice(0, 7).map((day, i) => ({
      day: new Date(day).toLocaleDateString('en-US', { weekday: 'short' }),
      high: Math.round(data.daily.temperature_2m_max[i]),
      low: Math.round(data.daily.temperature_2m_min[i]),
      rainfall: data.daily.precipitation_probability_max[i],
      condition: data.daily.precipitation_probability_max[i] > 50 ? 'Rain' : 'Clear',
    }));

    const result = {
      ...weatherData,
      location: 'Coimbatore, Tamil Nadu',
      current: {
        ...weatherData.current,
        temp: Math.round(current.temperature_2m),
        humidity: current.relative_humidity_2m,
        rainfall: current.precipitation_probability,
        windSpeed: Math.round(current.wind_speed_10m),
        uvIndex: current.uv_index,
        condition: current.precipitation_probability > 50 ? 'Rain likely' : 'Clear',
      },
      forecast,
    };

    weatherCache.data = result;
    weatherCache.fetchedAt = now;
    return result;
  } catch {
    return weatherData;
  }
};

// ─── Generic CRUD (localStorage-backed) ──────────────────────────────────────
const SUPPORTED = ['farms', 'crops', 'users'];

export const createRecord = async (resource, values) => {
  await delay();
  if (!SUPPORTED.includes(resource)) throw new Error('Unsupported resource');
  const collection = readStore(resource);
  const record = { ...values, id: Date.now() };
  collection.unshift(record);
  writeStore(resource, collection);  // ← persisted
  return { ...record };
};

export const updateRecord = async (resource, id, values) => {
  await delay();
  if (!SUPPORTED.includes(resource)) throw new Error('Unsupported resource');
  const collection = readStore(resource);
  const index = collection.findIndex((item) => String(item.id) === String(id));
  if (index < 0) throw new Error('Record not found');
  collection[index] = { ...collection[index], ...values };
  writeStore(resource, collection);  // ← persisted
  return { ...collection[index] };
};

export const deleteRecord = async (resource, id) => {
  await delay();
  if (!SUPPORTED.includes(resource)) throw new Error('Unsupported resource');
  const collection = readStore(resource);
  const index = collection.findIndex((item) => String(item.id) === String(id));
  if (index < 0) throw new Error('Record not found');
  const [removed] = collection.splice(index, 1);
  writeStore(resource, collection);  // ← persisted
  return { ...removed };
};

// ─── Crop convenience aliases ─────────────────────────────────────────────────
export const createCrop = (values) => createRecord('crops', values);
export const updateCrop = (id, values) => updateRecord('crops', id, values);
export const deleteCrop = (id) => deleteRecord('crops', id);
