import moment from 'moment'
import { useEffect, useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { Helmet } from 'react-helmet'
import { Link, useParams } from 'react-router-dom'
import BackPreviousPage from '~/components/Button/BackPreviousPage'
import PageLoader from '~/components/Loader/PageLoader'
import { services } from '~/services/api'
import Error from '~/views/Errors'

const Detail = () => {
  const { id }: any = useParams()
  const [DetailData, setDetailData]: any = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFetched, setIsFetched] = useState(false)
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

  const dataPurchaseOrders = [
    {
      data: 'Chi nhánh',
      value: DetailData && DetailData.agency_branch ? DetailData.agency_branch.name : '---'
    },
    {
      data: 'Chính sách giá',
      value: '---'
    },
    {
      data: 'Nhân viên phụ trách',
      value: DetailData && DetailData.staff ? DetailData.staff.name : '---'
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
        setDetailData(data)
        setIsLoading(false)
        if (data) {
          setIsFetched(true)
        }
      })
      .catch(() => {
        setIsLoading(false)
      })
  }, [id])

  if (isLoading)
    return (
      <>
        <Helmet>
          <title>Chi tiết đơn nhập</title>
        </Helmet>
        <PageLoader />
      </>
    )

  if (!isFetched) {
    return <Error errorCode='500' />
  }

  return (
    <>
      <BackPreviousPage path='/app/purchase_orders' text='Quay lại danh sách đơn hàng nhập' />
      <Row>
        <Col lg={7}>
          <Card style={{ height: '90%' }}>
            <Card.Body className='text-normal'>
              <span className='d-flex'>
                <i className='feather icon-user mr-2' />
                <h5>Thông tin nhà cung cấp</h5>
              </span>

              <Row className='mt-4'>
                <Col lg={6}>
                  <div className='font-weight-bold'>
                    <p>
                      <Link to={``}>{DetailData.supplier.name}</Link>
                    </p>
                    <p>Số điện thoại : {DetailData.supplier.phone}</p>

                    {DetailData.supplier.addresses
                      ? DetailData.supplier.addresses.map((address: any, index: any) => (
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
            <Card.Body className='text-normal'>
              <span className='d-flex'>
                <i className='feather icon-clipboard mr-2' />
                <h5>Thông tin đơn hàng nhập</h5>
              </span>

              {dataPurchaseOrders.map((data, index) => (
                <span key={`dataPurchaseOrders_${index}`} className='d-flex my-3'>
                  <span>{data.data} : </span>
                  <span className='ml-2'>{data.value}</span>
                </span>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default Detail
