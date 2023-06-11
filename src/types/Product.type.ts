export interface Product {
  id: string
  order_product_item_id?: string
  agency_branch_product_item_id?: string
  product_name: string
  product_classify: string
  product_SKU: string
  createdAt: string
  updatedAt: string,
  productVariants: [
    {
      id: string,
      product_variant_name: string,
      product_variant_SKU: string,
      product_variant_barcode: string,
      product_weight: string,
      
    }
  ]
}
