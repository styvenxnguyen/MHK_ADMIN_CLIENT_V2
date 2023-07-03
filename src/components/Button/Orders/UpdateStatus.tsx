import { useState, useEffect } from 'react'
import { Button, Spinner } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { handleAlertConfirm } from '~/hooks/useAlertConfirm'
import OrderService from '~/services/order.service'

interface UpdateStatusProps {
  id: string
  order_status: string
  order_type: string
}

const UpdateStatus = ({ id, order_status, order_type }: UpdateStatusProps) => {
  const listStatusPurchaseOrder = ['Tạo đơn', 'Nhập hàng', 'Hoàn trả']
  const listStatusSellOrder = ['Đặt hàng', 'Duyệt', 'Đóng gói', 'Xuất kho', 'Hoàn trả']
  const [updateStatus, setUpdateStatus] = useState('undefined')
  const [showLoader, setShowLoader] = useState(false)
  // const [isLoadingCancel, setIsLoadingCancel] = useState(false)

  const updateStatusBasedOnOrderStatus = () => {
    const listStatus = order_type === 'Đơn bán' ? listStatusSellOrder : listStatusPurchaseOrder
    const currentIndex = listStatus.indexOf(order_status)
    // if (currentIndex === -1 || currentIndex === listStatus.length - 1) {
    //   return
    // }
    if (order_status === 'Hoàn thành') {
      const nextStatus = listStatus[listStatus.length - 1]
      setUpdateStatus(nextStatus)
    } else {
      const nextStatus = listStatus[currentIndex + 1]
      setUpdateStatus(nextStatus)
    }
  }

  useEffect(() => {
    updateStatusBasedOnOrderStatus()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order_status, order_type])

  // const handleCancel = () => {
  //   handleAlertConfirm({
  //     html: `Bạn có chắc chắn muốn huỷ đơn hàng ?`,
  //     confirmText: 'Huỷ',
  //     confirmButtonColor: 'red',
  //     showCancelButton: true,
  //     icon: 'warning',
  //     handleConfirmed: () => {
  //       setIsLoadingCancel(true)
  //       OrderService.updateOrderStatus(id, { update_status: 'Hủy' })
  //         .then(() => {
  //           setTimeout(() => {
  //             setIsLoadingCancel(false)
  //             handleAlertConfirm({
  //               text: `Huỷ đơn ${order_type === 'Đơn nhập' && 'nhập '}hàng thành công`,
  //               icon: 'success'
  //             })
  //           }, 1000)
  //         })
  //         .catch(() => {
  //           setTimeout(() => {
  //             setIsLoadingCancel(false)
  //             Swal.fire('', `Huỷ đơn ${order_type === 'Đơn nhập' && 'nhập '}hàng thất bại`, 'error')
  //           }, 1000)
  //         })
  //     }
  //   })
  // }

  const handleUpdate = () => {
    handleAlertConfirm({
      html: `Đơn hàng sẽ được chuyển sang trạng thái <b>${updateStatus}</b></br>Bạn có chắc chắn muốn tiếp tục ?`,
      confirmText: 'Tiếp tục',
      showCancelButton: true,
      icon: 'warning',
      handleConfirmed: () => {
        setShowLoader(true)
        OrderService.updateOrderStatus(id, { update_status: updateStatus })
          .then(() => {
            setTimeout(() => {
              setShowLoader(false)
              handleAlertConfirm({
                text: `Cập nhật trạng thái đơn ${order_type === 'Đơn nhập' ? 'nhập ' : ''}hàng thành công`,
                icon: 'success'
              })
            }, 1000)
          })
          .catch(() => {
            setTimeout(() => {
              setShowLoader(false)
              Swal.fire('', `Cập nhật trạng thái đơn ${order_type === 'Đơn nhập' ? 'nhập ' : ''}hàng thất bại`, 'error')
            }, 1000)
          })
      }
    })
  }

  return (
    <>
      {/* {order_status !== 'Hoàn thành'  && (
        <Button
          variant='outline-danger'
          className={`mb-3 ${!isLoadingCancel && 'mr-2'}`}
          onClick={handleCancel}
          disabled={isLoadingCancel}
        >
          {isLoadingCancel ? (
            <>
              <Spinner className='mr-2' animation='border' size='sm' /> Đang huỷ đơn...
            </>
          ) : (
            'Huỷ'
          )}
        </Button>
      )} */}
      {order_status !== 'Huỷ' && order_status !== 'Hoàn trả' && (
        <Button className='mb-3 ml-2' onClick={handleUpdate} disabled={showLoader || updateStatus === 'undefined'}>
          {showLoader ? (
            <>
              <Spinner className='mr-2' animation='border' size='sm' /> Đang xử lý...
            </>
          ) : (
            <span>{updateStatus === 'undefined' ? 'Lỗi trạng thái' : updateStatus}</span>
          )}
        </Button>
      )}
    </>
  )
}

export default UpdateStatus
