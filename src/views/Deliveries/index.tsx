import React, { useEffect, useState } from 'react'
import { Row, Col, Card } from 'react-bootstrap'
import CustomTable from '~/components/Table/CustomTable'
import moment from 'moment'
import { Helmet } from 'react-helmet'
import Error from '~/views/Errors'
import PageLoader from '~/components/Loader/PageLoader'
import DeliveryService from '~/services/delivery.service'

function DeliveriesList() {
  const [listDeliveries, setListDeliveries] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFetched, setIsFetched] = useState(false)

  useEffect(() => {
    DeliveryService.getAllDelivery()
      .then((response: any) => {
        const dataListDeliveries = response.data.data
        setListDeliveries(dataListDeliveries)
        setIsLoading(false)
        if (dataListDeliveries) {
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
        Header: 'Tên đơn vị vận chuyển',
        accessor: 'shipper_unit'
      },
      {
        Header: 'Số điện thoại',
        accessor: 'shipper_phone'
      },
      {
        Header: 'Ngày khởi tạo',
        accessor: 'createdAt',
        Cell: ({ value }: any) => moment(value).utcOffset(7).format('DD/MM/YYYY - HH:mm:ss')
      }
    ],
    []
  )

  // const handleRowClick = (row: any) => {
  //   const id = row.values.id
  //   history.push(`/app/products/detail/${id}`)
  // }

  if (isLoading)
    return (
      <>
        <Helmet>
          <title>Danh sách đối tác vận chuyển</title>
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
              <Card.Title as='h5'>Danh sách đối tác vận chuyển</Card.Title>
            </Card.Header>
            <Card.Body>
              <CustomTable
                columns={columns}
                data={listDeliveries}
                handleRowClick={() => 1 == 1}
                hiddenColumns={['selection', 'id']}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default DeliveriesList
