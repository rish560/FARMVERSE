import axiosInstance from './axiosInstance';

// Fetches ALL real, live mandi (market) prices for a crop within a state, from
// the backend, which calls the official Government of India data.gov.in
// dataset. Returns one entry per real mandi so they can be compared side by
// side. No fallback data, no hardcoded numbers -- every call is a fresh live
// lookup, and the caller must have a real data.gov.in key configured.
export const getMandiPrices = async ({ state, district, commodity }) => {
  const response = await axiosInstance.get('/mandi/prices', {
    params: { state, district, commodity },
    // This call can page through several hundred government records across
    // multiple upstream requests, so it gets more time than the default
    // 12s client timeout to avoid a false "request failed" while the
    // backend is still legitimately working.
    timeout: 30000,
  });
  return response.data; // [{ state, district, market, commodity, variety, arrivalDate, minPrice, maxPrice, modalPrice }, ...]
};
