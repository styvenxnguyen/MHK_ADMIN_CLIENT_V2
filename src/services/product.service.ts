import { axiosConfig } from '~/utils/configAxios'

const PRICE_POLICIES = {
  GET_ALL: '/price/get-all'
}

const ProductService = {
  getListPricePolicies: () => axiosConfig.get(PRICE_POLICIES.GET_ALL)
}

export default ProductService
