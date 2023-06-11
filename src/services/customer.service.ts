import { axiosConfig } from '~/utils/configAxios'

const CUSTOMER = {
  GET_ALL: '/customer/get-all'
}

const CustomerService = {
  getListCustomer: () => axiosConfig.get(CUSTOMER.GET_ALL)
}

export default CustomerService
