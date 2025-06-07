export const API_BASE_URL =
  window.location.hostname.includes('localhost')
    ? 'http://localhost:3000/api'
    : 'https://nventory-api.onrender.com';
