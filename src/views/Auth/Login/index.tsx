import React from 'react'
import { Helmet } from 'react-helmet'
import { NavLink } from 'react-router-dom'
import JWTLogin from './JWTLogin'
import logo from '~/assets/images/auth/logo-full.png'

const Login = () => {
  return (
    <React.Fragment>
      <Helmet>
        <title>Đăng nhập</title>
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
                <i className='feather icon-unlock auth-icon' />
              </div>
              <JWTLogin />
              <p className='mb-2 text-muted'>
                Quên mật khẩu? <NavLink to='/reset-password'>Đặt lại</NavLink>
              </p>
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

export default Login
