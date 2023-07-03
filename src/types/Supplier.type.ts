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

export interface SupplierRes {
  customer_id: string
  customer_name: string
  customer_phone: string
  customer_status: string
  customer_email: string
  id: string
  user_code: string
  staff_in_charge: {
    staff_id: string
    staff_name: string
  }
  staff_in_charge_note: string
  tags: [
    {
      id: string
      tag_id: string
      tag_title: string
    }
  ]
  address_list: [
    {
      id: string
      user_district: string
      user_province: string
      user_specific_address: string
    }
  ]
}
