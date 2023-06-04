import { PurchaseOrder } from '~/types/PurchaseOrder.type'
import { axiosConfig } from '~/utils/configAxios'

const ORDER = {
  PURCHASEORDER_DETAIL: (id: string) => `/order/import/get-by-id/${id}`,
  UPDATED_PURCHASEORDER: (id: string) => `/order/import/update-detail-by-id/${id}`
}

const OrderService = {
  getPurchaseOrderDetail: (id: string) => axiosConfig.get(ORDER.PURCHASEORDER_DETAIL(id)),
  updatedPurchaseOrderDetail: (id: string, data: PurchaseOrder) =>
    axiosConfig.put(ORDER.UPDATED_PURCHASEORDER(id), data)
}

export default OrderService
