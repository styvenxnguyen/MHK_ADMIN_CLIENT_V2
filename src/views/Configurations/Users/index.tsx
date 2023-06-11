import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Button } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import moment from 'moment'
import CustomTable from '~/components/Table/CustomTable'
import Errors from '~/views/Errors'
import PageLoader from '~/components/Loader/PageLoader'
import StaffService from '~/services/staff.service'

const UsersList = () => {
  const [listEmployees, setListEmployees] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFetched, setIsFetched] = useState(false)
  const [isNoPermission, setIsNoPermission] = useState(false)
  const history = useHistory()

  const handleRowClick = (row: any) => {
    const id = row.values.id
    history.push(`/app/configurations/users/detail/${id}`)
  }

  useEffect(() => {
    StaffService.getListStaff()
      .then((response) => {
        setListEmployees(response.data.data)
        setIsLoading(false)
        setIsFetched(true)
      })
      .catch((error) => {
        setIsLoading(false)
        if (error.response === 'You do not have permission!') {
          setIsNoPermission(error)
        }
      })
  }, [])

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id'
      },
      {
        Header: 'Tên nhân viên',
        accessor: 'staff_name'
      },
      {
        Header: 'Số điện thoại',
        accessor: 'staff_phone'
      },
      {
        Header: 'Trạng thái',
        accessor: 'staff_status',
        Cell: ({ value }: any) => (
          <span style={{ color: value === 'Đã nghỉ việc' ? 'red' : 'rgb(13, 180, 115)' }}>
            {value === 'Đã nghỉ việc' ? 'Đã nghỉ việc' : 'Đang làm việc'}
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

  if (isLoading)
    return (
      <>
        <Helmet>
          <title>Danh sách nhân viên</title>
        </Helmet>
        <PageLoader />
      </>
    )

  if (!isFetched) {
    return <Errors errorCode='500' />
  }

  if (isNoPermission) {
    return <Errors errorCode='NoPermission' />
  }
  return (
    <React.Fragment>
      <Row>
        <Col>
          <Card>
            <Card.Header className='flex-between'>
              <Card.Title as='h5'>Danh sách nhân viên</Card.Title>
              <span>
                <Button
                  variant='outline-primary'
                  className='mr-3 m-0'
                  onClick={() => history.push('/app/configurations/users/roles')}
                >
                  <i className='feather icon-git-commit mr-2'></i>
                  Phân quyền vai trò
                </Button>
                <Button className='m-0' onClick={() => history.push('/app/configurations/users/create')}>
                  <i className='feather icon-plus-circle mr-2'></i>
                  Thêm nhân viên
                </Button>
              </span>
            </Card.Header>
            <Card.Body>
              <CustomTable
                columns={columns}
                data={listEmployees}
                handleRowClick={handleRowClick}
                selectedTitle='nhân viên'
                object='staff'
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default UsersList
