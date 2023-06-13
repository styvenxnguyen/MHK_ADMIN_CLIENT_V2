import { PurchaseOrder } from '~/types/PurchaseOrder.type'
import { axiosConfig } from '~/utils/configAxios'

const ORDER = {
  GET_ALL: (params: string) => `/order/get-all?order_type=${params}`,
  PURCHASEORDER_DETAIL: (id: string) => `/order/import/get-by-id/${id}`,
  UPDATED_PURCHASEORDER: (id: string) => `/order/import/update-detail-by-id/${id}`
}

const OrderService = {
  getAllPurchaseOrder: (params: string) => axiosConfig.get(ORDER.GET_ALL(params)),
  getPurchaseOrderDetail: (id: string) => axiosConfig.get(ORDER.PURCHASEORDER_DETAIL(id)),
  updatedPurchaseOrderDetail: (id: string, data: PurchaseOrder) =>
    axiosConfig.put(ORDER.UPDATED_PURCHASEORDER(id), data)
}

export default OrderService
