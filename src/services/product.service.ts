import { axiosConfig } from '~/utils/configAxios'

const PRODUCT = {
  CREATE_PRODUCT: '/product/create',
  GET_ALL_TAG: '/tag/get-all',
  GET_ALL_BRAND: '/brand/get-all',
  GET_ALL_TYPE: '/type/get-all',
  GET_ALL_POLICIES: '/price/get-all'
}

const ProductService = {
  getListPricePolicies: () => axiosConfig.get(PRODUCT.GET_ALL_POLICIES),
  getListProductType: () => axiosConfig.get(PRODUCT.GET_ALL_TYPE),
  getListProductBrand: () => axiosConfig.get(PRODUCT.GET_ALL_BRAND),
  getListProductTag: () => axiosConfig.get(PRODUCT.GET_ALL_TAG),
  createProduct: (body: any) => axiosConfig.post(PRODUCT.CREATE_PRODUCT, body)
}

export default ProductService
