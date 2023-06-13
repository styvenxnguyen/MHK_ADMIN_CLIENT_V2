import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Button } from 'react-bootstrap'
import { Helmet } from 'react-helmet'
import moment from 'moment'
import { useHistory } from 'react-router-dom'
import CustomTable from '~/components/Table/CustomTable'
import Error from '../Errors'
import PageLoader from '~/components/Loader/PageLoader'
import CustomerService from '~/services/customer.service'

function CustomersList() {
  const history = useHistory()
  const [listCustomer, setListCustomer] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFetched, setIsFetched] = useState(false)

  const handleRowClick = (row: any) => {
    const id = row.values.id
    history.push(`/app/customers/detail/${id}`)
  }

  useEffect(() => {
    CustomerService.getListCustomer()
      .then((response) => {
        const filteredData = response.data.data.filter((user: any) => user !== null)
        setListCustomer(filteredData)
        setIsLoading(false)
        setIsFetched(true)
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
        Header: 'Tên khách hàng',
        accessor: 'customer_name'
      },
      {
        Header: 'Mã khách hàng',
        accessor: 'user_code'
      },
      {
        Header: 'Số điện thoại',
        accessor: 'customer_phone'
      },
      {
        Header: 'Trạng thái',
        accessor: 'customer_status',
        Cell: ({ value }: any) => (
          <span style={{ color: value === 'Ngừng giao dịch' ? 'red' : 'rgb(13, 180, 115)' }}>
            {value === 'Ngừng giao dịch' ? 'Ngừng giao dịch' : 'Đang giao dịch'}
          </span>
        )
      },
      {
        Header: 'Thời gian khởi tạo',
        accessor: 'createdAt',
        Cell: ({ value }) => moment(value).utcOffset(7).format('DD/MM/YYYY - HH:mm:ss')
      }
    ],
    []
  )

  if (isLoading)
    return (
      <React.Fragment>
        <Helmet>
          <title>Danh sách khách hàng</title>
        </Helmet>
        <PageLoader />
      </React.Fragment>
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
              <Card.Title as='h5'>Danh sách khách hàng</Card.Title>
              <Button className='m-0' onClick={() => history.push('/app/customers/create')}>
                <i className='feather icon-plus-circle mr-2'></i>
                Thêm khách hàng
              </Button>
            </Card.Header>
            <Card.Body>
              <CustomTable
                columns={columns}
                data={listCustomer}
                handleRowClick={handleRowClick}
                selectedTitle='khách hàng'
                object='customer'
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default CustomersList
