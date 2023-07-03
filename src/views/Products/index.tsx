import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Button } from 'react-bootstrap'
import CustomTable from '~/components/Table/CustomTable'
import { useHistory } from 'react-router-dom'
import moment from 'moment'
import { Helmet } from 'react-helmet'
import Error from '~/views/Errors'
import PageLoader from '~/components/Loader/PageLoader'
import ProductService from '~/services/product.service'

function ProductsList() {
  const history = useHistory()
  const [listProducts, setListProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFetched, setIsFetched] = useState(false)

  useEffect(() => {
    ProductService.getListProduct()
      .then((response: any) => {
        const dataListProducts = response.data.data
        setListProducts(dataListProducts)
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
        Header: 'Mã SKU',
        accessor: 'product_SKU'
      },
      {
        Header: 'Tên sản phẩm',
        accessor: 'product_name'
      },
      {
        Header: 'Loại',
        accessor: 'type_title'
      },
      {
        Header: 'Nhãn hiệu',
        accessor: 'brand_title'
      },
      {
        Header: 'Ngày khởi tạo',
        accessor: 'createdAt',
        Cell: ({ value }: any) => moment(value).utcOffset(7).format('DD/MM/YYYY - HH:mm:ss')
      }
    ],
    []
  )

  const handleRowClick = (row: any) => {
    const id = row.values.id
    history.push(`/app/products/detail/${id}`)
  }

  if (isLoading)
    return (
      <>
        <Helmet>
          <title>Danh sách sản phẩm</title>
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
              <Card.Title as='h5'>Danh sách sản phẩm</Card.Title>
              <Button className='m-0' onClick={() => history.push('/app/products/create')}>
                <i className='feather icon-plus-circle mr-2'></i>
                Thêm sản phẩm
              </Button>{' '}
            </Card.Header>
            <Card.Body>
              <CustomTable columns={columns} data={listProducts} handleRowClick={handleRowClick} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default ProductsList
