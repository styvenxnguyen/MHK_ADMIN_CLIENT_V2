import { Formik } from 'formik'
import { useState, useEffect } from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import Swal from 'sweetalert2'
import CustomModal from '~/components/Modal'
import { handleAlertConfirm } from '~/hooks/useAlertConfirm'
import { axiosConfig } from '~/utils/configAxios'

interface Props {
  show: boolean
  close: () => void
  id: string
  data: any
}

const RoleEditModal = ({ show, close, id, data }: Props) => {
  const [showLoader, setShowLoader] = useState(false)
  const [isDelete, setIsDelete] = useState(false)
  const [roleData, setRoleData] = useState({
    role_title: '',
    role_description: ''
  })

  useEffect(() => {
    setRoleData(data)
  }, [data])

  const handleSubmit = (values: any) => {
    setShowLoader(true)
    try {
      axiosConfig
        .patch(`/role/update-by-id/${id}`, values)
        .then(() => {
          setTimeout(() => {
            handleAlertConfirm({
              text: 'Cập nhật vai trò thành công',
              icon: 'success'
            })
          }, 1000)
        })
        .catch(() => {
          setTimeout(() => {
            handleAlertConfirm({
              title: 'Lỗi',
              text: 'Cập nhật vai trò thất bại',
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

  const handleDelete = () => {
    handleAlertConfirm({
      title: 'Xoá vai trò',
      icon: 'warning',
      confirmText: 'Xoá',
      confirmButtonColor: 'red',
      showCancelButton: true,
      html: `Bạn có chắc chắc muốn xoá vai trò <b>${roleData.role_title}</b>? Thao tác này không thể khôi phục`,
      handleConfirmed: () => {
        setIsDelete(true)
        axiosConfig
          .delete(`/role/delete-by-id/${id}`)
          .then(() => {
            setTimeout(() => {
              Swal.fire({
                text: 'Xoá vai trò thành công',
                icon: 'success'
              }).then((isConfirm) => {
                if (isConfirm.isConfirmed) window.location.reload()
              })
            }, 1000)
          })
          .catch(() => {
            setIsDelete(false)
            handleAlertConfirm({
              text: 'Đã xảy ra lỗi khi kết nối tới máy chủ',
              title: 'Xoá vai trò thất bại',
              icon: 'error',
              handleConfirmed: () => {
                return
              }
            })
          })
      }
    })
  }

  return (
    <Formik enableReinitialize onSubmit={handleSubmit} initialValues={roleData}>
      {({ errors, handleChange, handleSubmit, touched, values, dirty }) => (
        <Form noValidate>
          <CustomModal
            show={show}
            handleClose={close}
            handleSubmit={handleSubmit}
            handleDelete={handleDelete}
            title='Cập nhật vai trò nhân viên'
            textSubmit={showLoader ? 'Đang lưu...' : 'Lưu'}
            size='lg'
            deleteBtn
            textDelete={isDelete ? 'Đang xoá...' : 'Xoá'}
            isDelete={isDelete}
            disabled={!dirty || showLoader}
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

export default RoleEditModal
