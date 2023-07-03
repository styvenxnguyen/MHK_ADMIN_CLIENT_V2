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

export interface ProductPurchase {
  product_variant: {
    id: string
    name: string
    sku: string
    calculator_unit: string
    price_sell: string
    amount: {
      inStock: number
      available_to_sell: number
    }
  }
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
  productAdditionInformation: {
    brand: { brand_description: string; brand_id: string; brand_title: string }
    createdAt: string
    id: string
    productTagList: {
      tag_description: string
      tag_id: string
      tag_title: string
      id: string
    }[]
    product_id: string
    type: {
      type_description: string
      type_id: string
      type_title: string
    }
  }
}

export interface ProductSell {
  id: string
  available_quantity: number
  available_to_sell_quantity: number
  product_discount: number
  product: { product_variant_id: string; name: string; sku: string }
  price: { id: string; price_value: number }
}
