import { axiosConfig } from '~/utils/configAxios'

const CUSTOMER = {
  GET_ALL: '/customer/get-all',
  GET_DETAIL: (id: string) => `/customer/get-by-id/${id}`
}

const CustomerService = {
  getListCustomer: () => axiosConfig.get(CUSTOMER.GET_ALL),
  getCustomerDetail: (id: string) => axiosConfig.get(CUSTOMER.GET_DETAIL(id))
}

export default CustomerService
