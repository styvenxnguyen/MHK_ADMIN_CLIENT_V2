import { Row, Col, Alert, Button } from 'react-bootstrap'
import * as Yup from 'yup'
import { Formik } from 'formik'
import useAuth from '../../../hooks/useAuth'
import useScriptRef from '../../../hooks/useScriptRef'

const JWTLogin = ({ className, ...rest }: any) => {
  const { login } = useAuth()
  const scriptedRef = useScriptRef()

  const handleSubmit = (values: any, { setErrors, setStatus, setSubmitting }: any) => {
    setTimeout(async () => {
      try {
        await login(values.phone, values.password)

        if (scriptedRef.current) {
          setStatus({ success: true })
          setSubmitting(false)
        }
      } catch (error: any) {
        if (scriptedRef.current) {
          setStatus({ success: false })
          const errorCode = error.response.status
          if (errorCode === 500) {
            setErrors({ submit: `Lỗi kết nối tới máy chủ (Mã lỗi: ${errorCode})` })
            setSubmitting(false)
          } else if (errorCode === 404) {
            setErrors({ submit: 'Số điện thoại chưa được đăng ký' })
            setSubmitting(false)
          } else {
            setErrors({ submit: 'Mật khẩu bạn vừa nhập không chính xác' })
            setSubmitting(false)
          }
        }
      }
    }, 1000)
  }

  return (
    <Formik
      initialValues={{
        phone: '0123456789',
        password: 'mhkadmin@123',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        phone: Yup.string().required('Số điện thoại không được bỏ trống'),
        password: Yup.string().max(255).required('Mật khẩu không được bỏ trống')
      })}
      onSubmit={handleSubmit}
    >
      {({ errors, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit} className={className} {...rest}>
          {errors.submit && (
            <Col sm={12}>
              <Alert className='text-c-red'>{errors.submit}</Alert>
            </Col>
          )}
          <div className='form-group mb-3'>
            <input
              className={errors.phone ? 'form-control error-input' : 'form-control'}
              placeholder='Số điện thoại'
              name='phone'
              onChange={handleChange}
              value={values.phone}
              autoComplete='username'
            />
            {touched.phone && errors.phone && <small className='text-danger form-text'>{errors.phone}</small>}
          </div>
          <div className='form-group mb-4'>
            <input
              className={errors.password ? 'form-control error-input' : 'form-control'}
              name='password'
              placeholder='Mật khẩu'
              onChange={handleChange}
              type='password'
              value={values.password}
              autoComplete='current-password'
            />
            {touched.password && errors.password && <small className='text-danger form-text'>{errors.password}</small>}
          </div>

          <div className='custom-control custom-checkbox text-left mb-4 mt-2'>
            <input type='checkbox' className='custom-control-input' id='customCheck1' />
            <label className='custom-control-label' htmlFor='customCheck1'>
              Nhớ mật khẩu
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
                {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>
            </Col>
          </Row>
        </form>
      )}
    </Formik>
  )
}

export default JWTLogin
