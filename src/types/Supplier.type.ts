export interface Supplier {
  addresses: [
    {
      id: string
      user_specific_address: string
    }
  ]
  id: string
  name: string
  phone: string
  user_id: string
}
