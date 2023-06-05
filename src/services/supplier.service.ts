import { axiosConfig } from '~/utils/configAxios'

const SUPPLIER = {
  GET_ALL: '/supplier/get-all',
  GET_DETAIL: (id: string) => `/supplier/get-by-id/${id}`
}

const SupplierService = {
  getAllSupplier: () => axiosConfig.get(SUPPLIER.GET_ALL),
  getDetailSupplier: (id: string) => axiosConfig.get(SUPPLIER.GET_DETAIL(id))
}

export default SupplierService
