import { axiosConfig } from '~/utils/configAxios'

const PRODUCT = {
  GET_ALL: '/product/get-all',
  CREATE_PRODUCT: '/product/create',
  GET_ALL_BRAND: '/brand/get-all',
  GET_ALL_TYPE: '/type/get-all',
  GET_ALL_PURCHASE: '/product/import/get-all',
  GET_ALL_SELL: (priceId: string) => `/product/branch/get-all?price_id=${priceId}`,
  GET_DETAIL: (id: string) => `/product/get-by-id/${id}`
}

const ProductService = {
  getListProduct: () => axiosConfig.get(PRODUCT.GET_ALL),
  getListProductPurchase: () => axiosConfig.get(PRODUCT.GET_ALL_PURCHASE),
  getListProductSell: (priceId: string) => axiosConfig.get(PRODUCT.GET_ALL_SELL(priceId)),
  getListProductType: () => axiosConfig.get(PRODUCT.GET_ALL_TYPE),
  getListProductBrand: () => axiosConfig.get(PRODUCT.GET_ALL_BRAND),
  createProduct: (data: any) => axiosConfig.post(PRODUCT.CREATE_PRODUCT, data),
  getDetailProduct: (id: string) => axiosConfig.get(PRODUCT.GET_DETAIL(id))
}

export default ProductService
