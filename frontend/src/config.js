import axios from 'axios';

// API Base URL:
// In local dev, this is empty so requests go to Vite's dev proxy ('/api' -> http://127.0.0.1:8000).
// In production (Vercel), set VITE_API_URL to your Render backend URL (e.g., https://your-backend.onrender.com).
export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

if (API_BASE_URL) {
  // Strip trailing slash if present
  axios.defaults.baseURL = API_BASE_URL.replace(/\/$/, '');
}

/**
 * Derives the appropriate WebSocket URL.
 * Supports explicit VITE_WS_URL, auto-detection from VITE_API_URL, or local host fallback.
 */
export const getWebSocketUrl = () => {
  if (import.meta.env.VITE_WS_URL) {
    return import.meta.env.VITE_WS_URL;
  }
  
  if (API_BASE_URL) {
    const cleanUrl = API_BASE_URL.replace(/\/$/, '');
    const wsProtocol = cleanUrl.startsWith('https://') ? 'wss:' : 'ws:';
    const host = cleanUrl.replace(/^https?:\/\//, '');
    return `${wsProtocol}//${host}/ws`;
  }

  // Fallback for local Vite dev server
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${window.location.host}/ws`;
};
