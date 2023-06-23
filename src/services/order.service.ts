import { PurchaseOrder } from '~/types/PurchaseOrder.type'
import { axiosConfig } from '~/utils/configAxios'

const ORDER = {
  GET_ALL: (params: string) => `/order/get-all?order_type=${params}`,
  PURCHASEORDER_DETAIL: (id: string) => `/order/get-by-id?id=${id}&order_type=Đơn nhập`,
  CREATE_PURCHASEORDER: '/order/import/create',
  CREATE_SELLORDER: '/order/sale/create',
  UPDATE_PURCHASEORDER: (id: string) => `/order/import/update-detail-by-id/${id}`,
  UPDATE_PURCHASEORDER_STATUS: (id: string) => `/order/import/update-status-by-id/${id}`
}

const OrderService = {
  getAllOrder: (params: string) => axiosConfig.get(ORDER.GET_ALL(params)),
  getPurchaseOrderDetail: (id: string) => axiosConfig.get(ORDER.PURCHASEORDER_DETAIL(id)),
  createPurchaseOrder: (data: PurchaseOrder) => axiosConfig.post(ORDER.CREATE_PURCHASEORDER, data),
  createSellOrder: (data: PurchaseOrder) => axiosConfig.post(ORDER.CREATE_SELLORDER, data),
  updatePurchaseOrderDetail: (id: string, data: PurchaseOrder) =>
    axiosConfig.patch(ORDER.UPDATE_PURCHASEORDER(id), data),
  updatePurchaseOrderStatus: (id: string, data: object) =>
    axiosConfig.patch(ORDER.UPDATE_PURCHASEORDER_STATUS(id), data)
}

export default OrderService
