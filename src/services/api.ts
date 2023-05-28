import axios from 'axios'

const token = localStorage.getItem('access_token')

export const services = axios.create({
  baseURL: 'https://mhk-api-v2.onrender.com/cloud-api',
  headers: {
    token: `${token}`
  }
})

export const getTagsList = () => services.get('/tag/get-all')

export const getBrandsList = () => services.get('/brand/get-all')

export const getTypesList = () => services.get('type/get-all')

export const getStaffList = () => services.get('/staff/get-all')

export const getRolesUser = () => services.get('/role/get-all')

export const getBranchesList = () => services.get('/agency-branch/get-all')

export const getProductsList = () => services.get('/product/get-all')

export const getPricePoliciesList = () => services.get('/price/get-all')
