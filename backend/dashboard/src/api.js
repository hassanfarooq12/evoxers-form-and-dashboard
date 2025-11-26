import axios from "axios";

// Use relative path for single deployment, or env variable for separate deployment
const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:4000');
const baseURL = apiUrl ? `${apiUrl}/api` : '/api';
export const api = axios.create({
  baseURL,
});


