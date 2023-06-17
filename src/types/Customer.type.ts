export interface CustomerList {
  customer_id: string
  customer_name: string
  customer_phone: string
  customer_status: string
  id: string
  user_code: string
}

export interface Customer {
  address_list: [
    {
      id: string
      user_district: string
      user_province: string
      user_specific_address: string
    }
  ]
  customer_email: string
  customer_name: string
  customer_phone: string
  customer_status: string
  id: string
  staff_in_charge: [
    {
      staff_id: string
      staff_name: string
    }
  ]
  staff_in_charge_note: string
  tags: [
    {
      id: string
      tag_id: string
      tag_title: string
    }
  ]
  user_code: string
}
