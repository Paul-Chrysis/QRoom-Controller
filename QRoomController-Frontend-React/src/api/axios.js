import axios from "axios";

// Dynamically determine the API URL based on the current hostname
const getBaseUrl = () => {
  const hostname = window.location.hostname;
  // If we're accessing via localhost, use localhost for the API
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return import.meta.env.VITE_API_URL || "http://localhost:8080";
  }
  // If we're accessing from a different device (like a phone), use the server's IP
  if (hostname === '192.168.100.5' || hostname.match(/^192\.168\./)) {
    return `http://192.168.100.5:8080`;
  }
  // Otherwise, use the current hostname with the API port
  return `http://${hostname}:8080`;
};

export default axios.create({
  baseURL: getBaseUrl(),
});
