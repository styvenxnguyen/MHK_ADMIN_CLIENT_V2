import React, { useEffect, useState } from 'react'
import { Row, Col, Button, Form } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import services from '~/services/api'
import CustomModal from '~/components/Modal'
import { Formik } from 'formik'
import Swal from 'sweetalert2'
import ProvinceDistrictSelect from '~/components/Select/ProvinceDistrict'
import * as Yup from 'yup'
import Error from '~/views/Errors'
import CustomTable from '~/components/Table/CustomTable'
import { handleAlertConfirm } from '~/hooks/useAlertConfirm'
import PageLoader from '~/components/Loader/PageLoader'
import { validationSchemaAddresses } from '~/hooks/useValidation'

function Addresses() {
  const [isLoading, setIsLoading] = useState(true)
  const [showLoader, setShowLoader] = useState(false)
  const [isFetched, setIsFetched] = useState(false)
  const [showModalAdd, setShowModalAdd] = useState(false)
  const [showModalUpdate, setShowModalUpdate] = useState(false)
  const [addressList, setAddressList] = useState([])
  const [addressRow, setAddressRow] = useState({
    address: '',
    province: '',
    district: ''
  })

  const { id }: any = useParams()
  const [idAddress, setIdAddress] = useState(0)

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id'
      },
      {
        Header: 'Địa chỉ',
        accessor: 'user_specific_address'
      },
      {
        Header: 'Quận - Huyện',
        accessor: 'user_district'
      },
      {
        Header: 'Tỉnh - Thành phố',
        accessor: 'user_province'
      }
    ],
    []
  )

  useEffect(() => {
    services
      .get(`/customer/get-by-id/${id}`)
      .then((response) => {
        const customerData = response.data.data
        setAddressList(customerData.address_list)
        setIsLoading(false)
        setIsFetched(true)
      })
      .catch(() => {
        setIsLoading(false)
      })
  }, [id])

  const handleAddAddress = () => {
    setShowModalAdd(true)
  }
  const handleUpdateAddress = () => {
    setShowModalUpdate(true)
  }

  const handleCloseModal = () => {
    setShowModalUpdate(false)
    setShowModalAdd(false)
  }

  const handleSubmitAdd = async (values: any) => {
    setShowLoader(true)
    const newAddress = {
      user_specific_address: values.address,
      user_province: values.province,
      user_district: values.district
    }
    try {
      await services
        .post(`/address/add/${id}`, newAddress)
        .then(() => {
          setTimeout(() => {
            handleAlertConfirm({ text: 'Thêm địa chỉ mới thành công', icon: 'success' })
          }, 1000)
        })
        .catch(() => {
          setShowLoader(false)
          Swal.fire('', 'Thêm địa chỉ mới thất bại', 'error')
        })
    } catch (error) {
      setShowLoader(false)
      Swal.fire('Thất bại', 'Đã xảy ra lỗi khi kết nối tới máy chủ', 'error')
    }
  }

  const handleSubmitUpdate = (values: any) => {
    setShowLoader(true)
    try {
      const updateAddress = {
        user_specific_address: values.address,
        user_province: values.province,
        user_district: values.district
      }
      services
        .patch(`/address/update/${idAddress}`, updateAddress)
        .then(() => {
          setTimeout(() => {
            handleAlertConfirm({
              text: 'Cập nhật thông tin địa chỉ thành công',
              icon: 'success'
            })
          }, 1000)
        })
        .catch(() => {
          setShowLoader(false)
          Swal.fire('', 'Cập nhật thông tin địa chỉ thất bại', 'error')
        })
    } catch (error) {
      setShowLoader(false)
      Swal.fire('Thất bại', 'Đã xảy ra lỗi khi kết nối tới máy chủ', 'error')
    }
  }

  const handleRowClick = (row: any) => {
    setIdAddress(row.values.id)
    setAddressRow({
      address: row.values.user_specific_address,
      province: row.values.user_province,
      district: row.values.user_district
    })
    handleUpdateAddress()
  }

  const ButtonAdd = () => {
    return (
      <Button onClick={handleAddAddress} className='m-0 py-2' variant='primary'>
        <i className='feather icon-plus-circle'></i>
        Thêm địa chỉ
      </Button>
    )
  }

  if (isLoading) return <PageLoader option='25vh ' />

  if (!isFetched) {
    return <Error errorCode='500' />
  }

  if (addressList.length === 0) {
    return <div className='text-center'>Khách hàng chưa cập nhật địa chỉ</div>
  }

  return (
    <>
      <Formik
        onSubmit={handleSubmitAdd}
        initialValues={{ address: '', province: '', district: '' }}
        validationSchema={validationSchemaAddresses}
      >
        {({ errors, setFieldValue, handleBlur, handleChange, handleSubmit, touched, values, dirty }) => (
          <Form noValidate>
            <CustomModal
              show={showModalAdd}
              handleClose={handleCloseModal}
              handleSubmit={handleSubmit}
              title='Thêm địa chỉ khách hàng'
              textSubmit={showLoader ? 'Đang thêm...' : 'Thêm'}
              size='lg'
              disabled={!dirty || showLoader}
              body={
                <Form>
                  <Row>
                    <Col className='text-normal' lg={12}>
                      <Row>
                        <Col lg={12}>
                          <Form.Group controlId='address'>
                            <Form.Label>
                              Địa chỉ cụ thể <span className='text-c-red'>*</span>
                            </Form.Label>
                            <Form.Control
                              value={values.address}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              name='address'
                              placeholder='Nhập số nhà, tên đường, ...'
                            />
                            {touched.address && errors.address && (
                              <small className='text-danger form-text'>{errors.address}</small>
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
                      </Row>
                    </Col>
                  </Row>
                </Form>
              }
            />
          </Form>
        )}
      </Formik>

      <Formik
        enableReinitialize={true}
        onSubmit={handleSubmitUpdate}
        initialValues={addressRow}
        validationSchema={validationSchemaAddresses}
      >
        {({ errors, dirty, setFieldValue, handleBlur, handleChange, handleSubmit, touched, values }) => (
          <Form noValidate>
            <CustomModal
              show={showModalUpdate}
              handleClose={handleCloseModal}
              handleSubmit={handleSubmit}
              title='Cập nhật địa chỉ khách hàng'
              textSubmit={showLoader ? 'Đang lưu...' : 'Lưu'}
              size='lg'
              disabled={!dirty || showLoader}
              body={
                <Form>
                  <Row>
                    <Col className='text-normal' lg={12}>
                      <Row>
                        <Col lg={12}>
                          <Form.Group controlId='formBasicEmail'>
                            <Form.Label>
                              Địa chỉ cụ thể <span className='text-c-red'>*</span>
                            </Form.Label>
                            <Form.Control
                              value={values.address}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              name='address'
                              placeholder='Nhập số nhà, tên đường, ...'
                            />
                            {touched.address && errors.address && (
                              <small className='text-danger form-text'>{errors.address}</small>
                            )}
                          </Form.Group>
                        </Col>
                        <Col sm={12} lg={12}>
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

      <CustomTable columns={columns} data={addressList} handleRowClick={handleRowClick} ButtonAdd={ButtonAdd} />
    </>
  )
}

export default Addresses
