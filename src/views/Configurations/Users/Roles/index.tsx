import React, { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap'
import services from '~/services/api'
import { useHistory } from 'react-router-dom'
import CustomTable from '../../../../components/Table/CustomTable'
import { Helmet } from 'react-helmet'
import Error from '~/views/Errors'
import PageLoader from '~/components/Loader/PageLoader'
import BackPreviousPage from '~/components/Button/BackPreviousPage'

function RolesList() {
  const history = useHistory()
  const [isLoading, setIsLoading] = useState(true)
  const [isFetched, setIsFetched] = useState(false)
  const [listRoles, setListRoles] = useState([])

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
    services
      .get('/role/get-all')
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
    const id = row.values.id
    history.push(`/app/sell-management/products/${id}`)
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
      <BackPreviousPage path='/app/configurations/users' text='Quay lại danh sách nhân viên' />
      <Card>
        <Card.Header>
          <Card.Title as='h5'>Danh sách vai trò nhân viên</Card.Title>
        </Card.Header>
        <Card.Body>
          <CustomTable columns={columns} data={listRoles} handleRowClick={handleRowClick} />
        </Card.Body>
      </Card>
    </>
  )
}

export default RolesList
