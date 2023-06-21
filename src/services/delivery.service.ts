import { axiosConfig } from '~/utils/configAxios'

const DELIVERY = {
  GET_ALL: '/shipper/get-all'
}

const DeliveryService = {
  getAllDelivery: () => axiosConfig.get(DELIVERY.GET_ALL)
}

export default DeliveryService
