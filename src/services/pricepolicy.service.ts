import { axiosConfig } from '~/utils/configAxios'

const PRICE_POLICY = {
  GET_ALL: '/price/get-all'
}

export const PricePolicyService = {
  getListPrice: () => axiosConfig.get(PRICE_POLICY.GET_ALL)
}
