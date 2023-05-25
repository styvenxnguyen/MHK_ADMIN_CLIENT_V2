import moment from 'moment'
import React, { useState, useEffect } from 'react'
import { Button, Card, Col, Row } from 'react-bootstrap'
import { Helmet } from 'react-helmet'
import PageLoader from '~/components/Loader/PageLoader'
import CustomTable from '~/components/Table/CustomTable'
import { getBranchesList } from '~/services/api'
import Error from '~/views/Errors'

const Branches = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isFetched, setIsFetched] = useState(false)
  const [branchesList, setBranchesList] = useState([])

  useEffect(() => {
    getBranchesList()
      .then((response) => {
        setBranchesList(response.data.data)
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
        Header: 'Tên chi nhánh',
        accessor: 'agency_branch_name'
      },
      {
        Header: 'Mã chi nhánh',
        accessor: 'agency_branch_code'
      },
      {
        Header: 'Địa chỉ',
        accessor: 'agency_branch_address'
      },
      {
        Header: 'Số điện thoại',
        accessor: 'agency_branch_phone'
      },
      {
        Header: 'Ngày hết hạn',
        accessor: 'agency_branch_expiration_date',
        Cell: ({ value }: any) => moment(value).utcOffset(7).format('DD/MM/YYYY')
      },
      {
        Header: 'Trạng thái',
        accessor: 'agency_branch_status',
        Cell: ({ value }: any) => (
          <span style={{ color: value === 'inactive' ? 'red' : 'rgb(13, 180, 115)' }}>
            {value === 'inactive' ? 'Không hoạt động' : 'Đang hoạt động'}
          </span>
        )
      },
      {
        Header: 'CN mặc định',
        accessor: 'isDefaultCN',
        Cell: ({ value }: any) => (
          <span>{value ? <i style={{ fontWeight: 600, fontSize: 22 }} className='feather icon-check'></i> : ''}</span>
        )
      }
    ],
    []
  )

  if (isLoading)
    return (
      <>
        <Helmet>
          <title>Danh sách chi nhánh</title>
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
              <Card.Title as='h5'>Danh sách chi nhánh</Card.Title>
              <Button className='m-0'>
                <i className='feather icon-plus-circle mr-2'></i>
                Thêm chi nhánh
              </Button>
            </Card.Header>
            <Card.Body>
              <CustomTable columns={columns} data={branchesList} handleRowClick={{}}></CustomTable>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default Branches
