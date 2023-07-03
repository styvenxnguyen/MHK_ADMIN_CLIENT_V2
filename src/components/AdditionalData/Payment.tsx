import { useEffect, useState } from 'react'
import { Button, Card, Col, FormControl, FormGroup, FormLabel, Row, Spinner } from 'react-bootstrap'
import Select from 'react-select'
import CustomModal from '../Modal'
import { SelectProps } from '~/types/Select.type'
import { Payment } from '~/types/Payment.type'
import PaymentService from '~/services/payment.service'
import { handleAlertConfirm } from '~/hooks/useAlertConfirm'
import Swal from 'sweetalert2'
import { formatCurrency } from '~/utils/common'
import { FcOk, FcMediumPriority, FcLowPriority } from 'react-icons/fc'

interface PaymentProps {
  user_id: string
  source_id: string
  debt_payment_amount: number
  value: string
  order_total: number
}

const Payment = ({ value, user_id, source_id, debt_payment_amount, order_total }: PaymentProps) => {
  const [showModal, setShowModal] = useState(false)
  const [showLoader, setShowLoader] = useState(false)
  const [listPayment, setListPayment] = useState<Payment[]>([])
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<SelectProps>()
  const [valuePayment, setValuePayment] = useState(order_total)

  const inputForm = [
    {
      label: 'Phương thức thanh toán',
      type: 'select',
      value: selectedPaymentMethod
    },
    {
      label: 'Số tiền',
      type: 'number',
      value: debt_payment_amount
    }
  ]

  useEffect(() => {
    PaymentService.getAllPayment().then((res) => {
      const data = res.data.data
      setListPayment(
        data.map((method: Payment) => ({
          label: method.payment_type,
          value: method.id
        }))
      )
    })
  }, [])

  const handleShowModal = () => {
    setShowModal(true)
  }

  const handleSubmit = () => {
    setShowLoader(true)
    PaymentService.pay({ user_id: user_id, source_id: source_id, debt_payment_amount: valuePayment })
      .then(() => {
        setTimeout(() => {
          setShowLoader(false)
          handleAlertConfirm({ text: 'Xác nhận thanh toán thành công', icon: 'success' })
        }, 1000)
      })
      .catch(() => {
        setTimeout(() => {
          setShowLoader(false)
          Swal.fire('', 'Số tiền bạn đã nhập vượt quá số tiền cần thanh toán cho hoá đơn', 'error')
        }, 1000)
      })
  }

  return (
    <>
      <Card>
        <Card.Header className='flex-between'>
          <h5>
            {order_total === debt_payment_amount ? (
              <FcMediumPriority style={{ fontSize: '24px' }} className='mr-2' />
            ) : order_total === 0 ? (
              <FcOk style={{ fontSize: '24px' }} className='mr-2' />
            ) : (
              <FcLowPriority style={{ fontSize: '24px' }} className='mr-2' />
            )}
            {order_total === debt_payment_amount &&
              `Đơn hàng ${value === 'supplier' ? 'nhập ' : ''}chưa được thanh toán`}
            {order_total !== debt_payment_amount &&
              order_total !== 0 &&
              `Đơn hàng ${value === 'supplier' ? 'nhập ' : ''}đã được thanh toán một phần`}
            {order_total === 0 && `Đơn hàng ${value === 'supplier' ? 'nhập ' : ''}đã được thanh toán toàn bộ`}
          </h5>
          {order_total !== 0 && (
            <Button className='m-0' onClick={handleShowModal}>
              Thanh toán
            </Button>
          )}
        </Card.Header>
        <Card.Body>
          <div style={{ backgroundColor: 'rgb(242, 249, 255)' }} className='flex-between p-3'>
            <span>
              {value === 'supplier' ? 'Tiền cần trả NCC: ' : 'Khách phải trả: '}{' '}
              <span className='font-weight-bold'>{formatCurrency(debt_payment_amount)}</span>
            </span>
            <span>
              {value === 'supplier' ? 'Đã trả: ' : 'Đã thanh toán: '}{' '}
              <span className='font-weight-bold'>{formatCurrency(debt_payment_amount - order_total)}</span>
            </span>
            <span>
              Còn phải trả:
              <span className='font-weight-bold text-c-red'> {formatCurrency(order_total)}</span>
            </span>
          </div>
        </Card.Body>
      </Card>

      <CustomModal
        size='lg'
        show={showModal}
        handleClose={() => setShowModal(false)}
        disabled={showLoader}
        textSubmit={
          showLoader ? (
            <span>
              <Spinner size='sm' className='mr-2' animation='border' />
              Đang thanh toán...
            </span>
          ) : (
            'Thanh toán'
          )
        }
        title='Xác nhận thanh toán'
        body={
          <Row>
            {inputForm.map((input, index) => (
              <Col key={`inputForm_${index}`} lg={6}>
                <FormGroup>
                  <FormLabel>{input.label}</FormLabel>
                  {input.type === 'number' ? (
                    <FormControl
                      defaultValue={valuePayment}
                      onChange={(e) => setValuePayment(parseInt(e.target.value))}
                      type='number'
                      className='no-spin'
                    ></FormControl>
                  ) : (
                    <Select
                      defaultValue={listPayment[0]}
                      onChange={(selectedPayment: any) => setSelectedPaymentMethod(selectedPayment)}
                      options={listPayment}
                    ></Select>
                  )}
                </FormGroup>
              </Col>
            ))}
          </Row>
        }
        handleSubmit={handleSubmit}
      />
    </>
  )
}

export default Payment
