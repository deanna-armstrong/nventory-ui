/**
 * Determines the base URL for all API calls at runtime.
 * - If running on localhost (development), point at the local Nest server.
 * - Otherwise, use the deployed Render.app URL for production.
 */
export const API_BASE_URL =
  window.location.hostname.includes('localhost')
    ? 'http://localhost:3000/api'
    : 'https://nventory-api.onrender.com/api';
