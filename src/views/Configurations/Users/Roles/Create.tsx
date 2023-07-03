import { Formik } from 'formik'
import { useState } from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import Swal from 'sweetalert2'
import CustomModal from '~/components/Modal'
import { handleAlertConfirm } from '~/hooks/useAlertConfirm'
import { validationSchemaUserRole } from '~/hooks/useValidation'
import { axiosConfig } from '~/utils/configAxios'
interface Props {
  show: boolean
  close: () => void
}

const RoleCreateModal = ({ show, close }: Props) => {
  const [showLoader, setShowLoader] = useState(false)

  const handleSubmit = (values: any) => {
    setShowLoader(true)
    try {
      axiosConfig
        .post('/role/create', values)
        .then(() => {
          setTimeout(() => {
            handleAlertConfirm({
              text: 'Thêm vai trò mới thành công',
              icon: 'success'
            })
          }, 1000)
        })
        .catch(() => {
          setTimeout(() => {
            handleAlertConfirm({
              title: 'Lỗi',
              text: 'Thêm vai trò mới thất bại',
              icon: 'warning',
              handleConfirmed: () => {
                return
              }
            })
          }, 1000)
        })
    } catch (error) {
      setTimeout(() => {
        setShowLoader(false)
        Swal.fire('Thất bại', 'Đã xảy ra lỗi khi kết nối tới máy chủ', 'error')
      }, 1000)
    }
  }
  return (
    <Formik
      onSubmit={handleSubmit}
      initialValues={{ role_title: '', role_description: '' }}
      validationSchema={validationSchemaUserRole}
    >
      {({ errors, handleChange, handleSubmit, touched, values }) => (
        <Form noValidate>
          <CustomModal
            show={show}
            handleClose={close}
            handleSubmit={handleSubmit}
            title='Thêm vai trò nhân viên'
            textSubmit={showLoader ? 'Đang thêm...' : 'Thêm'}
            size='lg'
            disabled={showLoader}
            body={
              <Form>
                <Row>
                  <Col lg={12}>
                    <Form.Group controlId='role_title'>
                      <Form.Label>
                        Tên vai trò <span className='text-c-red'>*</span>
                      </Form.Label>
                      <Form.Control
                        value={values.role_title}
                        onChange={handleChange}
                        name='role_title'
                        placeholder='Nhập tên vai trò'
                      />
                      {errors.role_title && touched.role_title ? (
                        <small className='text-c-red'>{errors.role_title}</small>
                      ) : null}
                    </Form.Group>
                  </Col>
                  <Col lg={12}>
                    <Form.Group controlId='role_title'>
                      <Form.Label>Mô tả</Form.Label>
                      <Form.Control
                        value={values.role_description}
                        onChange={handleChange}
                        name='role_description'
                        placeholder='Nhập mô tả'
                      />
                    </Form.Group>
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

export default RoleCreateModal
