import { axiosConfig } from '~/utils/configAxios'

const PAYMENT = {
  GET_ALL: '/payment/get-all'
}

const PaymentService = {
  getAllPayment: () => axiosConfig.get(PAYMENT.GET_ALL)
}

export default PaymentService
