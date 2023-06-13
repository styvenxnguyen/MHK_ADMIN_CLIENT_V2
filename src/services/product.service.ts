import { axiosConfig } from '~/utils/configAxios'

const PRODUCT = {
  GET_ALL: '/product/get-all',
  CREATE_PRODUCT: '/product/create',
  GET_ALL_BRAND: '/brand/get-all',
  GET_ALL_TYPE: '/type/get-all',
  GET_DETAIL: (id: string) => `/product/get-by-id/${id}`
}

const ProductService = {
  getListProduct: () => axiosConfig.get(PRODUCT.GET_ALL),
  getListProductType: () => axiosConfig.get(PRODUCT.GET_ALL_TYPE),
  getListProductBrand: () => axiosConfig.get(PRODUCT.GET_ALL_BRAND),
  createProduct: (body: any) => axiosConfig.post(PRODUCT.CREATE_PRODUCT, body),
  getDetailProduct: (id: string) => axiosConfig.post(PRODUCT.GET_DETAIL(id))
}

export default ProductService
