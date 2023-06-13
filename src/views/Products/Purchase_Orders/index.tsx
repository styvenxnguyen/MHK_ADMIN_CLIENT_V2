import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Button, Badge } from 'react-bootstrap'
import CustomTable from '~/components/Table/CustomTable'
import { useHistory } from 'react-router-dom'
import moment from 'moment'
import { Helmet } from 'react-helmet'
import Error from '~/views/Errors'
import PageLoader from '~/components/Loader/PageLoader'
import { formatCurrency } from '~/utils/common'
import OrderService from '~/services/order.service'

function PurchaseOrdersList() {
  const history = useHistory()
  const [listPurchaseOrders, setListPurchaseOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFetched, setIsFetched] = useState(false)

  useEffect(() => {
    OrderService.getAllPurchaseOrder('Đơn nhập')
      .then((response: any) => {
        const dataListProducts = response.data.data
        setListPurchaseOrders(dataListProducts)
        setIsLoading(false)
        if (dataListProducts) {
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
        Header: 'Mã đơn nhập',
        accessor: 'order_code'
      },
      {
        Header: 'Ngày nhập',
        accessor: 'createdAt',
        Cell: ({ value }: any) => moment(value).utcOffset(7).format('DD/MM/YYYY - HH:mm:ss')
      },
      {
        Header: 'Trạng thái đơn hàng',
        accessor: 'order_status',
        Cell: ({ value }: any) =>
          value === 'Tạo đơn hàng' ? (
            <Badge className='p-2' variant='info' style={{ fontSize: 12 }}>
              Tạo đơn hàng
            </Badge>
          ) : (
            <Badge className='p-2' variant='success' style={{ fontSize: 12 }}>
              Đã hoàn thành
            </Badge>
          )
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
        Header: 'Chi nhánh nhập',
        accessor: 'agency_branch_name'
      },
      {
        Header: 'Nhà cung cấp',
        accessor: 'supplier_name'
      },
      {
        Header: 'Nhân viên tạo đơn',
        accessor: 'staff_name'
      },
      {
        Header: 'Giá trị đơn',
        accessor: 'order_total',
        Cell: ({ value }) => formatCurrency(value)
      }
    ],
    []
  )

  const handleRowClick = (row: any) => {
    const id = row.values.id
    history.push(`/app/purchase_orders/detail/${id}`)
  }

  if (isLoading)
    return (
      <>
        <Helmet>
          <title>Danh sách đơn nhập</title>
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
              <Card.Title as='h5'>Danh sách đơn nhập hàng</Card.Title>
              <Button className='m-0' onClick={() => history.push('/app/purchase_orders/create')}>
                <i className='feather icon-plus-circle mr-2'></i>
                Tạo đơn nhập hàng
              </Button>{' '}
            </Card.Header>
            <Card.Body>
              <CustomTable columns={columns} data={listPurchaseOrders} handleRowClick={handleRowClick} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default PurchaseOrdersList
