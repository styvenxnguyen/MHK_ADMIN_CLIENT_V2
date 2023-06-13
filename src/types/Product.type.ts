import { PricePolicyGetter } from './PricePolicy.type'

export interface ProductVariant {
  id: string
  product_variant_name: string
  product_variant_SKU: string
  product_variant_barcode: string
  product_weight: string
  product_weight_calculator_unit: string
  createdAt: string
  updatedAt: string
  productPrices: PricePolicyGetter[]
}

export interface Product {
  id: string
  order_product_item_id?: string
  agency_branch_product_item_id?: string
  product_name: string
  product_classify: string
  product_SKU: string
  createdAt: string
  updatedAt: string
  productVariants: ProductVariant[]
  productProperties: [
    {
      id: string
      product_variant_property_key: string
      product_variant_property_value: string
      createdAt: string
      updatedAt: string
    }
  ]
}
