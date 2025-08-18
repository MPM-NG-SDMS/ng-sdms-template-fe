import axios from 'axios'
import { getToken } from './authHelper'

const apiBaseUrl = import.meta.env.VITE_BASE_URL_API

export const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    Expires: '0',
  },
})

api.interceptors.request.use(
  (config) => {
    // retrieve token and user info from Keycloak storage
    const rawToken = getToken()
    if (rawToken) {
      config.headers['Authorization'] = `Bearer ${rawToken}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)
