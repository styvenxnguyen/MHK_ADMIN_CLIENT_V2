import axios from 'axios'
import { BASE_URL_CONFIG } from '~/config/constants'
const token = localStorage.getItem('access_token')

export const axiosConfig = axios.create({
  baseURL: BASE_URL_CONFIG,
  headers: {
    'Content-type': 'application/json',
    token: `${token}`
  }
})

// Add a request interceptor
axiosConfig.interceptors.request.use(
  function (config) {
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

// Add a response interceptor
axiosConfig.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    return Promise.reject(error)
  }
)
