import React from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import { Row, Col, Alert, Button } from 'react-bootstrap'
import { Formik } from 'formik'
import useScriptRef from '../../../hooks/useScriptRef'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import { Helmet } from 'react-helmet'
import logo from '~/assets/images/auth/logo-full.png'
import { validationSchemaRegister } from '~/hooks/useValidation'
import { axiosConfig } from '~/utils/configAxios'

const Register = () => {
  const history = useHistory()
  const scriptedRef = useScriptRef()

  const sweetSuccessAlert = () => {
    const MySwal = withReactContent(Swal)
    MySwal.fire({
      title: 'Đăng ký tài khoản thành công',
      text: 'Chào mừng bạn đến với MHK, nhấn vào nút dưới đây để đăng nhập và trải nghiệm dịch vụ của chúng tôi',
      icon: 'success',
      confirmButtonText: 'Đăng nhập ngay',
      confirmButtonColor: 'success',
      showCancelButton: false
    }).then((willExit) => {
      if (willExit.isConfirmed) {
        return history.push('/login')
      }
    })
  }

  const handleSubmit = (values: any, { setErrors, setStatus, setSubmitting }: any) => {
    setTimeout(async () => {
      try {
        const newUserData = {
          name: values.name,
          phone: values.phone,
          email: values.email,
          password: values.password
        }
        await axiosConfig.post('/auth/register', newUserData)

        if (scriptedRef.current) {
          setStatus({ success: true })
          setSubmitting(false)
          sweetSuccessAlert()
        }
      } catch (err: any) {
        if (scriptedRef.current) {
          setStatus({ success: false })
          setErrors({ submit: err.message })
          setSubmitting(false)
        }
      }
    }, 3000)
  }

  return (
    <React.Fragment>
      <Helmet>
        <title>Đăng ký</title>
      </Helmet>
      <div className='auth-wrapper auth-bg-img-side cotainer-fiuid align-items-stretch'>
        <div className='row align-items-center w-100 align-items-stretch bg-white'>
          <div className='d-none d-lg-flex col-lg-8 auth-bg-img align-items-center d-flex justify-content-center'>
            <div className='col-md-8'>
              <img style={{ width: '67%' }} src={logo} alt='logo'></img>
            </div>
          </div>
          <div className='col-lg-4 align-items-stret h-100 align-items-center d-flex justify-content-center'>
            <div className=' auth-content text-center'>
              <div className='mb-4'>
                <i className='feather icon-user-plus auth-icon' />
              </div>
              <h3 className='mb-4'>Đăng ký tài khoản</h3>

              <Formik
                initialValues={{
                  name: '',
                  phone: '',
                  email: '',
                  password: '',
                  repassword: '',
                  submit: null
                }}
                validationSchema={validationSchemaRegister}
                onSubmit={handleSubmit}
              >
                {({ errors, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                  <form noValidate onSubmit={handleSubmit}>
                    {errors.submit && (
                      <Col sm={12}>
                        <Alert className='text-c-red'>Email hoặc số điện thoại đã tồn tại</Alert>
                      </Col>
                    )}
                    <div className='form-group mb-3'>
                      <label style={{ width: '100%', textAlign: 'left' }} htmlFor='name'>
                        Họ và tên
                      </label>
                      <input
                        className='form-control'
                        id='name'
                        name='name'
                        onChange={handleChange}
                        type='text'
                        value={values.name}
                      />
                      {touched.name && errors.name && <small className='text-danger form-text'>{errors.name}</small>}
                    </div>
                    <div className='form-group mb-3'>
                      <label style={{ width: '100%', textAlign: 'left' }} htmlFor='email'>
                        Địa chỉ email
                      </label>
                      <input
                        className='form-control'
                        id='email'
                        name='email'
                        onChange={handleChange}
                        type='email'
                        value={values.email}
                      />
                      {touched.email && errors.email && <small className='text-danger form-text'>{errors.email}</small>}
                    </div>
                    <div className='form-group mb-3'>
                      <label style={{ width: '100%', textAlign: 'left' }} htmlFor='phone'>
                        Số điện thoại
                      </label>
                      <input
                        className='form-control'
                        id='phone'
                        name='phone'
                        onChange={handleChange}
                        type='text'
                        value={values.phone}
                        autoComplete='username'
                      />
                      {touched.phone && errors.phone && <small className='text-danger form-text'>{errors.phone}</small>}
                    </div>
                    <div className='form-group mb-3'>
                      <label style={{ width: '100%', textAlign: 'left' }} htmlFor='password'>
                        Mật khẩu
                      </label>
                      <input
                        className='form-control'
                        id='password'
                        name='password'
                        onChange={handleChange}
                        type='password'
                        value={values.password}
                        autoComplete='new-password'
                      />
                      {touched.password && errors.password && (
                        <small className='text-danger form-text'>{errors.password}</small>
                      )}
                    </div>
                    <div className='form-group mb-3'>
                      <label style={{ width: '100%', textAlign: 'left' }} htmlFor='repassword'>
                        Nhập lại mật khẩu
                      </label>
                      <input
                        className='form-control'
                        id='repassword'
                        name='repassword'
                        onChange={handleChange}
                        type='password'
                        value={values.repassword}
                        autoComplete='new-password'
                      />
                      {touched.repassword && errors.repassword && (
                        <small className='text-danger form-text'>{errors.repassword}</small>
                      )}
                    </div>

                    <div className='custom-control custom-checkbox text-left mb-4 mt-2'>
                      <input type='checkbox' className='custom-control-input' id='customCheck1' />
                      <label className='custom-control-label' htmlFor='customCheck1'>
                        Nhận thông báo khuyến mãi hàng tuần qua Email
                      </label>
                    </div>

                    <Row>
                      <Col className='mt-2'>
                        <Button
                          className='btn-block mb-4'
                          color='primary'
                          disabled={isSubmitting}
                          type='submit'
                          variant='primary'
                        >
                          {isSubmitting ? 'Đang đăng ký...' : 'Đăng ký'}
                        </Button>
                      </Col>
                    </Row>
                  </form>
                )}
              </Formik>
              <p className='mb-0 text-muted'>
                Đã có tài khoản? <NavLink to='/login'>Đăng nhập</NavLink>
              </p>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default Register
