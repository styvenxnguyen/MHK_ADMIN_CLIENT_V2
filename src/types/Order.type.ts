import { OrderProduct } from './OrderProduct.type'
import { Supplier } from './Supplier.type'

interface Product {
  p_variant_id: string
  unit: string
  amount: number
  price: number
  discount: number
}

export interface PurchaseOrder {
  id?: string
  order_note?: string
  order_status?: string
  order_total?: number
  order_code?: string
  order_delivery_date?: string
  createdAt?: string
  agency_branch?: {
    id: string
    name: string
  }
  payment?: {
    id: string
    payment_type: string
  }
  order_product_list?: OrderProduct[]
  order_tags?: [
    id: string,
    Tag: {
      id: string
      tag_title: string
    }
  ]
  staff?: {
    id: string
    name: string
  }
  supplier?: Supplier
}

export interface OrderUpdate {
  supplier_id: string
  staff_id: string
  order_delivery_date: string
  order_note: string
  tags: string[]
  products: Product[]
}

export interface OrderStatus {
  update_status: string
}
