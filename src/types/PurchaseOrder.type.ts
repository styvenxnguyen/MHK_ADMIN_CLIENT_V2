import { OrderProduct } from './OrderProduct.type'
import { Supplier } from './Supplier.type'

export interface PurchaseOrder {
  id?: string
  order_note?: string
  agency_branch?: {
    id: string
    name: string
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
