import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Button } from 'react-bootstrap'
import CustomTable from '~/components/Table/CustomTable'
import { useHistory } from 'react-router-dom'
import moment from 'moment'
import { Helmet } from 'react-helmet'
import Error from '~/views/Errors'
import PageLoader from '~/components/Loader/PageLoader'
import SupplierService from '~/services/supplier.service'

function SuppliersList() {
  const history = useHistory()
  const [listSuppliers, setListSupplier] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFetched, setIsFetched] = useState(false)

  useEffect(() => {
    SupplierService.getAllSupplier()
      .then((response: any) => {
        const dataListSupplier = response.data.data
        setListSupplier(dataListSupplier)
        setIsLoading(false)
        if (dataListSupplier) {
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
        Header: 'Mã nhà cung cấp',
        accessor: 'user_code'
      },
      {
        Header: 'Tên nhà cung cấp',
        accessor: 'customer_name'
      },
      {
        Header: 'Số điện thoại',
        accessor: 'customer_phone'
      },
      {
        Header: 'Trạng thái',
        accessor: 'customer_status',
        Cell: ({ value }: any) => (
          <span style={{ color: value === 'Đang giao dịch' ? 'rgb(13, 180, 115)' : 'red' }}>
            {value === 'Đang giao dịch' ? 'Đang giao dịch' : 'Ngừng giao dịch'}
          </span>
        )
      },
      {
        Header: 'Thời gian khởi tạo',
        accessor: 'createdAt',
        Cell: ({ value }: any) => moment(value).utcOffset(7).format('DD/MM/YYYY - HH:mm:ss')
      }
    ],
    []
  )

  const handleRowClick = (row: any) => {
    const id = row.values.id
    history.push(`/app/suppliers/detail/${id}`)
  }

  if (isLoading)
    return (
      <>
        <Helmet>
          <title>Danh sách nhà cung cấp</title>
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
              <Card.Title as='h5'>Danh sách nhà cung cấp</Card.Title>
              <Button className='m-0' onClick={() => history.push('#')}>
                <i className='feather icon-plus-circle mr-2'></i>
                Thêm nhà cung cấp
              </Button>{' '}
            </Card.Header>
            <Card.Body>
              <CustomTable columns={columns} data={listSuppliers} handleRowClick={handleRowClick} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default SuppliersList
