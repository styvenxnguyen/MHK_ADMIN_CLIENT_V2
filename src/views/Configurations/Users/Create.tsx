/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react'
import { Row, Col, Card, Form, FormControl } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import { ButtonLoading } from '~/components/Button/LoadingButton'
import { Helmet } from 'react-helmet'
import Select from 'react-select'
import { Formik } from 'formik'
import ProvinceDistrictSelect from '~/components/Select/ProvinceDistrict'
import Swal from 'sweetalert2'
import Positions from '~/views/Configurations/Users/Positions'
import { validationSchemaUserCreate } from '~/hooks/useValidation'
import BackPreviousPage from '~/components/Button/BackPreviousPage'
import ToggleSwitch from '~/components/Toggle/Switch'
import { axiosConfig } from '~/utils/configAxios'

const UserCreate = () => {
  const [showLoader, setShowLoader] = useState(false)
  const history = useHistory()
  const [allowShippingPrice, setAllowShippingPrice] = useState(false)
  const [allowSalePrice, setAllowSalePrice] = useState(false)

  const gender = [
    { label: 'Nam', value: true },
    { label: 'Nữ', value: false }
  ]

  const handleSubmit = (values: any) => {
    setShowLoader(true)

    const position = values.positions.map((role: any) => ({
      role_id: role.role.value,
      agencyBranches_inCharge: role.branches.map((branch: any) => branch.value)
    }))

    const addressList = [
      {
        user_province: values.province,
        user_district: values.district,
        user_specific_address: values.address
      }
    ]

    const newStaff = {
      user_name: values.name,
      user_phone: values.phone,
      user_email: values.email,
      user_password: values.password,
      staff_gender: values.gender.value,
      staff_birthday: values.dob,
      isAllowViewImportNWholesalePrice: allowSalePrice,
      isAllowViewShippingPrice: allowShippingPrice,
      roles: position,
      address_list: addressList
    }

    try {
      axiosConfig
        .post('/staff/create', newStaff)
        .then(() => {
          setTimeout(() => {
            setShowLoader(false)
            history.push('/app/configurations/users')
            Swal.fire({
              html: `Thêm nhân viên <b>${values.name}</b> thành công`,
              icon: 'success'
            })
          }, 1000)
        })
        .catch((errors) => {
          const errorResponses = errors.response.data.message
          const errorMessages = errorResponses.map((error: any) => {
            if (error.includes('name')) {
              return `Tên NV: <b>${values.name}</b> đã tồn tại`
            } else if (error.includes('phone')) {
              return `Số điện thoại NV: <b>${values.phone}</b> đã tồn tại`
            } else if (error.includes('email')) {
              return `Email NV: <b>${values.email}</b> đã tồn tại`
            } else return `Mã NV: <b>${values.code}</b> đã tồn tại`
          })
          setTimeout(() => {
            setShowLoader(false)
            Swal.fire({
              title: 'Thất bại',
              html: errorMessages.join('<br>'),
              icon: 'warning',
              confirmButtonText: 'Xác nhận'
            })
          }, 1000)
        })
    } catch (error) {
      setShowLoader(true)
      setTimeout(() => {
        setShowLoader(false)
        Swal.fire({
          title: 'Thất bại',
          text: 'Đã xảy ra lỗi khi kết nối tới máy chủ',
          icon: 'error',
          confirmButtonText: 'Xác nhận'
        })
      }, 1000)
    }
  }

  const initialData = {
    name: '',
    phone: '',
    email: '',
    dob: '',
    address: '',
    gender: { label: 'Nam', value: true },
    province: '',
    district: '',
    status: '',
    note: '',
    password: '',
    positions: [{ role: '', branches: [] }]
  }

  return (
    <React.Fragment>
      <Helmet>
        <title>Thêm mới nhân viên</title>
      </Helmet>

      <Formik initialValues={initialData} validationSchema={validationSchemaUserCreate} onSubmit={handleSubmit}>
        {({ errors, setFieldValue, handleChange, handleSubmit, touched, values }: any) => (
          <Form noValidate onSubmit={handleSubmit}>
            <div className='d-flex justify-content-between'>
              <BackPreviousPage path='/app/configurations/users' text='Quay lại danh sách nhân viên' />
              <span>
                <ButtonLoading
                  className='m-0 mb-3'
                  text={
                    <span style={{ fontWeight: 600 }}>
                      <i className='feather icon-save mr-2'></i>
                      Thêm
                    </span>
                  }
                  loading={showLoader}
                  type='submit'
                  onSubmit={handleSubmit}
                  disabled={showLoader}
                />
              </span>
            </div>
            <Row>
              <Col sm={12} lg={12}>
                <Row>
                  <Col sm={12} lg={12}>
                    <Card>
                      <Card.Header>
                        <Card.Title as='h5'>Thông tin nhân viên</Card.Title>
                      </Card.Header>
                      <Card.Body>
                        <Row>
                          <Col sm={12} lg={12}>
                            <Row>
                              <Col sm={12} lg={4}>
                                <Form.Group>
                                  <Form.Label>
                                    Họ và tên nhân viên <span className='text-c-red'>*</span>
                                  </Form.Label>
                                  <FormControl
                                    name='name'
                                    value={values.name}
                                    onChange={handleChange}
                                    type='text'
                                    placeholder='Nhập tên đầy đủ nhân viên'
                                  ></FormControl>
                                  {touched.name && errors.name && (
                                    <small className='text-danger form-text'>{errors.name}</small>
                                  )}
                                </Form.Group>
                              </Col>
                              <Col sm={12} lg={4}>
                                <Form.Group>
                                  <Form.Label>
                                    Số điện thoại đăng nhập cửa hàng <span className='text-c-red'>*</span>
                                  </Form.Label>
                                  <FormControl
                                    name='phone'
                                    value={values.phone}
                                    onChange={handleChange}
                                    type='text'
                                    placeholder='Nhập số điện thoại'
                                  ></FormControl>
                                  {touched.phone && errors.phone && (
                                    <small className='text-danger form-text'>{errors.phone}</small>
                                  )}
                                </Form.Group>
                              </Col>
                              <Col sm={12} lg={4}>
                                <Form.Group>
                                  <Form.Label>Email</Form.Label>
                                  <FormControl
                                    name='email'
                                    value={values.email}
                                    onChange={handleChange}
                                    type='text'
                                    placeholder='Nhập địa chỉ email'
                                  ></FormControl>
                                </Form.Group>
                              </Col>
                              <Col sm={12} lg={4}>
                                <Form.Group>
                                  <Form.Label>
                                    Địa chỉ <span className='text-c-red'>*</span>
                                  </Form.Label>
                                  <FormControl
                                    name='address'
                                    value={values.address}
                                    onChange={handleChange}
                                    type='text'
                                    placeholder='Nhập địa chỉ'
                                  ></FormControl>
                                  {touched.address && errors.address && (
                                    <small className='text-danger form-text'>{errors.address}</small>
                                  )}
                                </Form.Group>
                              </Col>
                              <Col sm={12} lg={8}>
                                <Form.Group>
                                  <ProvinceDistrictSelect
                                    initialValues={{ province: values.province, district: values.district }}
                                    onChange={(p: any, d: any) => {
                                      setFieldValue('province', p, true)
                                      setFieldValue('district', d, false)
                                    }}
                                  />
                                  {touched.province && errors.province && (
                                    <small className='text-danger form-text'>{errors.province}</small>
                                  )}
                                </Form.Group>
                              </Col>
                              <Col sm={12} lg={4}>
                                <Form.Group>
                                  <Form.Label>
                                    Ngày sinh <span className='text-c-red'>*</span>
                                  </Form.Label>
                                  <FormControl
                                    name='dob'
                                    value={values.dob}
                                    onChange={handleChange}
                                    type='date'
                                  ></FormControl>
                                  {touched.dob && errors.dob && (
                                    <small className='text-danger form-text'>{errors.dob}</small>
                                  )}
                                </Form.Group>
                              </Col>

                              <Col sm={12} lg={4}>
                                <Form.Group>
                                  <Form.Label>
                                    Mật khẩu <span className='text-c-red'>*</span>
                                  </Form.Label>
                                  <FormControl
                                    name='password'
                                    value={values.password}
                                    onChange={handleChange}
                                    placeholder='Nhập mật khẩu'
                                    type='password'
                                    autoComplete='current-password'
                                  ></FormControl>
                                  {touched.password && errors.password && (
                                    <small className='text-danger form-text'>{errors.password}</small>
                                  )}
                                </Form.Group>
                              </Col>
                              <Col sm={12} lg={4}>
                                <Form.Group>
                                  <Form.Label>Giới tính</Form.Label>
                                  <Select
                                    name='gender'
                                    onChange={(g) => setFieldValue('gender', g)}
                                    options={gender}
                                    defaultValue={gender[0]}
                                    placeholder='Chọn giới tính'
                                  ></Select>
                                </Form.Group>
                              </Col>
                              <Col sm={12} lg={12}>
                                <Form.Group>
                                  <Form.Label>Ghi chú</Form.Label>
                                  <FormControl
                                    name='note'
                                    value={values.note}
                                    onChange={handleChange}
                                    placeholder='Nhập ghi chú'
                                  ></FormControl>
                                </Form.Group>
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
                        <Link to='/app/configurations/users/roles' target='_blank'>
                          Danh sách vai trò cửa hàng
                        </Link>
                      </Card.Header>
                      <Card.Body>
                        <Row>
                          <Col lg={12} sm={12}>
                            <Positions
                              positions={values.positions}
                              setPositions={(positions: any) => setFieldValue('positions', positions)}
                            />
                            {touched.positions && errors.positions && (
                              <small className='text-danger form-text mb-2'>
                                {errors.positions[0]?.role || errors.positions[0]?.branches}
                              </small>
                            )}
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
                            <ToggleSwitch
                              id='price_import'
                              value={allowSalePrice}
                              setValue={setAllowSalePrice}
                              label='Cho phép nhân viên xem giá vốn, giá nhập'
                            />
                          </Col>
                          <Col sm={12} lg={6}>
                            <ToggleSwitch
                              id='price_delievery'
                              value={allowShippingPrice}
                              setValue={setAllowShippingPrice}
                              label='Cho phép nhân viên xem giá chuyển hàng'
                            />
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </React.Fragment>
  )
}

export default UserCreate
