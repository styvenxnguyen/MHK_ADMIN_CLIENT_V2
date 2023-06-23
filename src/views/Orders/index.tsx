import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Button, Badge } from 'react-bootstrap'
import CustomTable from '~/components/Table/CustomTable'
import { useHistory } from 'react-router-dom'
import moment from 'moment'
import { Helmet } from 'react-helmet'
import Error from '~/views/Errors'
import PageLoader from '~/components/Loader/PageLoader'
import OrderService from '~/services/order.service'
import { formatCurrency } from '~/utils/common'

function OrdersList() {
  const history = useHistory()
  const [listOrders, setListOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFetched, setIsFetched] = useState(false)

  useEffect(() => {
    OrderService.getAllOrder('Đơn bán')
      .then((response: any) => {
        const dataListOrders = response.data.data
        setListOrders(dataListOrders)
        setIsLoading(false)
        if (dataListOrders) {
          setIsFetched(true)
        }
      })
      .catch(() => {
        setIsLoading(false)
      })
  }, [])

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id'
      },
      {
        Header: 'Mã đơn hàng',
        accessor: 'order_code'
      },
      {
        Header: 'Trạng thái đơn hàng',
        accessor: 'order_status',
        Cell: ({ value }: any) => {
          switch (value) {
            case 'Nhập hàng':
              return (
                <Badge className='p-2' variant='primary' style={{ fontSize: 12 }}>
                  Nhập hàng
                </Badge>
              )
            case 'Hoàn thành':
              return (
                <Badge className='p-2' variant='success' style={{ fontSize: 12 }}>
                  Hoàn thành
                </Badge>
              )
            default:
              return (
                <Badge className='p-2' variant='info' style={{ fontSize: 12 }}>
                  Đang giao dịch
                </Badge>
              )
          }
        }
      },
      {
        Header: 'Trạng thái thanh toán',
        accessor: 'isPaymentSuccess',
        Cell: ({ value }: any) =>
          value === true ? (
            <Badge className='p-2' variant='success' style={{ fontSize: 12 }}>
              Đã thanh toán
            </Badge>
          ) : (
            <Badge className='p-2' style={{ fontSize: 12 }} variant='warning'>
              Chưa thanh toán
            </Badge>
          )
      },
      {
        Header: 'Nhân viên tạo đơn',
        accessor: 'staff_name'
      },
      {
        Header: 'Giá trị đơn',
        accessor: 'order_total',
        Cell: ({ value }) => formatCurrency(value)
      },
      {
        Header: 'Thời gian tạo đơn',
        accessor: 'createdAt',
        Cell: ({ value }: any) => moment(value).utcOffset(7).format('DD/MM/YYYY - HH:mm:ss')
      }
    ],
    []
  )

  const handleRowClick = (row: any) => {
    const id = row.values.id
    history.push(`/app/orders/detail/${id}`)
  }

  if (isLoading)
    return (
      <>
        <Helmet>
          <title>Danh sách đơn hàng</title>
        </Helmet>
        <PageLoader />
      </>
    )

  if (!isFetched) {
    return <Error errorCode='500' />
  }

  return (
    <React.Fragment>
      <Row>
        <Col>
          <Card>
            <Card.Header className='flex-between'>
              <Card.Title as='h5'>Danh sách đơn hàng</Card.Title>
              <Button className='m-0' onClick={() => history.push('/app/orders/create')}>
                <i className='feather icon-plus-circle mr-2'></i>
                Tạo đơn hàng
              </Button>{' '}
            </Card.Header>
            <Card.Body>
              <CustomTable columns={columns} data={listOrders} handleRowClick={handleRowClick} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default OrdersList
