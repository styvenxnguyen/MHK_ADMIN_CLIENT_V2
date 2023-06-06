import moment from 'moment'
import React, { useState, useEffect } from 'react'
import { Badge, Button, Card, Col, Row } from 'react-bootstrap'
import { Helmet } from 'react-helmet'
import { Link, useHistory, useParams } from 'react-router-dom'
import BackPreviousPage from '~/components/Button/BackPreviousPage'
import PageLoader from '~/components/Loader/PageLoader'
import CustomTable from '~/components/Table/CustomTable'
import OrderService from '~/services/order.service'
import { OrderProduct } from '~/types/OrderProduct.type'
import { PurchaseOrder } from '~/types/PurchaseOrder.type'
import { formatCurrency } from '~/utils/common'
import Error from '~/views/Errors'

const PurchaseOrderDetail = () => {
  const params: { id: string } = useParams()
  const history = useHistory()
  const [purchaseDetail, setPurchaseDetail] = useState<PurchaseOrder>()
  const [productList, setProductList] = useState<OrderProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFetched, setIsFetched] = useState(false)
  const totalQuantity = productList.reduce((acc: any, item: any) => acc + item.product_amount, 0)
  const totalAmount = productList.reduce((acc: any, item: any) => acc + item.product_price, 0)
  const totalDiscount = productList.reduce((acc: any, item: any) => acc + item.product_discount, 0)
  const totalPayment = totalAmount - totalDiscount

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
        accessor: 'product_discount'
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

          const totalPrice = formatCurrency(amount * price)

          return totalPrice
        }
      }
    ],
    []
  )

  const dataDebtSupplier = [
    {
      data: 'Công nợ',
      value: '0'
    },
    {
      data: 'Tổng đơn nhập',
      value: '0'
    },
    {
      data: 'Trả hàng',
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
      value: totalDiscount
    },
    {
      data: 'Tiền cần trả',
      value: formatCurrency(totalPayment),
      bold: true
    }
  ]

  const dataPurchaseOrders = [
    {
      data: 'Chi nhánh',
      value: purchaseDetail && purchaseDetail.agency_branch ? purchaseDetail.agency_branch.name : '---'
    },
    {
      data: 'Chính sách giá',
      value: '---'
    },
    {
      data: 'Nhân viên phụ trách',
      value: purchaseDetail && purchaseDetail.staff ? purchaseDetail.staff.name : '---'
    },
    {
      data: 'Ngày hẹn giao',
      value: '---'
    },
    {
      data: 'Ngày nhập',
      value: moment().utcOffset(7).format('DD/MM/YYYY - HH:mm:ss') || '---'
    },
    {
      data: 'Tham chiếu',
      value: '---'
    }
  ]

  useEffect(() => {
    OrderService.getPurchaseOrderDetail(params.id)
      .then((response) => {
        const data = response.data.data
        setPurchaseDetail(data)
        setProductList(
          data.order_product_list.map((purchase: PurchaseOrder, index: number) => {
            return { ...purchase, index: data.order_product_list.length - index }
          })
        )

        setIsLoading(false)
        setIsFetched(true)
      })
      .catch(() => {
        setIsFetched(false)
      })
  }, [params.id])

  if (isLoading)
    return (
      <>
        <Helmet>
          <title>Chi tiết đơn nhập hàng</title>
        </Helmet>
        <PageLoader />
      </>
    )

  if (!isFetched) {
    return <Error errorCode='500' />
  }

  return (
    <>
      <span className='flex-between'>
        <BackPreviousPage path='/app/purchase_orders' text='Quay lại danh sách đơn nhập hàng' />
        <Button className='m-0 mb-3' onClick={() => history.push(`/app/purchase_orders/detail/${params.id}/edit`)}>
          <i className='feather icon-edit'></i>
          Sửa đơn nhập
        </Button>
      </span>

      <Row className='text-normal'>
        <Col lg={8}>
          <Card style={{ height: '90%' }}>
            <Card.Header>
              <h5>
                <i className='feather icon-user mr-2'></i>
                Thông tin nhà cung cấp
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col lg={6}>
                  <div className='font-weight-bold'>
                    <p>
                      <Link to='#'>{purchaseDetail?.supplier && purchaseDetail.supplier.name}</Link>
                    </p>
                    <p>Số điện thoại : {purchaseDetail?.supplier && purchaseDetail.supplier.phone}</p>

                    {purchaseDetail?.supplier && purchaseDetail.supplier.addresses
                      ? purchaseDetail.supplier.addresses.map((address: any, index: any) => (
                          <p key={`addressSupplier_${index}`}>
                            Địa chỉ {index + 1}:{' '}
                            <span style={{ fontWeight: '500' }}>{address.user_specific_address}</span>
                          </p>
                        ))
                      : 'Chưa cập nhật địa chỉ'}
                  </div>
                </Col>

                <Col>
                  <div className='box-dash'>
                    {dataDebtSupplier.map((debtSupplier, index) => (
                      <span key={`debtSupplier_${index}`} className='flex-between m-2'>
                        <span>{debtSupplier.data}</span>
                        <span className='text-c-blue font-weight-bold'>{debtSupplier.value}</span>
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
              {dataPurchaseOrders.map((data: any, index) => (
                <span key={`dataPurchaseOrders_${index}`} className='d-flex mb-3'>
                  <span>{data.data} : </span>
                  <span className='ml-2'>{data.value}</span>
                </span>
              ))}
            </Card.Body>
          </Card>
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
                  <p>{purchaseDetail?.order_note && purchaseDetail.order_note}</p>
                  <p className='font-weight-bold mt-2'>Tags</p>
                  <p>
                    {purchaseDetail?.order_tags &&
                      purchaseDetail.order_tags.map((tag: any, index: number) => (
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
    </>
  )
}

export default PurchaseOrderDetail
