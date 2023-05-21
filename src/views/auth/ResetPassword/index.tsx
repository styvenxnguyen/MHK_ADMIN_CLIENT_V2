import React from 'react'
import { NavLink } from 'react-router-dom'
import logo from '~/assets/images/auth/logo-full.png'
import { Formik } from 'formik'
import { validationSchemaResetPassword } from '~/hooks/useValidation'
import Swal from 'sweetalert2'

const handleSubmit = (values: any) => {
  Swal.fire({
    title: 'Thành công',
    showCancelButton: false,
    confirmButtonText: 'Xác nhận',
    icon: 'success',
    html: `Chúng tôi đã gửi cho bạn một liên kết đặt lại mật khẩu cho địa chỉ email <b>${values.email}</b>, vui lòng kiểm tra hộp thư đến của bạn`
  })
}

const ResetPassword = () => {
  return (
    <React.Fragment>
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
                <i className='feather icon-mail auth-icon' />
              </div>
              <Formik
                initialValues={{ email: '' }}
                validateSchema={validationSchemaResetPassword}
                onSubmit={handleSubmit}
              >
                {({ errors, values, handleChange, handleSubmit }) => (
                  <form noValidate onSubmit={handleSubmit}>
                    <h3 className='mb-4'>Đặt lại mật khẩu</h3>
                    <div className='input-group mb-3'>
                      <input
                        className={errors.email ? 'form-control error-input' : 'form-control'}
                        id='email'
                        name='email'
                        onChange={handleChange}
                        type='email'
                        value={values.email}
                      />
                    </div>
                    <button type='submit' className='btn btn-primary mb-4'>
                      Xác nhận
                    </button>
                  </form>
                )}
              </Formik>
              <p className='mb-0 text-muted'>
                Chưa có tài khoản? <NavLink to='/register'>Đăng ký ngay</NavLink>
              </p>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default ResetPassword
