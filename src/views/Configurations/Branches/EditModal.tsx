/* eslint-disable no-prototype-builtins */
import { Formik } from 'formik'
import { useState, useEffect } from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import Swal from 'sweetalert2'
import CustomModal from '~/components/Modal'
import { handleAlertConfirm } from '~/hooks/useAlertConfirm'
import { validationSchemaBranch } from '~/hooks/useValidation'
import AgencyBranchService from '~/services/agencybranch.service'

interface Props {
  show: boolean
  close: any
  idBranch: string
  data: any
}

const EditModal = ({ show, close, idBranch, data }: Props) => {
  const [showLoader, setShowLoader] = useState(false)

  const keyMapping: any = {
    name: 'agency_branch_name',
    code: 'agency_branch_code',
    phone: 'agency_branch_phone',
    address: 'agency_branch_address',
    isDefaultBranch: 'isDefaultCN'
  }

  const [branchData, setBranchData]: any = useState({
    code: '',
    name: '',
    phone: '',
    address: '',
    isDefaultBranch: false
  })

  useEffect(() => {
    setBranchData(data)
  }, [data])

  const handleSubmit = (values: any) => {
    setShowLoader(true)

    const updatedFields: any = {}
    for (const key in values) {
      if (values.hasOwnProperty(key) && values[key] !== branchData[key]) {
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

    console.log(updatedFieldsWithApiKeys)

    try {
      AgencyBranchService.updateAgencyBranch(idBranch, updatedFieldsWithApiKeys)
        .then(() => {
          setTimeout(() => {
            handleAlertConfirm({
              text: 'Cập nhật thông tin chi nhánh thành công',
              icon: 'success'
            })
          }, 1000)
        })
        .catch(() => {
          setTimeout(() => {
            setShowLoader(false)
            Swal.fire('', 'Mã chi nhánh đã tồn tại', 'error')
          }, 1000)
        })
    } catch (error) {
      setTimeout(() => {
        setShowLoader(false)
        Swal.fire('Thất bại', 'Không thể kết nối tới máy chủ', 'error')
      }, 1000)
    }
  }

  return (
    <Formik
      enableReinitialize
      initialValues={branchData}
      onSubmit={handleSubmit}
      validationSchema={validationSchemaBranch}
    >
      {({ errors, setFieldValue, dirty, handleChange, handleSubmit, touched, values }: any) => (
        <Form noValidate>
          <CustomModal
            show={show}
            handleClose={close}
            handleSubmit={handleSubmit}
            title='Cập nhật thông tin chi nhánh'
            textSubmit={showLoader ? 'Đang lưu...' : 'Lưu'}
            size='lg'
            disabled={!dirty || showLoader}
            body={
              <Form>
                <Row>
                  <Col className='text-normal' lg={12}>
                    <Row>
                      <Col lg={6}>
                        <Form.Group>
                          <Form.Label>
                            Tên <span className='text-c-red'>*</span>
                          </Form.Label>
                          <Form.Control
                            value={values.name}
                            onChange={handleChange}
                            type='text'
                            name='name'
                            placeholder='Nhập tên chi nhánh'
                          />
                          {touched.name && errors.name && (
                            <small className='text-danger form-text'>{errors.name}</small>
                          )}
                        </Form.Group>
                      </Col>
                      <Col lg={6}>
                        <Form.Group>
                          <Form.Label>
                            Số điện thoại <span className='text-c-red'>*</span>
                          </Form.Label>
                          <Form.Control
                            type='text'
                            value={values.phone}
                            onChange={handleChange}
                            name='phone'
                            placeholder='Nhập số điện thoại'
                          />
                          {touched.phone && errors.phone && (
                            <small className='text-danger form-text'>{errors.phone}</small>
                          )}
                        </Form.Group>
                      </Col>
                      <Col lg={12}>
                        <Form.Group>
                          <Form.Label>
                            Địa chỉ <span className='text-c-red'>*</span>
                          </Form.Label>
                          <Form.Control
                            type='text'
                            value={values.address}
                            onChange={handleChange}
                            name='address'
                            placeholder='Nhập số nhà, tên đường, ...'
                          />
                          {touched.address && errors.address && (
                            <small className='text-danger form-text'>{errors.address}</small>
                          )}
                        </Form.Group>
                      </Col>

                      <Col lg={6}>
                        <Form.Group>
                          <Form.Label>
                            Mã chi nhánh <span className='text-c-red'>*</span>
                          </Form.Label>
                          <Form.Control
                            type='text'
                            value={values.code}
                            onChange={handleChange}
                            name='code'
                            placeholder='Nhập mã chi nhánh'
                          />
                          {touched.code && errors.code && (
                            <small className='text-danger form-text'>{errors.code}</small>
                          )}
                        </Form.Group>
                      </Col>
                      <Col lg={12}>
                        <Form.Group>
                          <Form.Check
                            name='isDefaultBranch'
                            type='checkbox'
                            checked={values.isDefaultBranch}
                            onChange={() => setFieldValue('isDefaultBranch', !values.isDefaultBranch)}
                            label='Chi nhánh mặc định'
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
  )
}

export default EditModal
