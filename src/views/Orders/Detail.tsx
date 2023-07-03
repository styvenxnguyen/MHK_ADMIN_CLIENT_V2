import moment from 'moment'
import React, { useCallback, useEffect, useState } from 'react'
import { Badge, Button, Card, Col, Row } from 'react-bootstrap'
import { Helmet } from 'react-helmet'
import { Link, useHistory, useParams } from 'react-router-dom'
import Select from 'react-select'

import BackPreviousPage from '~/components/Button/BackPreviousPage'
import PageLoader from '~/components/Loader/PageLoader'
import CustomTable from '~/components/Table/CustomTable'
import CustomerService from '~/services/customer.service'
import OrderService from '~/services/order.service'
import { Customer } from '~/types/Customer.type'
import { OrderProduct } from '~/types/OrderProduct.type'
import { PurchaseOrder } from '~/types/Order.type'
import { formatCurrency } from '~/utils/common'
import Error from '../Errors'
import DebtService from '~/services/debt.service'
import Payment from '~/components/AdditionalData/Payment'
import UpdateStatus from '~/components/Button/Orders/UpdateStatus'

const optionStatus = [
  {
    label: 'Giao ĐTVC',
    value: 1
  },
  {
    label: 'Hoãn giao',
    value: 1
  },
  {
    label: 'Giao đơn đóng hàng',
    value: 1
  },
  {
    label: 'Sale chốt ',
    value: 1
  }
]

