export interface Payment {
  id: string
  payment_type: string
  payment_description: string
  createdAt: string
  updatedAt: string
}

export interface PaymentPay {
  user_id: string
  source_id: string
  debt_payment_amount: number
}
