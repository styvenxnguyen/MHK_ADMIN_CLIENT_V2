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

interface badgeStatusProps {
  label: string
  variant: string
}

function PurchaseOrdersList() {
  const history = useHistory()
  const [listPurchaseOrders, setListPurchaseOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFetched, setIsFetched] = useState(false)
  const BadgeStatus = ({ label, variant }: badgeStatusProps) => {
    return (
      <Badge pill className='py-2 px-3' variant={variant} style={{ fontSize: 12 }}>
        {label}
      </Badge>
    )
  }

  useEffect(() => {
    OrderService.getAllOrder('Đơn nhập')
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
        Cell: ({ value }: any) => {
          switch (value) {
            case 'Hủy':
              return <BadgeStatus variant='danger' label='Đã huỷ' />
            case 'Tạo đơn':
              return <BadgeStatus variant='primary' label='Tạo đơn' />
            case 'Nhập hàng':
              return <BadgeStatus variant='warning' label='Nhập hàng' />
            case 'Hoàn thành':
              return <BadgeStatus variant='success' label='Hoàn thành' />
            case 'Hoàn trả':
              return <BadgeStatus variant='secondary' label='Hoàn trả' />
          }
        }
      },
      {
        Header: 'Trạng thái thanh toán',
        accessor: 'isPaymentSuccess',
        Cell: ({ row }: any) =>
          row.values.order_total === 0 ? (
            <BadgeStatus variant='success' label='Đã thanh toán' />
          ) : (
            <BadgeStatus variant='warning' label='Chưa thanh toán' />
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
