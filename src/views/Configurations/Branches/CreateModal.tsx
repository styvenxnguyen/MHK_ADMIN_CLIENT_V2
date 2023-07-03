import { Formik } from 'formik'
import moment from 'moment'
import { useState } from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import Swal from 'sweetalert2'
import CustomModal from '~/components/Modal'
import { handleAlertConfirm } from '~/hooks/useAlertConfirm'
import { validationSchemaBranch } from '~/hooks/useValidation'
import AgencyBranchService from '~/services/agencybranch.service'

interface Props {
  show: boolean
  close: any
}

interface Values {
  code: string
  name: string
  phone: string
  address: string
  isDefaultBranch: boolean
}

const CreateBranchModal = ({ show, close }: Props) => {
  const [showLoader, setShowLoader] = useState(false)

  const branchData = {
    code: '',
    name: '',
    phone: '',
    address: '',
    isDefaultBranch: false
  }

  const handleSubmit = (values: Values) => {
    setShowLoader(true)
    const newBranch = {
      agency_branch_code: values.code,
      agency_branch_name: values.name,
      agency_branch_phone: values.phone,
      agency_branch_address: values.address,
      agency_branch_status: 'active',
      agency_branch_expiration_date: moment().add(3, 'years').utcOffset(7).format('YYYY/MM/DD'),
      isDefaultCN: values.isDefaultBranch
    }
    try {
      AgencyBranchService.createAgencyBranch(newBranch)
        .then(() => {
          setTimeout(() => {
            handleAlertConfirm({
              text: 'Thêm chi nhánh mới thành công',
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
    <Formik initialValues={branchData} onSubmit={handleSubmit} validationSchema={validationSchemaBranch}>
      {({ errors, setFieldValue, dirty, handleChange, handleSubmit, touched, values }) => (
        <Form noValidate>
          <CustomModal
            show={show}
            handleClose={close}
            handleSubmit={handleSubmit}
            title='Thêm chi nhánh'
            textSubmit={showLoader ? 'Đang thêm...' : 'Thêm'}
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

export default CreateBranchModal
