import { OrderStatus, PurchaseOrder } from '~/types/Order.type'
import { axiosConfig } from '~/utils/configAxios'

const ORDER = {
  GET_ALL: (params: string) => `/order/get-all?order_type=${params}`,
  PURCHASEORDER_DETAIL: (id: string) => `/order/get-by-id?id=${id}&order_type=Đơn nhập`,
  SELLORDER_DETAIL: (id: string) => `/order/get-by-id?id=${id}&order_type=Đơn bán`,
  CREATE_PURCHASEORDER: '/order/import/create',
  CREATE_SELLORDER: '/order/sale/create',
  UPDATE_ORDER: (id: string) => `/order/update-detail-by-id/${id}`,
  UPDATE_ORDER_STATUS: (id: string) => `/order/update-status-by-id/${id}`
}

const OrderService = {
  getAllOrder: (params: string) => axiosConfig.get(ORDER.GET_ALL(params)),
  getPurchaseOrderDetail: (id: string) => axiosConfig.get(ORDER.PURCHASEORDER_DETAIL(id)),
  getSellOrderDetail: (id: string) => axiosConfig.get(ORDER.SELLORDER_DETAIL(id)),
  createPurchaseOrder: (data: PurchaseOrder) => axiosConfig.post(ORDER.CREATE_PURCHASEORDER, data),
  createSellOrder: (data: PurchaseOrder) => axiosConfig.post(ORDER.CREATE_SELLORDER, data),
  updateOrderDetail: (id: string, data: PurchaseOrder) => axiosConfig.patch(ORDER.UPDATE_ORDER(id), data),
  updateOrderStatus: (id: string, data: OrderStatus) => axiosConfig.patch(ORDER.UPDATE_ORDER_STATUS(id), data)
}

export default OrderService
