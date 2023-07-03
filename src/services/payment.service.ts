import { PaymentPay } from '~/types/Payment.type'
import { axiosConfig } from '~/utils/configAxios'

const PAYMENT = {
  GET_ALL: '/payment/get-all',
  PAY: ({ user_id, source_id, debt_payment_amount }: PaymentPay) =>
    `/order/pay?user_id=${user_id}&source_id=${source_id}&debt_payment_amount=${debt_payment_amount}`
}

const PaymentService = {
  getAllPayment: () => axiosConfig.get(PAYMENT.GET_ALL),
  pay: ({ user_id, source_id, debt_payment_amount }: PaymentPay) =>
    axiosConfig.patch(PAYMENT.PAY({ user_id, source_id, debt_payment_amount }))
}

export default PaymentService
