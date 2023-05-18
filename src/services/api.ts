import axios from 'axios'

const token = localStorage.getItem('access_token')

const services = axios.create({
  baseURL: 'https://mhk-api-v2.onrender.com/cloud-api',
  headers: {
    token: `${token}`
  }
})

export default services
