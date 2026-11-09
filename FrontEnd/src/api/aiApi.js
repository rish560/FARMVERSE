import axiosInstance from './axiosInstance';

// Calls the FarmVerse AI backend (POST /api/ai/chat).
// axiosInstance baseURL already ends in /api, so we call '/ai/chat' here.
export const askFarmVerseAi = async ({ question, crop, location, language }) => {
  const response = await axiosInstance.post('/ai/chat', {
    question,
    crop,
    location,
    language: language || 'English',
  });
  return response.data; // { answer, timestamp }
};
