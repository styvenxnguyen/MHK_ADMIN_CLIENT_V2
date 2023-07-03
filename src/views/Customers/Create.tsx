/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useCallback, useEffect, useState } from 'react'
import { Row, Col, Card, Form } from 'react-bootstrap'
import { axiosConfig } from '~/utils/configAxios'
import Swal from 'sweetalert2'
import { ButtonLoading } from '~/components/Button/LoadingButton'
import { useHistory } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { Formik } from 'formik'
import ProvinceDistrictSelect from '~/components/Select/ProvinceDistrict'
import Select from 'react-select'
import { validationSchemaCustomerCreate } from '~/hooks/useValidation'
import BackPreviousPage from '~/components/Button/BackPreviousPage'
import { handleAlertConfirm } from '~/hooks/useAlertConfirm'
import PageLoader from '~/components/Loader/PageLoader'
import Error from '../Errors'
import InputTagMui from '~/components/InputTags/InputTagMui'
import { TagService } from '~/services/tag.service'

const CustomerCreate = () => {
  const history = useHistory()
  const [showLoader, setShowLoader] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isFetched, setIsFetched] = useState(false)
  const [optionsStaff, setOptionsStaff] = useState([])
  const [optionsTag, setOptionsTag] = useState([])
  const [newTags, setNewTags] = useState<any>()
  const [tagList, setTagList] = useState<string[]>()

  const noOptionMessage = () => 'Đang tải dữ liệu ...'

  const handleListTags = useCallback((value: string[]) => {
    setTagList(value)
  }, [])

  const handleListNewTags = useCallback((value: any) => {
    setNewTags(value)
  }, [])

  useEffect(() => {
    axiosConfig
      .get('/staff/get-all')
      .then((res) => {
        const result = res.data.data
        const options = result.map((staff: any) => ({
          label: staff.staff_name,
          value: staff.staff_id
        }))
        setOptionsStaff(options)

        axiosConfig
          .get('/tag/get-all')
          .then((res) => {
            const result = res.data.data
            const options = result.map((tag: any) => ({
              label: tag.tag_title,
              value: tag.id
            }))
            setOptionsTag(options)
            setIsFetched(true)
            setIsLoading(false)
          })
          .catch(() => {
            setIsLoading(false)
          })
      })
      .catch(() => {
        setIsLoading(false)
      })
  }, [])

  const handleSubmit = async (values: any) => {
    setShowLoader(true)
    const data = {
      tags: newTags
    }
    const res = await TagService.createTag(data)
    const addressList = [
      {
        user_province: values.province,
        user_district: values.district,
        user_specific_address: values.address
      }
    ]
    if (res.data.message === 'Success' && newTags) {
      const res = await TagService.getListTag()
      const arr: { tag_title: string; id: string }[] = res.data.data
      const newArr = arr.filter((item1) => newTags.some((item2: any) => item2.tag_title === item1.tag_title))
      const arrTag = tagList?.concat(newArr.map((e) => e.id))
      const newCustomer = {
        user_code: values.code,
        user_name: values.name,
        user_email: values.email,
        user_phone: values.phone,
        customer_status: 'Đang giao dịch',
        address_list: addressList,
        staff_id: values.staff.value,
        staff_in_charge_note: values.note,
        tags: arrTag
      }
      try {
        axiosConfig
          .post('/customer/create', newCustomer)
          .then(() => {
            setShowLoader(true)
            setTimeout(() => {
              setShowLoader(false)
              handleAlertConfirm({
                html: `Thêm khách hàng <b>${newCustomer.user_name}</b> thành công`,
                showCancelButton: false,
                confirmText: 'Xác nhận',
                icon: 'success',
                handleConfirmed: () => history.push('/app/customers')
              })
            }, 1000)
          })
          .catch((errors) => {
            const errorResponses = errors.response.data.data
            const errorMessages = errorResponses.map((error: any) => {
              if (error.includes('name')) {
                return `Tên KH: <b>${values.name}</b> đã tồn tại`
              } else if (error.includes('phone')) {
                return `Số điện thoại KH: <b>${values.phone}</b> đã tồn tại`
              } else if (error.includes('email')) {
                return `Email: <b>${values.email}</b> đã tồn tại`
              } else return `Mã KH: <b>${values.code}</b> đã tồn tại`
            })

            if (errorMessages) {
              setTimeout(() => {
                setShowLoader(false)
                Swal.fire({
                  title: 'Thất bại',
                  html: errorMessages.join('<br>'),
                  icon: 'warning',
                  confirmButtonText: 'Xác nhận'
                })
              }, 1000)
            } else {
              console.log('CANNOT GET ERROR RESPONSE')
            }
          })
      } catch (error) {
        setTimeout(() => {
          setShowLoader(false)
          Swal.fire('Thất bại', 'Đã xảy ra lỗi kết nối tới máy chủ', 'error')
        }, 1000)
      }
    }
  }

  if (isLoading)
    return (
      <React.Fragment>
        <Helmet>
          <title>Thêm khách hàng mới</title>
        </Helmet>
        <PageLoader />
      </React.Fragment>
    )

  if (!isFetched) {
    return <Error errorCode='500' />
  }

  return (
    <React.Fragment>
      <Helmet>
        <title>Thêm mới khách hàng</title>
      </Helmet>

      <Formik
        initialValues={{
          name: '',
          phone: '',
          email: '',
          code: '',
          address: '',
          province: '',
          district: '',
          note: '',
          staff: ''
        }}
        validationSchema={validationSchemaCustomerCreate}
        onSubmit={handleSubmit}
      >
        {({ errors, setFieldValue, handleChange, handleSubmit, touched, values }) => (
          <Form>
            <span className='flex-between'>
              <BackPreviousPage path='/app/customers/' text='Quay lại danh sách khách hàng' />
              <ButtonLoading
                text={
                  <span>
                    <i className='feather icon-plus-circle mr-2'></i>
                    Lưu khách hàng mới
                  </span>
                }
                onSubmit={handleSubmit}
                loading={showLoader}
                type='submit'
                disabled={showLoader}
                className='m-0 mb-3'
              ></ButtonLoading>
            </span>

            {/* Render Form Create */}
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
                            <Form.Group controlId='nameCustomer'>
                              <Form.Label>
                                Tên khách hàng <span className='text-c-red'>*</span>
                              </Form.Label>
                              <Form.Control
                                name='name'
                                value={values.name}
                                onChange={handleChange}
                                placeholder='Nhập tên khách hàng'
                              />
                              {touched.name && errors.name && (
                                <small className='text-danger form-text'>{errors.name}</small>
                              )}
                            </Form.Group>
                            <Form.Group controlId='emailCustomer'>
                              <Form.Label>
                                Địa chỉ Email <span className='text-c-red'>*</span>
                              </Form.Label>
                              <Form.Control
                                name='email'
                                value={values.email}
                                onChange={handleChange}
                                type='email'
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
                                value={values.code}
                                onChange={handleChange}
                                type='text'
                                placeholder='Nhập mã khách hàng'
                              />
                              {touched.code && errors.code && (
                                <small className='text-danger form-text'>{errors.code}</small>
                              )}
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group controlId='phoneCustomer'>
                              <Form.Label>
                                Số điện thoại <span className='text-c-red'>*</span>
                              </Form.Label>
                              <Form.Control
                                value={values.phone}
                                name='phone'
                                onChange={handleChange}
                                placeholder='Nhập số điện thoại'
                              />
                              {touched.phone && errors.phone && (
                                <small className='text-danger form-text'>{errors.phone}</small>
                              )}
                            </Form.Group>
                          </Col>
                          <Col sm={12} lg={12}>
                            <Form.Group>
                              <ProvinceDistrictSelect
                                initialValues={{ province: null, district: null }}
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
                          <Col sm={12} lg={12}>
                            <Form.Group controlId='addressCustomer'>
                              <Form.Label>
                                Địa chỉ <span className='text-c-red'>*</span>
                              </Form.Label>
                              <Form.Control
                                name='address'
                                placeholder='Ghi rõ tầng, số nhà, phường xã, ...'
                                value={values.address}
                                onChange={handleChange}
                                as='textarea'
                                rows={3}
                              />
                              {touched.address && errors.address && (
                                <small className='text-danger form-text'>{errors.address}</small>
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
                              <Select
                                name="gender"
                                onChange={(g) => setFieldValue('gender', g)}
                                options={gender}
                                defaultValue={gender[0]}
                              ></Select>
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
                        <Form.Group controlId='staff'>
                          <Form.Label>Nhân viên phụ trách</Form.Label>
                          <Select
                            name='staff'
                            options={optionsStaff}
                            placeholder='Chọn nhân viên'
                            noOptionsMessage={noOptionMessage}
                            defaultValue={optionsStaff[0]}
                            onChange={(s) => setFieldValue('staff', s)}
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
                        <Form.Group>
                          <Form.Label>Tags</Form.Label>
                          <InputTagMui
                            list={optionsTag}
                            onChange={handleListTags}
                            onChangeNewTags={handleListNewTags}
                            position='top'
                          />
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
    </React.Fragment>
  )
}

export default CustomerCreate
