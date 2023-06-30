import { axiosConfig } from '~/utils/configAxios'

const PRODUCT = {
  GET_ALL: '/product/get-all',
  CREATE_PRODUCT: '/product/create',
  GET_ALL_BRAND: '/brand/get-all',
  GET_ALL_TYPE: '/type/get-all',
  GET_ALL_PURCHASE: '/product/import/get-all',
  GET_DETAIL: (id: string) => `/product/get-by-id/${id}`,
  GET_ALL_PRODUCT: '/product/import/get-all'
}

const ProductService = {
  getListProduct: () => axiosConfig.get(PRODUCT.GET_ALL),
  getListProductV2: () => axiosConfig.get(PRODUCT.GET_ALL_PRODUCT),
  getListProductPurchase: () => axiosConfig.get(PRODUCT.GET_ALL_PURCHASE),
  getListProductType: () => axiosConfig.get(PRODUCT.GET_ALL_TYPE),
  getListProductBrand: () => axiosConfig.get(PRODUCT.GET_ALL_BRAND),
  createProduct: (data: any) => axiosConfig.post(PRODUCT.CREATE_PRODUCT, data),
  getDetailProduct: (id: string) => axiosConfig.get(PRODUCT.GET_DETAIL(id))
}

export default ProductService
