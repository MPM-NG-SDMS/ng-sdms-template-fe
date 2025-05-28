import axios from 'axios'

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
    const token = sessionStorage.getItem('token')
    const idinternal = sessionStorage.getItem('idinternal')
    const username = sessionStorage.getItem('username')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`,
      config.headers['idinternal'] = idinternal
      config.headers['username'] = username
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)
