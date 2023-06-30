import moment from 'moment'
import React, { useState, useEffect } from 'react'
import { Button, Card, Col, Row } from 'react-bootstrap'
import { Helmet } from 'react-helmet'
import PageLoader from '~/components/Loader/PageLoader'
import CustomTable from '~/components/Table/CustomTable'
import Error from '~/views/Errors'
import CreateModal from './CreateModal'
import EditModal from './EditModal'
import AgencyBranchService from '~/services/agencybranch.service'

const Branches = () => {
  const [showModalCreate, setShowModalCreate] = useState(false)
  const [showModalEdit, setShowModalEdit] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isFetched, setIsFetched] = useState(false)
  const [branchesList, setBranchesList] = useState([])
  const [idBranch, setIdBranch] = useState('')
  const [branchData, setBranchData] = useState({
    code: '',
    name: '',
    phone: '',
    address: '',
    isDefaultBranch: false
  })

  const handleRowClick = (row: any) => {
    setIdBranch(row.values.id)
    setBranchData({
      name: row.values.agency_branch_name,
      phone: row.values.agency_branch_phone,
      address: row.values.agency_branch_address,
      code: row.values.agency_branch_code,
      isDefaultBranch: row.values.isDefaultCN
    })
    setShowModalEdit(true)
  }

  useEffect(() => {
    AgencyBranchService.getListAgencyBranch()
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
      },
      {
        Header: 'Chức năng',
        accessor: 'advance',
        Cell: ({ row }: any) => (
          <Button size='sm' onClick={() => handleRowClick(row)}>
            <i className='feather icon-edit' />
            Sửa
          </Button>
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
      <CreateModal show={showModalCreate} close={() => setShowModalCreate(false)} />
      <EditModal show={showModalEdit} close={() => setShowModalEdit(false)} data={branchData} idBranch={idBranch} />
      <Row>
        <Col>
          <Card>
            <Card.Header className='flex-between'>
              <Card.Title as='h5'>Danh sách chi nhánh</Card.Title>
              <Button className='m-0' onClick={() => setShowModalCreate(true)}>
                <i className='feather icon-plus-circle mr-2'></i>
                Thêm chi nhánh
              </Button>
            </Card.Header>
            <Card.Body>
              <CustomTable columns={columns} data={branchesList} handleRowClick={handleRowClick}></CustomTable>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default Branches
