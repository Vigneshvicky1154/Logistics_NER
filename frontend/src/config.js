import axios from 'axios';

const normalizeUrl = (value) => String(value ?? '')
  .trim()
  .replace(/^['"]|['"]$/g, '')
  .trim()
  .replace(/\/+$/, '');

// API Base URL:
// In local dev, this is empty so requests go to Vite's dev proxy ('/api' -> http://127.0.0.1:8000).
// In production (Vercel), set VITE_API_URL to your Render backend URL (e.g., https://your-backend.onrender.com).
export const API_BASE_URL = normalizeUrl(import.meta.env.VITE_API_URL);

if (API_BASE_URL) {
  axios.defaults.baseURL = API_BASE_URL;
}

/**
 * Derives the appropriate WebSocket URL.
 * Supports explicit VITE_WS_URL, auto-detection from VITE_API_URL, or local host fallback.
 */
export const getWebSocketUrl = () => {
  const configuredWebSocketUrl = normalizeUrl(import.meta.env.VITE_WS_URL);
  if (configuredWebSocketUrl) {
    return configuredWebSocketUrl;
  }

  if (API_BASE_URL) {
    const wsProtocol = /^https:\/\//i.test(API_BASE_URL) ? 'wss:' : 'ws:';
    const host = API_BASE_URL.replace(/^https?:\/\//i, '');
    return `${wsProtocol}//${host}/ws`;
  }

  // Fallback for local Vite dev server
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${window.location.host}/ws`;
};
