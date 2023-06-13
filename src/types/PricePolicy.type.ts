export interface PricePolicy {
  id: string
  isImportDefault: boolean
  isSellDefault: boolean
  price_description: string
  price_type: string
}

export interface PricePolicyGetter {
  id: string
  price_id: string
  price_value: string
  price_type: string
  price_description: string
  createdAt: string
  updatedAt: string
}
