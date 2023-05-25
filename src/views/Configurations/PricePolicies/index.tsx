import { useState, useEffect, useMemo } from 'react'
import { services } from '~/services/api'
import { Button, Card, Col, Row } from 'react-bootstrap'
import { Helmet } from 'react-helmet'
import PageLoader from '~/components/Loader/PageLoader'
import Error from '~/views/Errors'
import moment from 'moment'
import CustomTable from '~/components/Table/CustomTable'

const PricePolicies = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isFetched, setIsFetched] = useState(false)
  const [pricePoliciesList, setPricePoliciesList] = useState([])

  function getDefaultCellValue(rowData: any) {
    if (rowData.isImportDefault && rowData.isSellDefault) {
      return 'BÁN HÀNG/ NHẬP HÀNG'
    } else if (rowData.isImportDefault) {
      return 'NHẬP HÀNG'
    } else if (rowData.isSellDefault) {
      return 'BÁN HÀNG'
    } else {
      return ''
    }
  }

  useEffect(() => {
    services
      .get('/price/get-all')
      .then((response) => {
        setPricePoliciesList(response.data.data)
        setIsLoading(false)
        setIsFetched(true)
      })
      .catch(() => {
        setIsLoading(false)
      })
  }, [])

  const columns = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id'
      },
      {
        Header: 'Tên',
        accessor: 'price_type'
      },
      {
        Header: 'Mặc định',
        accessor: 'isImportDefault',
        Cell: ({ row }: any) => getDefaultCellValue(row.original)
      },
      {
        Header: 'Thời gian khởi tạo',
        accessor: 'createdAt',
        Cell: ({ value }: any) => moment(value).utcOffset(7).format('DD/MM/YYYY - HH:mm:ss')
      }
    ],
    []
  )

  if (isLoading)
    return (
      <>
        <Helmet>
          <title>Danh sách chính sách giá</title>
        </Helmet>
        <PageLoader />
      </>
    )

  if (!isFetched) return <Error errorCode='500' />
  return (
    <>
      <Row>
        <Col>
          <Card>
            <Card.Header className='flex-between'>
              <Card.Title as='h5'>Danh sách chính sách giá</Card.Title>
              <Button className='m-0'>
                <i className='feather icon-plus-circle mr-2'></i>
                Thêm chính sách giá
              </Button>
            </Card.Header>
            <Card.Body>
              <CustomTable columns={columns} data={pricePoliciesList} handleRowClick={{}}></CustomTable>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default PricePolicies