const OrdersDetail = () => {
  const history = useHistory()
  const params: { id: string } = useParams()
  const [detailOrder, setDetailOrder] = useState<PurchaseOrder>()
  const [isLoading, setIsLoading] = useState(true)
  const [isFetched, setIsFetched] = useState(false)
  const [customer, setCustomer] = useState<Customer>()
  const [dataDebt, setDataDebt] = useState('0')
  const [productList, setProductList] = useState<OrderProduct[]>([])
  const totalQuantity = productList.reduce((acc: number, item: any) => acc + parseInt(item.product_amount), 0)
  const totalAmount = productList.reduce((acc: number, item: any) => acc + item.product_amount * item.product_price, 0)
  const totalDiscount = productList.reduce(
    (acc: number, item: any) => acc + (item.product_amount * item.product_price * item.product_discount) / 100,
    0
  )
  const totalPayment = totalAmount - totalDiscount

  const dataDebtSupplier = [
    {
      data: 'Nợ phải thu',
      value: dataDebt
    },
    {
      data: 'Tổng chi tiêu',
      value: '0'
    },
    {
      data: 'Trả hàng',
      value: '0'
    },
    {
      data: 'Giao hàng thất bại',
      value: '0'
    }
  ]

  const totalProduct = [
    {
      data: 'Số lượng',
      value: totalQuantity
    },
    {
      data: 'Tổng tiền',
      value: formatCurrency(totalAmount)
    },
    {
      data: 'Chiết khấu',
      value: formatCurrency(totalDiscount)
    },
    {
      data: 'Tiền cần trả',
      value: formatCurrency(totalPayment),
      bold: true
    }
  ]

  const columns = React.useMemo(
    () => [
      {
        Header: 'STT',
        accessor: 'index'
      },
      {
        Header: 'Mã SKU',
        accessor: 'product_variant_detail_SKU'
      },
      {
        Header: 'Tên sản phẩm',
        accessor: 'product_variant_detail_name'
      },
      {
        Header: 'Số lượng',
        accessor: 'product_amount',
        Cell: ({ value }: { value: number }) => <div>{value}</div>
      },
      {
        Header: 'Giá sản phẩm',
        accessor: 'product_price',
        Cell: ({ value }: any) => formatCurrency(value)
      },
      {
        Header: 'Chiết khấu',
        accessor: 'product_discount',
        Cell: ({ value, row }: any) => {
          const amount = row.values.product_amount
          const price = row.values.product_price
          return (
            <span>
              {value}% ({formatCurrency((amount * price * value) / 100)})
            </span>
          )
        }
      },
      {
        Header: 'Đơn vị',
        accessor: 'product_unit'
      },
      {
        Header: 'Thành tiền',
        Cell: ({ row }: any) => {
          const amount = row.values.product_amount
          const price = row.values.product_price
          const discount = row.values.product_discount

          const totalPrice = formatCurrency((amount * price * (100 - discount)) / 100)

          return totalPrice
        }
      }
    ],
    []
  )

  const dataSellOrders = [
    {
      data: 'Trạng thái xử lý',
      value: optionStatus
    },
    {
      data: 'Trạng thái đơn',
      value: detailOrder && detailOrder.order_status ? detailOrder.order_status : '---'
    },
    {
      data: 'Bán tại',
      value: detailOrder && detailOrder.agency_branch ? detailOrder.agency_branch?.name : '---'
    },
    {
      data: 'Bán bởi',
      value: detailOrder && detailOrder.staff ? detailOrder.staff.name : '---'
    },
    {
      data: 'Hẹn giao hàng',
      value: detailOrder ? moment(detailOrder.order_delivery_date).utcOffset(7).format('DD/MM/YYYY - HH:mm:ss') : '---'
    },
    {
      data: 'Ngày bán',
      value: detailOrder ? moment(detailOrder.createdAt).utcOffset(7).format('DD/MM/YYYY - HH:mm:ss') : '---'
    }
  ]

  const getDetailOrder = useCallback(async () => {
    try {
      const res = await OrderService.getSellOrderDetail(params.id)
      DebtService.getTotal(res.data.data.supplier.user_id).then((res) => {
        setDataDebt(formatCurrency(Math.abs(res.data.data.debt_amount)))
      })
      setDetailOrder(res.data.data)
      setProductList(
        res.data.data.order_product_list.map((purchase: PurchaseOrder, index: number) => {
          return { ...purchase, index: res.data.data.order_product_list.length - index }
        })
      )
    } catch (error) {
      console.log(error)
    }
  }, [params.id])

  const getCustomer = useCallback(async () => {
    try {
      if (detailOrder?.supplier?.user_id) {
        const res = await CustomerService.getCustomerDetail(detailOrder?.supplier?.user_id)
        setCustomer(res.data.data)
      }
    } catch (error) {
      console.log(error)
    }
  }, [detailOrder?.supplier?.user_id])

  useEffect(() => {
    getDetailOrder()
      .then(() => {
        setTimeout(() => {
          setIsLoading(false)
          setIsFetched(true)
        }, 1000)
      })
      .catch(() => {
        setTimeout(() => {
          setIsLoading(false)
        }, 1000)
      })
  }, [getDetailOrder])

  useEffect(() => {
    if (detailOrder?.supplier) {
      getCustomer()
    }
  }, [getCustomer, detailOrder?.supplier])

  if (isLoading)
    return (
      <>
        <Helmet>
          <title>Chi tiết đơn hàng</title>
        </Helmet>
        <PageLoader />
      </>
    )

  if (!isFetched) {
    return <Error errorCode='500' />
  }

  return (
    <div>
      <span className='flex-between'>
        <BackPreviousPage path='/app/orders' text='Quay lại danh sách đơn hàng' />

        <span>
          <Button
            className='m-0 mb-3'
            variant='outline-primary'
            onClick={() => history.push(`/app/orders/detail/${params.id}/edit`)}
          >
            <i className='feather icon-edit'></i>
            Sửa đơn hàng
          </Button>
          <UpdateStatus id={params.id} order_status={detailOrder?.order_status || ''} order_type='Đơn bán' />
        </span>
      </span>

      <Row className='text-normal'>
        <Col lg={8}>
          <Card style={{ height: '90%' }}>
            <Card.Header>
              <h5>
                <i className='feather icon-user mr-2'></i>
                Thông tin khách hàng
              </h5>
              <div style={{ fontSize: '16px', marginTop: '10px' }}>
                <Link to={`/app/customers/detail/${customer?.id}`} className='text-click mr-2'>
                  {customer?.customer_name}
                </Link>
                -<span className='ml-2'>{customer?.customer_phone}</span>
              </div>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col lg={7} style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                  <div>
                    <p style={{ fontWeight: '600' }}>ĐIA CHỈ GIAO HÀNG</p>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '14px' }}>{customer?.customer_phone}</span>
                      <span style={{ fontSize: '14px' }}>
                        {customer?.address_list[0].user_specific_address}, {customer?.address_list[0].user_district},
                        {` `}
                        {customer?.address_list[0].user_province}
                      </span>
                    </div>
                  </div>

                  <div>
                    <p style={{ fontWeight: '600' }}>ĐIA CHỈ NHẬN HÓA ĐƠN</p>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '14px' }}>{customer?.customer_phone}</span>
                      <span style={{ fontSize: '14px' }}>
                        {customer?.address_list[0].user_specific_address}, {customer?.address_list[0].user_district},
                        {` `}
                        {customer?.address_list[0].user_province}
                      </span>
                    </div>
                  </div>
                </Col>

                <Col>
                  <div className='box-dash'>
                    {dataDebtSupplier.map((debtSupplier, index) => (
                      <span key={`debtSupplier_${index}`} className='flex-between m-2'>
                        <span>{debtSupplier.data}</span>
                        <span className='text-c-red font-weight-bold'>{debtSupplier.value}</span>
                      </span>
                    ))}
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card style={{ height: '90%' }}>
            <Card.Header>
              <h5>
                <i className='feather icon-clipboard mr-2'></i>
                Thông tin đơn hàng nhập
              </h5>
            </Card.Header>
            <Card.Body>
              {dataSellOrders.map((data: any, index) => (
                <span key={`dataSellOrders_${index}`} className='d-flex mb-4'>
                  <span style={{ width: '140px' }}>{data.data} </span>
                  {index === 0 ? (
                    <div style={{ position: 'relative', flex: '1' }}>
                      <div style={{ position: 'absolute', right: 0, left: '5px', top: '-7px' }}>
                        <Select placeholder='' options={data.value} isMulti={false} name='colors'></Select>
                      </div>
                    </div>
                  ) : (
                    <span className='ml-2'>
                      :{` `}
                      {data.value}
                    </span>
                  )}
                </span>
              ))}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={12}>
          <Payment
            order_total={detailOrder?.order_total || 0}
            value='customer'
            debt_payment_amount={totalPayment}
            user_id={detailOrder?.supplier?.user_id || ''}
            source_id={params.id}
          />
        </Col>

        <Col>
          <Card>
            <Card.Header>
              <h5>
                <i className='feather icon-archive mr-2'></i>
                Thông tin sản phẩm
              </h5>
            </Card.Header>
            <Card.Body>
              <CustomTable columns={columns} data={productList} handleRowClick={{}} hiddenColumns={['selection']} />

              <hr className='dashed-top' />
              <Row className='justify-content-between'>
                <Col lg={3}>
                  <p className='font-weight-bold'>Ghi chú đơn</p>
                  <p>{detailOrder?.order_note && detailOrder.order_note}</p>
                  <p className='font-weight-bold mt-2'>Tags</p>
                  <p>
                    {detailOrder?.order_tags &&
                      detailOrder.order_tags.map((tag: any, index: number) => (
                        <Badge className='p-2 mr-2 mb-2' key={`tagsProduct_${index}`} variant='warning'>
                          {tag.Tag.tag_title}
                        </Badge>
                      ))}
                  </p>
                </Col>
                <Col lg={3}>
                  {totalProduct.map((total, index) => (
                    <span
                      key={`debtSupplier_${index}`}
                      className={total.bold ? 'font-weight-bold flex-between m-3' : 'flex-between m-3'}
                      style={total.bold ? { borderTop: '1px solid gray', paddingTop: '10px' } : {}}
                    >
                      <span>{total.data}</span>
                      <span>{total.value}</span>
                    </span>
                  ))}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default OrdersDetail
