import React, { useEffect, useState } from 'react'
import { Button, Card } from 'react-bootstrap'
import CustomTable from '../../../../components/Table/CustomTable'
import { Helmet } from 'react-helmet'
import Error from '~/views/Errors'
import PageLoader from '~/components/Loader/PageLoader'
import BackPreviousPage from '~/components/Button/BackPreviousPage'
import RoleCreateModal from './Create'
import RoleEditModal from './Edit'
import StaffService from '~/services/staff.service'

function RolesList() {
  const [isLoading, setIsLoading] = useState(true)
  const [isFetched, setIsFetched] = useState(false)
  const [listRoles, setListRoles] = useState([])
  const [showModalCreate, setShowModalCreate] = useState(false)
  const [showModalEdit, setShowModalEdit] = useState(false)
  const [roleData, setRoleData] = useState({ role_title: '', role_description: '' })
  const [roleId, setRoleId] = useState('')

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id'
      },
      {
        Header: 'Tên vai trò',
        accessor: 'role_title'
      },
      {
        Header: 'Mô tả',
        accessor: 'role_description'
      }
    ],
    []
  )

  useEffect(() => {
    StaffService.getListRole()
      .then((response) => {
        setListRoles(response.data.data)
        setIsLoading(false)
        setIsFetched(true)
      })
      .catch(() => {
        setIsLoading(false)
      })
  }, [])

  const handleRowClick = (row: any) => {
    setRoleId(row.values.id)
    setRoleData({
      role_title: row.values.role_title,
      role_description: row.values.role_description
    })
    setShowModalEdit(true)
  }

  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>Danh sách vai trò</title>
        </Helmet>
        <PageLoader />
      </>
    )
  }

  if (!isFetched) {
    return <Error errorCode='500' />
  }

  return (
    <>
      <RoleCreateModal show={showModalCreate} close={() => setShowModalCreate(false)} />
      <RoleEditModal show={showModalEdit} close={() => setShowModalEdit(false)} data={roleData} id={roleId} />
      <BackPreviousPage path='/app/configurations/users' text='Quay lại danh sách nhân viên' />
      <Card>
        <Card.Header className='flex-between'>
          <Card.Title as='h5'>Danh sách vai trò nhân viên</Card.Title>
          <Button onClick={() => setShowModalCreate(true)} className='m-0'>
            <i className='feather icon-plus-circle'></i>
            Thêm vai trò
          </Button>
        </Card.Header>
        <Card.Body>
          <CustomTable columns={columns} data={listRoles} handleRowClick={handleRowClick} />
        </Card.Body>
      </Card>
    </>
  )
}

export default RolesList
