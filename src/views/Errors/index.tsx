import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { Col, Container, Row } from 'react-bootstrap'
import backgroundNoPermission from './svg/NoPermission.svg'
import background404 from './svg/404.svg'
import background500 from './svg/500.svg'
import { Helmet } from 'react-helmet'

const Error = ({ errorCode }: any) => {
  const [dataError, setDataError] = useState({
    title: '',
    text: '',
    image: '',
    width: ''
  })

  useEffect(() => {
    if (errorCode === '500') {
      setDataError({
        title: 'LỖI YÊU CẦU MÁY CHỦ',
        text: 'Đã xảy ra lỗi khi kết nối tới máy chủ, vui lòng liên hệ với quản trị viên Website để biết thêm thông tin',
        image: background500,
        width: '75%'
      })
    } else if (errorCode === '404') {
      setDataError({
        title: 'KHÔNG TÌM THẤY TRANG',
        text: 'Trang bạn đang truy cập không tồn tại hoặc đã được chuyển sang trang mới vĩnh viễn',
        image: background404,
        width: '75%'
      })
    } else if (errorCode === 'NoPermission') {
      setDataError({
        title: 'TRUY CẬP BỊ HẠN CHẾ',
        text: 'Bạn không có quyền truy cập trang này, vui lòng liên hệ quản trị viên Website để biết thêm thông tin',
        image: backgroundNoPermission,
        width: '65%'
      })
    }
  }, [errorCode])

  return (
    <React.Fragment>
      <Helmet>
        <title>Trang không tồn tại</title>
      </Helmet>

      <div className='error-wrapper'>
        <Container>
          <Row className='justify-content-center'>
            <Col md={8} className='text-center'>
              <div>
                <img style={{ width: dataError.width }} src={dataError.image} alt='Not Found Error' />
              </div>
              <div className='text-center'>
                <h1 className='mt-5 mb-4'>{dataError.title}</h1>
                <h5 className='text-muted mb-4'>{dataError.text}</h5>
                <NavLink to='/app/dashboard/sell' className='btn btn-primary text-white mb-4'>
                  <i className='feather icon-home' />
                  <span>Trở về trang chủ</span>
                </NavLink>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default Error
