/* eslint-disable no-prototype-builtins */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect, useState } from 'react'
import { Row, Col, Card, Form, Button, FormLabel, Badge, FormGroup, FormControl } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { Link, useHistory, useParams } from 'react-router-dom'
import { ButtonLoading } from '~/components/Button/LoadingButton'
import { Helmet } from 'react-helmet'
import moment from 'moment'
import { Formik } from 'formik'
import CustomModal from '~/components/Modal'
import ProvinceDistrictSelect from '~/components/Select/ProvinceDistrict'
import Select from 'react-select'
import Error from '~/views/Errors'
import { handleAlertConfirm } from '~/hooks/useAlertConfirm'
import BackPreviousPage from '~/components/Button/BackPreviousPage'
import PageLoader from '~/components/Loader/PageLoader'
import Positions from './Positions'
import ToggleSwitch from '~/components/Toggle/Switch'
import StaffService from '~/services/staff.service'
import { axiosConfig } from '~/utils/configAxios'

const UserDetail = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [showLoader, setShowLoader] = useState(false)
  const [isFetched, setIsFetched] = useState(false)
  const history = useHistory()
  const { id }: any = useParams()
  const [userData, setUserData]: any = useState({})
  const [address, setAddress] = useState([])
  const [allowShippingPrice, setAllowShippingPrice] = useState(false)
  const [allowSalePrice, setAllowSalePrice] = useState(false)
  const [dataGender, setDataGender] = useState(true)
  const [positions, setPositions] = useState([])

  const [showModalUpdateProfile, setShowModalUpdateProfile] = useState(false)

  const optionsGender = [
    { label: 'Nam', value: true },
    { label: 'Nữ', value: false }
  ]

  const handleUpdateProfile = (e: any) => {
    e.preventDefault()
    setShowModalUpdateProfile(true)
  }
  const handleCloseModal = () => {
    setShowModalUpdateProfile(false)
  }

  useEffect(() => {
    StaffService.getDetailStaff(id)
      .then((response) => {
        const resultUserData = response.data.data

        setUserData(resultUserData)
        setPositions(
          resultUserData.staff_role.map((position: any) => {
            return {
              role: { label: position.role_title, value: position.role_id },
              branches: position.agency_inCharges.map((branch: any) => ({
                label: branch.agency_branch_name,
                value: branch.agency_branch_id
              }))
            }
          })
        )

        if (resultUserData.staff_gender === 'female') {
          setDataGender(false)
        }

        setAllowSalePrice(resultUserData.isAllowViewImportNWholesalePrice)
        setAllowShippingPrice(resultUserData.isAllowViewShippingPrice)
        setAddress(
          resultUserData.staff_address.map((address: any) => {
            return `${address.user_specific_address}, ${address.user_district}, ${address.user_province}`
          })
        )

        setIsLoading(false)
        setIsFetched(true)
      })
      .catch(() => {
        setIsLoading(false)
      })
  }, [id])

  const handleSaveSubmit = () => {
    setShowLoader(true)
    const position = positions.map((role: any) => ({
      role_id: role.role.value,
      agencyBranches_inCharge_id_list: role.branches.map((branch: any) => branch.value)
    }))
    const newPosition = {
      roles: position
    }
    if (position[0].agencyBranches_inCharge_id_list.length === 0) {
      setShowLoader(false)
      Swal.fire('', 'Vui lòng chọn chi nhánh cho nhân viên trước khi lưu', 'warning')
    } else {
      try {
        axiosConfig
          .patch(`/staff/update-role-by-id/${id}`, newPosition)
          .then(() => {
            setTimeout(() => {
              setShowLoader(false)
              handleAlertConfirm({
                text: 'Cập nhật vai trò nhân viên thành công',
                icon: 'success'
              })
            }, 1000)
          })
          .catch(() => {
            setShowLoader(false)
            handleAlertConfirm({
              text: 'Cập nhật vai trò nhân viên thất bại',
              icon: 'error',
              showCancelButton: false,
              handleConfirmed: () => {
                return
              }
            })
          })
      } catch (error) {
        setShowLoader(false)
        Swal.fire('', 'Đã xảy ra lỗi khi kết nối tới máy chủ', 'error')
      }
    }
  }

  const handleModalUpdateSubmit = (values: any) => {
    setShowLoader(true)
    const keyMapping: any = {
      staff_name: 'user_name',
      staff_phone: 'user_phone',
      staff_email: 'user_email',
      dob: 'staff_birthday',
      gender: 'staff_gender'
    }

    const address_list = [
      {
        user_province: values.province,
        user_district: values.district,
        user_specific_address: values.address
      }
    ]

    const updatedFields: any = {}
    for (const key in values) {
      if (values.hasOwnProperty(key) && values[key] !== userData[key]) {
        updatedFields[key] = values[key]
      }
    }

    const updatedFieldsWithApiKeys: any = {}
    for (const key in updatedFields) {
      if (updatedFields.hasOwnProperty(key)) {
        const newKey = keyMapping[key] || key
        updatedFieldsWithApiKeys[newKey] = updatedFields[key]
      }
    }
    delete updatedFieldsWithApiKeys.address
    delete updatedFieldsWithApiKeys.province
    delete updatedFieldsWithApiKeys.district

    try {
      axiosConfig
        .patch(`/staff/update-personal-by-id/${id}`, { ...updatedFieldsWithApiKeys, staff_address_list: address_list })
        .then(() => {
          setTimeout(() => {
            setShowLoader(false)
            handleAlertConfirm({ text: 'Cập nhật thông tin nhân viên thành công', icon: 'success' })
          }, 1000)
        })
        .catch((errors) => {
          const errorResponses = errors.response.data.message
          const errorMessages = errorResponses.map((error: any) => {
            if (error.includes('name')) {
              return `Tên NV: <b>${values.staff_email}</b> đã tồn tại`
            } else if (error.includes('phone')) {
              return `Số điện thoại NV: <b>${values.staff_phone}</b> đã tồn tại`
            } else if (error.includes('email')) {
              return `Email NV: <b>${values.staff_email}</b> đã tồn tại`
            } else return `Mã NV: <b>${values.staff_code}</b> đã tồn tại`
          })
          setTimeout(() => {
            setShowLoader(false)
            Swal.fire({
              title: 'Lỗi',
              text: 'Cập nhật thông tin nhân viên thất bại',
              html: errorMessages.join('<br>'),
              icon: 'warning',
              confirmButtonText: 'Xác nhận'
            })
          }, 1000)
        })
    } catch (error) {
      setTimeout(() => {
        setShowLoader(false)
        Swal.fire('', 'Đã xảy ra lỗi khi kết nối tới máy chủ', 'error')
      }, 1000)
    }
  }

  const handleDeleteBtn = () => {
    handleAlertConfirm({
      title: 'Xoá nhân viên',
      html: `Bạn có chắc chắn muốn xoá nhân viên <b>${userData.staff_name}</b> ? Thao tác này không thể khôi phục`,
      icon: 'warning',
      confirmText: 'Xoá',
      showCancelButton: true,
      handleConfirmed: () =>
        axiosConfig
          .delete(`/staff/delete-by-id/${id}`)
          .then(() => {
            history.push('/app/configurations/users')
            Swal.fire('', 'Xoá nhân viên thành công', 'success')
          })
          .catch(() => {
            Swal.fire('', 'Xoá nhân viên thất bại', 'error')
          })
    })
  }

  if (isLoading)
    return (
      <>
        <Helmet>
          <title>Chi tiết nhân viên</title>
        </Helmet>
        <PageLoader />
      </>
    )

  if (!isFetched) {
    return <Error errorCode='500' />
  }

  return (
    <>
      <div className='d-flex justify-content-between'>
        <BackPreviousPage path='/app/configurations/users' text='Quay lại danh sách nhân viên' />

        <span>
          <ButtonLoading
            onSubmit={handleSaveSubmit}
            className='mb-0 mb-3 mr-2'
            text={
              <span style={{ fontWeight: 600 }}>
                <i className='feather icon-save mr-2'></i>
                Lưu
              </span>
            }
            loading={showLoader}
            type='submit'
            disabled={showLoader}
            variant='primary'
          ></ButtonLoading>
          <Button className='mb-3' onClick={handleDeleteBtn} variant='outline-danger'>
            <span style={{ fontWeight: 600 }}>
              <i className='feather icon-trash-2 mr-2'></i>
              Xoá nhân viên
            </span>
          </Button>
        </span>
      </div>
      <Row>
        <Col sm={12} lg={12}>
          <Row>
            <Col sm={12} lg={12}>
              <Card>
                <Card.Header className='flex-between'>
                  <Card.Title as='h5'>
                    <span style={{ display: 'inline-block', fontWeight: 600, fontSize: 22 }}>
                      {userData.staff_name}
                    </span>
                    <span>
                      {userData.staff_status === 'Đã nghỉ việc' ? (
                        <Badge
                          style={{ fontSize: 15, marginLeft: 15, padding: 11 }}
                          key='process'
                          pill
                          variant='danger'
                        >
                          Đã nghỉ việc
                        </Badge>
                      ) : (
                        <Badge style={{ fontSize: 15, marginLeft: 15, padding: 11 }} key='stop' pill variant='success'>
                          Đang làm việc
                        </Badge>
                      )}
                    </span>
                  </Card.Title>
                  <small>
                    <Link to='#' onClick={(e) => handleUpdateProfile(e)}>
                      Cập nhật thông tin nhân viên
                    </Link>
                  </small>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col sm={12} lg={12}>
                      <Row>
                        <Col sm={12} lg={6}>
                          <Form.Group className='mb-0' as={Row} controlId='formHorizontalEmail'>
                            <Form.Label column>Số điện thoại</Form.Label>
                            <Col sm={12} lg={6}>
                              <FormLabel className='text-normal' column>
                                : {userData.staff_phone ? userData.staff_phone : '---'}
                              </FormLabel>
                            </Col>
                          </Form.Group>
                          <Form.Group className='mb-0' as={Row} controlId='formHorizontalEmail'>
                            <Form.Label column>Email</Form.Label>
                            <Col sm={10} lg={6}>
                              <FormLabel className='text-normal' column>
                                : {userData.staff_email ? userData.staff_email : '---'}
                              </FormLabel>
                            </Col>
                          </Form.Group>
                          <Form.Group className='mb-0' as={Row} controlId='formHorizontalEmail'>
                            <Form.Label column>Ngày sinh</Form.Label>
                            <Col sm={10} lg={6}>
                              <FormLabel className='text-normal' column>
                                :{' '}
                                {userData.staff_birthday
                                  ? moment(userData.staff_birthday).utcOffset(7).format('DD/MM/YYYY')
                                  : '---'}
                              </FormLabel>
                            </Col>
                          </Form.Group>
                          <Form.Group className='mb-0' as={Row} controlId='formHorizontalEmail'>
                            <Form.Label column>Giới tính</Form.Label>
                            <Col sm={10} lg={6}>
                              <FormLabel className='text-normal' column>
                                : {userData.staff_gender === 'male' ? 'Nam' : 'Nữ'}
                              </FormLabel>
                            </Col>
                          </Form.Group>
                        </Col>
                        <Col lg={12}>
                          <Form.Group className='mb-0' as={Row} controlId='formHorizontalEmail'>
                            <Form.Label column>Địa chỉ</Form.Label>
                            <Col sm={12} lg={9}>
                              <FormLabel className='text-normal' column>
                                : {address === null ? '---' : address}
                              </FormLabel>
                            </Col>
                          </Form.Group>
                          <FormGroup>
                            <FormLabel className='mt-2'>Ghi chú</FormLabel>
                            <FormControl
                              defaultValue={userData.note_about_staff ? userData.note_about_staff : ''}
                              type='text'
                            ></FormControl>
                          </FormGroup>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={12} lg={12}>
              <Card>
                <Card.Header className='flex-between'>
                  <Card.Title as='h5'>Vai trò nhân viên</Card.Title>
                  <Link to='#'>Danh sách vai trò cửa hàng</Link>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col sm={12} lg={12}>
                      <Positions positions={positions} setPositions={setPositions} />
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={12} lg={12}>
              <Card>
                <Card.Header>
                  <Card.Title as='h5'>Phân quyền dữ liệu</Card.Title>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col sm={12} lg={6}>
                      <Form.Group>
                        <ToggleSwitch
                          id='price_import'
                          value={allowSalePrice}
                          setValue={setAllowSalePrice}
                          label='Cho phép nhân viên xem giá vốn, giá nhập'
                        />
                      </Form.Group>
                    </Col>
                    <Col sm={12} lg={6}>
                      <Form.Group>
                        <ToggleSwitch
                          id='price_delievery'
                          value={allowShippingPrice}
                          setValue={setAllowShippingPrice}
                          label='Cho phép nhân viên xem giá chuyển hàng'
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      <Formik
        enableReinitialize
        onSubmit={handleModalUpdateSubmit}
        initialValues={{
          ...userData,
          gender: dataGender,
          dob: moment(userData.staff_birthday).utcOffset(7).format('YYYY-MM-DD'),
          address: userData.staff_address.map((address: any) => address.user_specific_address).join(''),
          province: userData.staff_address.map((address: any) => address.user_province).join(''),
          district: userData.staff_address.map((address: any) => address.user_district).join('')
        }}
        // validationSchema={validationSchemaUserEdit}
      >
        {({ dirty, setFieldValue, handleChange, handleSubmit, values }) => (
          <Form noValidate>
            <CustomModal
              show={showModalUpdateProfile}
              handleClose={handleCloseModal}
              handleSubmit={handleSubmit}
              title='Cập nhật thông tin nhân viên'
              textSubmit={showLoader ? 'Đang lưu...' : 'Lưu'}
              size='lg'
              disabled={!dirty || showLoader}
              body={
                <Form>
                  <Row>
                    <Col className='text-normal' lg={12}>
                      <Row>
                        <Col lg={6}>
                          <Form.Group controlId='formBasicEmail'>
                            <Form.Label>
                              Tên nhân viên <span className='text-c-red'>*</span>
                            </Form.Label>
                            <Form.Control
                              value={values.staff_name}
                              onChange={handleChange}
                              name='staff_name'
                              placeholder='Nhập tên nhân viên'
                              disabled
                            />
                            {/* {touched.staff_name && errors.staff_name && (
                              <small className='text-c-red strong-title'>{errors.staff_name}</small>
                            )} */}
                          </Form.Group>
                        </Col>
                        <Col lg={6}>
                          <Form.Group controlId='formBasicEmail'>
                            <Form.Label>Giới tính</Form.Label>
                            <Select
                              options={optionsGender}
                              defaultValue={optionsGender.find((option) => option.value === dataGender)}
                              onChange={(g: any) => setFieldValue('gender', g.value)}
                            />
                          </Form.Group>
                        </Col>
                        <Col lg={4}>
                          <Form.Group controlId='formBasicEmail'>
                            <Form.Label>
                              Số điện thoại <span className='text-c-red'>*</span>
                            </Form.Label>
                            <Form.Control
                              value={values.staff_phone}
                              onChange={handleChange}
                              name='staff_phone'
                              placeholder='Nhập số điện thoại'
                            />
                          </Form.Group>
                        </Col>
                        <Col lg={4}>
                          <Form.Group controlId='formBasicEmail'>
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                              value={values.staff_email}
                              onChange={handleChange}
                              name='staff_email'
                              placeholder='Nhập địa chỉ email'
                            />
                          </Form.Group>
                        </Col>
                        <Col lg={4}>
                          <Form.Group controlId='formBasicEmail'>
                            <Form.Label>Ngày sinh</Form.Label>
                            <Form.Control
                              type='date'
                              value={values.dob}
                              onChange={(e) => setFieldValue('dob', e.target.value)}
                              name='staff_birthday'
                            />
                          </Form.Group>
                        </Col>
                        <Col lg={12}>
                          <Form.Group controlId='formBasicEmail'>
                            <Form.Label>
                              Địa chỉ <span className='text-c-red'>*</span>
                            </Form.Label>
                            <Form.Control
                              value={values.address}
                              onChange={handleChange}
                              name='address'
                              placeholder='Nhập địa chỉ cụ thể'
                            />
                          </Form.Group>
                        </Col>
                        <Col lg={12}>
                          <Form.Group>
                            <ProvinceDistrictSelect
                              initialValues={{ province: values.province, district: values.district }}
                              onChange={(p: any, d: any) => {
                                setFieldValue('province', p)
                                setFieldValue('district', d)
                              }}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Form>
              }
            />
          </Form>
        )}
      </Formik>
    </>
  )
}

export default UserDetail
