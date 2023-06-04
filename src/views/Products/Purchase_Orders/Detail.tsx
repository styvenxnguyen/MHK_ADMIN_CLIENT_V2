import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Badge, Button, Card, Col, Row } from 'react-bootstrap'
import { Helmet } from 'react-helmet'
import { Link, useHistory, useParams } from 'react-router-dom'
import BackPreviousPage from '~/components/Button/BackPreviousPage'
import PageLoader from '~/components/Loader/PageLoader'
import CustomTable from '~/components/Table/CustomTable'
import { services } from '~/services/api'
import Error from '~/views/Errors'

const PurchaseOrderDetail = () => {
  const { id }: any = useParams()
  const history = useHistory()
  const [dataDetail, setdataDetail] = useState<any>([])
  const [dataProduct, setDataProduct] = useState<any>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFetched, setIsFetched] = useState(false)

  const formatCurrency = (value: number) => {
    const intValue = Math.floor(value) // Chuyển đổi số thành số nguyên
    const formattedValue = intValue.toLocaleString() // Phân giá trị tiền bằng dấu phẩy
    return formattedValue
  }

  const totalQuantity = dataProduct.reduce((acc: any, item: any) => acc + item.product_amount, 0)
  const totalAmount = dataProduct.reduce((acc: any, item: any) => acc + item.product_price, 0)
  const totalDiscount = dataProduct.reduce((acc: any, item: any) => acc + item.product_discount, 0)
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
        accessor: 'product_amount'
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
      value: dataDetail && dataDetail.agency_branch ? dataDetail.agency_branch.name : '---'
    },
    {
      data: 'Chính sách giá',
      value: '---'
    },
    {
      data: 'Nhân viên phụ trách',
      value: dataDetail && dataDetail.staff ? dataDetail.staff.name : '---'
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
    services
      .get(`/order/import/get-by-id/${id}`)
      .then((response: any) => {
        const data = response.data.data
        setdataDetail(data)
        setDataProduct(
          data.order_product_list.map((product: any, index: any) => {
            return { ...product, index: data.order_product_list.length - index }
          })
        )
        setIsLoading(false)
        if (data) {
          setIsFetched(true)
        }
      })
      .catch(() => {
        setIsLoading(false)
      })
  }, [id])

  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>Chi tiết đơn nhập</title>
        </Helmet>
        <PageLoader />
      </>
    )
  }

  if (!isFetched) {
    return <Error errorCode='500' />
  }

  return (
    <>
      <span className='flex-between'>
        <BackPreviousPage path='/app/purchase_orders' text='Quay lại danh sách đơn hàng nhập' />
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button onClick={() => history.push(`/app/purchase_orders/detail/${id}/edit`)} className='m-0 mb-3'>
            Sửa đơn nhập
          </Button>
          <Button onClick={() => history.push(`/app/purchase_orders/detail/${id}/editproduct`)} className='m-0 mb-3'>
            Sửa đơn
          </Button>
        </div>
      </span>
      <Row className='text-normal'>
        <Col lg={7}>
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
                      <Link to='#'>{dataDetail.supplier.name}</Link>
                    </p>
                    <p>Số điện thoại : {dataDetail.supplier.phone}</p>

                    {dataDetail.supplier.addresses
                      ? dataDetail.supplier.addresses.map((address: any, index: any) => (
                          <p key={`addressSupplier_${index}`}>
                            Địa chỉ {index + 1}: {address.user_specific_address}
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
        <Col lg={5}>
          <Card style={{ height: '90%' }}>
            <Card.Header>
              <h5>
                <i className='feather icon-clipboard mr-2'></i>
                Thông tin đơn hàng nhập
              </h5>
            </Card.Header>
            <Card.Body>
              {dataPurchaseOrders.map((data, index) => (
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
              <CustomTable columns={columns} data={dataProduct} handleRowClick={{}} hiddenColumns={['selection']} />

              <hr className='dashed-top' />
              <Row className='justify-content-between'>
                <Col lg={9}>
                  <p className='font-weight-bold'>Ghi chú đơn</p>
                  <p>{dataDetail.order_note}</p>
                  <p className='font-weight-bold'>Tags</p>
                  <p>
                    {dataDetail.order_tags.map((tag: any, index: any) => (
                      <Badge className='p-2 mr-2' key={`tagsProduct_${index}`} variant='warning'>
                        {tag.Tag.tag_title}
                      </Badge>
                    ))}
                  </p>
                </Col>
                <Col lg={3}>
                  {totalProduct.map((total, index) => (
                    <span
                      key={`debtSupplier_${index}`}
                      className={total.bold ? 'font-weight-bold flex-between mb-3' : 'flex-between mb-3'}
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
