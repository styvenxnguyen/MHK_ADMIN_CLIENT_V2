/* eslint-disable no-prototype-builtins */
import { useEffect, useState } from 'react'
import { Row, Col, Card, Form } from 'react-bootstrap'
import { services } from '~/services/api'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { ButtonLoading } from '~/components/Button/LoadingButton'
import { useHistory, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { Formik } from 'formik'
import Select from 'react-select'
import Error from '~/views/Errors'
import { validationSchemaCustomerEdit } from '~/hooks/useValidation'
import PageLoader from '~/components/Loader/PageLoader'
import BackPreviousPage from '~/components/Button/BackPreviousPage'

const CustomerEdit = () => {
  const [showLoader, setShowLoader] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isFetched, setIsFetched] = useState(false)
  const [optionsStaff, setOptionsStaff] = useState([])
  const [optionsTag, setOptionsTag] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const [selectedStaff, setSelectedStaff] = useState({
    label: 'Chọn nhân viên',
    value: ''
  })

  const history = useHistory()
  const { id }: any = useParams()

  const [customerData, setCustomerData]: any = useState({
    name: '',
    code: '',
    phone: '',
    email: '',
    note: '',
    staff: {
      label: '',
      value: ''
    },
    tags: []
  })

  const keyMapping: any = {
    name: 'user_name',
    code: 'user_code',
    phone: 'user_phone',
    email: 'user_email',
    note: 'staff_in_charge_note',
    staff: 'staff_id'
  }

  useEffect(() => {
    services
      .get(`/customer/get-by-id/${id}`)
      .then((response) => {
        const data = response.data.data
        setCustomerData({
          name: data.customer_name,
          code: data.user_code,
          email: data.customer_email,
          phone: data.customer_phone,
          note: data.staff_in_charge_note
        })
        if (data.staff_in_charge) {
          setSelectedStaff({
            label: data.staff_in_charge.staff_name,
            value: data.staff_in_charge.staff_id
          })
        }
        setSelectedTags(
          data.tags.map((tag: any) => ({
            label: tag.tag_title,
            value: tag.tag_id
          }))
        )
        setIsLoading(false)
        setIsFetched(true)
      })
      .catch(() => {
        setIsLoading(false)
      })
  }, [id])

  useEffect(() => {
    services
      .get('/staff/get-all')
      .then((res) => {
        const result = res.data.data
        const options = result.map((staff: any) => ({
          label: staff.staff_name,
          value: staff.staff_id
        }))
        setOptionsStaff(options)
      })
      .catch(() => {
        setIsLoading(false)
      })
  }, [])

  useEffect(() => {
    services
      .get('/tag/get-all')
      .then((res) => {
        const result = res.data.data
        const options = result.map((tag: any) => ({
          label: tag.tag_title,
          value: tag.id
        }))
        setOptionsTag(options)
      })
      .catch(() => {
        setIsLoading(false)
      })
  }, [])

  const filterSelectedOptions = (options: any, selectedOptions: any) => {
    return options.filter(
      (option: any) => !selectedOptions.find((selectedOption: any) => selectedOption.value === option.value)
    )
  }

  const filteredOptionsTag = filterSelectedOptions(optionsTag, selectedTags)

  const handleSubmit = async (values: any) => {
    setShowLoader(true)
    //Vòng lặp for sẽ duyệt các giá trị trong values so sánh với các giá trị của Customer
    //Nếu trường nào có giá trị không thay đổi thì không được gửi lên server
    const updatedFields: any = {}
    for (const key in values) {
      if (values.hasOwnProperty(key) && values[key] !== customerData[key]) {
        updatedFields[key] = values[key]
      }
    }

    //Thay đổi những key mặc định trong updateFields thành những tên key được đặt trong server
    //Ví dụ : name -> customer_name ...
    const updatedFieldsWithApiKeys: any = {}
    for (const key in updatedFields) {
      if (updatedFields.hasOwnProperty(key)) {
        const newKey = keyMapping[key] || key
        updatedFieldsWithApiKeys[newKey] = updatedFields[key]
      }
    }

    const updateCustomer = {
      ...updatedFieldsWithApiKeys,
      staff_id: selectedStaff.value,
      tags: selectedTags.map((tag: any) => tag.value)
    }

    try {
      //Cập nhật khách hàng
      await services
        .patch(`/customer/update-personalInfo-by-id/${id}`, updateCustomer)
        .then(() => {
          setTimeout(() => {
            setShowLoader(false)
            history.push(`/app/customers/${id}`)
            sweetSuccessAlert()
          }, 1000)
        })
        .catch((errors) => {
          const errorResponses = errors.response.data.message
          const errorMessages = errorResponses.map((error: any) => {
            if (error.includes('name')) {
              return `Tên KH: <b>${values.name}</b> đã tồn tại`
            } else if (error.includes('phone')) {
              return `Số điện thoại KH: <b>${values.phone}</b> đã tồn tại`
            } else if (error.includes('email')) {
              return `Email: <b>${values.email}</b> đã tồn tại`
            } else return `Mã KH: <b>${values.code}</b> đã tồn tại`
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
      setTimeout(() => {
        setShowLoader(false)
        Swal.fire('', 'Đã xảy ra lỗi khi kết nối tới máy chủ', 'error')
      }, 1000)
    }
  }

  const sweetSuccessAlert = () => {
    const MySwal = withReactContent(Swal)
    MySwal.fire('', `Cập nhật thông tin khách hàng thành công`, 'success')
  }

  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>Cập nhật thông tin khách hàng</title>
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
      <Formik
        enableReinitialize={true}
        initialValues={customerData}
        validationSchema={validationSchemaCustomerEdit}
        onSubmit={handleSubmit}
      >
        {({ dirty, errors, handleBlur, handleChange, handleSubmit, touched, values, setFieldValue }: any) => (
          <Form noValidate onSubmit={handleSubmit}>
            <span className='flex-between'>
              <BackPreviousPage path={`/app/customers/detail/${id}`} text='Quay lại' />
              <ButtonLoading
                text={'Cập nhật'}
                onSubmit={handleSubmit}
                loading={showLoader}
                type='submit'
                className='m-0 mb-3'
                disabled={!dirty || showLoader}
              ></ButtonLoading>
            </span>

            <Row>
              <Col sm={12} lg={8}>
                <Row>
                  <Col sm={12} lg={12}>
                    <Card>
                      <Card.Header>
                        <Card.Title as='h5'>Thông tin chung</Card.Title>
                      </Card.Header>
                      <Card.Body>
                        <Row>
                          <Col md={12}>
                            <Form.Group controlId='formName'>
                              <Form.Label>
                                Tên khách hàng <span className='text-c-red'>*</span>
                              </Form.Label>
                              <Form.Control
                                name='name'
                                onBlur={handleBlur}
                                onChange={handleChange}
                                placeholder='Nhập tên khách hàng'
                                value={values.name}
                              />
                              {touched.name && errors.name && (
                                <small className='text-danger form-text'>{errors.name}</small>
                              )}
                            </Form.Group>
                            <Form.Group controlId='emailCustomer'>
                              <Form.Label>
                                Email <span className='text-c-red'>*</span>
                              </Form.Label>
                              <Form.Control
                                name='email'
                                onBlur={handleBlur}
                                onChange={handleChange}
                                type='email'
                                value={values.email}
                                placeholder='Nhập địa chỉ email'
                              />
                              {touched.email && errors.email && (
                                <small className='text-danger form-text'>{errors.email}</small>
                              )}
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group controlId='idCustomer'>
                              <Form.Label>
                                Mã khách hàng <span className='text-c-red'>*</span>
                              </Form.Label>
                              <Form.Control
                                name='code'
                                onBlur={handleBlur}
                                value={values.code}
                                onChange={handleChange}
                                type='text'
                                placeholder='Nhập mã khách hàng'
                              />
                              {touched.code && errors.code && (
                                <small className='text-danger form-text'>{errors.code}</small>
                              )}
                            </Form.Group>
                            <Row></Row>{' '}
                          </Col>
                          <Col md={6}>
                            <Form.Group controlId='phoneCustomer'>
                              <Form.Label>
                                Số điện thoại <span className='text-c-red'>*</span>
                              </Form.Label>
                              <Form.Control
                                onBlur={handleBlur}
                                value={values.phone}
                                name='phone'
                                onChange={handleChange}
                                type='text'
                                placeholder='Nhập số điện thoại'
                              />
                              {touched.phone && errors.phone && (
                                <small className='text-danger form-text'>{errors.phone}</small>
                              )}
                            </Form.Group>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Col>

                  {/* <Col sm={12} lg={12}>
                    <Card>
                      <Card.Header>
                        <Card.Title as="h5">Thông tin bổ sung</Card.Title>
                      </Card.Header>
                      <Card.Body>
                        <Row>
                          <Col md={6}>
                            <Form.Group controlId="dobCustomer">
                              <Form.Label>Ngày sinh</Form.Label>
                              <Form.Control type="date" />
                            </Form.Group>
                            <Form.Group controlId="faxCustomer">
                              <Form.Label>Số fax</Form.Label>
                              <Form.Control type="text" placeholder="Nhập số fax" />
                            </Form.Group>
                            <Form.Group controlId="websiteCustomer">
                              <Form.Label>Website</Form.Label>
                              <Form.Control type="text" placeholder="Nhập tên miền Website" />
                            </Form.Group>
                            <Form.Group controlId="websiteCustomer">
                              <Form.Label>Tổng chi tiêu</Form.Label>
                              <Form.Control type="text" placeholder="Nhập tổng chi tiêu" />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group controlId="sexCustomer">
                              <Form.Label>Giới tính</Form.Label>
                              <Form.Control as="select">
                                <option>Khác</option>
                                <option>Nam</option>
                                <option>Nữ</option>
                              </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="taxIdCustomer">
                              <Form.Label>Mã số thuế</Form.Label>
                              <Form.Control type="text" placeholder="Nhập mã số thuế" />
                            </Form.Group>
                            <Form.Group controlId="taxIdCustomer">
                              <Form.Label>Công nợ</Form.Label>
                              <Form.Control type="text" placeholder="Nhập công nợ khách hàng" />
                            </Form.Group>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Col> */}
                </Row>
              </Col>

              <Col sm={12} lg={4}>
                <Row>
                  <Col sm={12} lg={12}>
                    <Card>
                      <Card.Header>
                        <Card.Title as='h5'>Thông tin khác</Card.Title>
                      </Card.Header>
                      <Card.Body>
                        <Form.Group controlId='staffCb'>
                          <Form.Label>Nhân viên phụ trách</Form.Label>
                          <Select
                            name='staff'
                            options={optionsStaff}
                            placeholder='Chọn nhân viên'
                            value={selectedStaff}
                            onChange={(staff: any) => {
                              setSelectedStaff(staff)
                              setFieldValue('staff', staff)
                            }}
                          />
                        </Form.Group>
                        <Form.Group controlId='description'>
                          <Form.Label>Mô tả</Form.Label>
                          <Form.Control
                            value={values.note}
                            onChange={handleChange}
                            name='note'
                            as='textarea'
                            rows={3}
                          />
                        </Form.Group>
                        <Form.Group controlId='tag'>
                          <Form.Label>Tags</Form.Label>
                          <Select
                            name='tags'
                            options={filteredOptionsTag}
                            value={selectedTags}
                            placeholder='Chọn tags'
                            isMulti
                            onChange={(tag: any) => {
                              setFieldValue('tags', tag)
                              setSelectedTags(tag)
                            }}
                          ></Select>
                        </Form.Group>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </>
  )
}

export default CustomerEdit
