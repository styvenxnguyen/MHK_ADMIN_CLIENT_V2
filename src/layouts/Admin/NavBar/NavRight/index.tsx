import React, { useContext, useState, useEffect } from 'react'
import { ListGroup, Dropdown, Media } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import withReactContent from 'sweetalert2-react-content'
import useAuth from '../../../../hooks/useAuth'
import ChatList from './ChatList'
import { ConfigContext } from '../../../../contexts/ConfigContext'
import PerfectScrollbar from 'react-perfect-scrollbar'

import avatar1 from '~/assets/images/user/avatar-1.jpg'
import avatar2 from '~/assets/images/user/avatar-2.jpg'
import avatar3 from '~/assets/images/user/avatar-3.jpg'
import avatar4 from '~/assets/images/user/avatar-4.jpg'
import Swal from 'sweetalert2'
import { axiosConfig } from '~/utils/configAxios'

interface UserProps {
  id?: string
  staff_id?: string
  user_code?: string
  user_name?: string
}

const NavRight = () => {
  const [listOpen, setListOpen] = useState(false)
  const configContext: any = useContext(ConfigContext)
  const [dataUser, setDataUser] = useState<UserProps>()
  const { logout } = useAuth()

  const { rtlLayout }: any = configContext.state

  const handleSubmitLogOut = () => {
    const MySwal = withReactContent(Swal)
    MySwal.fire({
      titleText: 'Bạn có chắc chắn muốn đăng xuất ?',
      icon: 'warning',
      confirmButtonText: 'Đăng xuất',
      confirmButtonColor: 'red',
      cancelButtonText: 'Quay lại',
      showCancelButton: true,
      focusCancel: false,
      focusConfirm: false
    }).then((willExit) => {
      if (willExit.isConfirmed) {
        handleLogout()
      } else {
        return
      }
    })
  }

  const handleLogout = () => {
    logout()
  }

  const handleNothing = () => {
    return
  }

  const listMenuUser = [
    {
      title: 'Cài đặt',
      link: '#',
      icon: 'feather icon-settings',
      click: handleNothing
    },
    {
      title: 'Thông tin cá nhân',
      link: '/users/user-profile',
      icon: 'feather icon-user',
      click: handleNothing
    },
    {
      title: 'Tin nhắn',
      link: '#',
      icon: 'feather icon-mail',
      click: handleNothing
    },
    {
      title: 'Khoá màn hình',
      link: '#',
      icon: 'feather icon-lock',
      click: handleNothing
    },
    {
      title: 'Đăng xuất',
      link: '#',
      icon: 'feather icon-log-out',
      click: handleSubmitLogOut
    }
  ]

  useEffect(() => {
    axiosConfig
      .get('/auth/me')
      .then((res) => {
        setDataUser(res.data.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  return (
    <React.Fragment>
      <ListGroup as='ul' bsPrefix=' ' className='navbar-nav ml-auto' id='navbar-right'>
        <ListGroup.Item as='li' bsPrefix=' '>
          <Dropdown alignRight={!rtlLayout}>
            <Dropdown.Toggle as={Link} variant='link' to='#' id='dropdown-basic'>
              <i className='feather icon-bell icon' />
            </Dropdown.Toggle>
            <Dropdown.Menu alignRight className='notification notification-scroll'>
              <div className='noti-head'>
                <h6 className='d-inline-block m-b-0'>Thông báo</h6>
                <div className='float-right'>
                  <Link to='#' className='m-r-10'>
                    Đánh dấu đã đọc
                  </Link>
                  <Link to='#'>Xoá tất cả</Link>
                </div>
              </div>
              <PerfectScrollbar>
                <ListGroup as='ul' bsPrefix=' ' variant='flush' className='noti-body'>
                  <ListGroup.Item as='li' bsPrefix=' ' className='n-title'>
                    <p className='m-b-0'>MỚI</p>
                  </ListGroup.Item>
                  <ListGroup.Item as='li' bsPrefix=' ' className='notification'>
                    <Media>
                      <img className='img-radius' src={avatar1} alt='Generic placeholder' />
                      <Media.Body>
                        <p>
                          <strong>Dư Huỳnh Phú</strong>
                          <span className='n-time text-muted'>
                            <i className='icon feather icon-clock m-r-10' />
                            15 giây
                          </span>
                        </p>
                        <p>
                          Đã thiết lập quyền <b>Quản trị viên</b> cho bạn
                        </p>
                      </Media.Body>
                    </Media>
                  </ListGroup.Item>
                  <ListGroup.Item as='li' bsPrefix=' ' className='n-title'>
                    <p className='m-b-0'>GẦN ĐÂY</p>
                  </ListGroup.Item>
                  <ListGroup.Item as='li' bsPrefix=' ' className='notification'>
                    <Media>
                      <img className='img-radius' src={avatar2} alt='Generic placeholder' />
                      <Media.Body>
                        <p>
                          <strong>Lê Văn Hùng</strong>
                          <span className='n-time text-muted'>
                            <i className='icon feather icon-clock m-r-10' />
                            30 phút
                          </span>
                        </p>
                        <p>
                          Đã xác nhận đơn hàng <b>PS88291</b>
                        </p>
                      </Media.Body>
                    </Media>
                  </ListGroup.Item>
                  <ListGroup.Item as='li' bsPrefix=' ' className='notification'>
                    <Media>
                      <img className='img-radius' src={avatar3} alt='Generic placeholder' />
                      <Media.Body>
                        <p>
                          <strong>Phan Nguyễn Thế Anh</strong>
                          <span className='n-time text-muted'>
                            <i className='icon feather icon-clock m-r-10' />2 giờ
                          </span>
                        </p>
                        <p>
                          Vừa xác nhận phiếu thu <b>PTM8298</b>
                        </p>
                      </Media.Body>
                    </Media>
                  </ListGroup.Item>
                  <ListGroup.Item as='li' bsPrefix=' ' className='notification'>
                    <Media>
                      <img className='img-radius' src={avatar4} alt='Generic placeholder' />
                      <Media.Body>
                        <p>
                          <strong>Vũ Văn Quyền</strong>
                          <span className='n-time text-muted'>
                            <i className='icon feather icon-clock m-r-10' />
                            Hôm qua
                          </span>
                        </p>
                        <p>
                          Vừa thêm đơn bảo hành <b>BHM1099</b>
                        </p>
                      </Media.Body>
                    </Media>
                  </ListGroup.Item>
                </ListGroup>
              </PerfectScrollbar>
              <div className='noti-footer'>
                <Link to='#'>Hiển thị tất cả</Link>
              </div>
            </Dropdown.Menu>
          </Dropdown>
        </ListGroup.Item>
        <ListGroup.Item as='li' bsPrefix=' '>
          <Dropdown>
            <Dropdown.Toggle
              as={Link}
              variant='link'
              to='#'
              className='displayChatbox'
              onClick={() => setListOpen(true)}
            >
              <i className='icon feather icon-mail' />
            </Dropdown.Toggle>
          </Dropdown>
        </ListGroup.Item>
        <ListGroup.Item as='li' bsPrefix=' '>
          <Dropdown alignRight={!rtlLayout} className='drp-user'>
            <Dropdown.Toggle as={Link} variant='link' to='#' id='dropdown-basic'>
              <i className='icon feather icon-settings' />
            </Dropdown.Toggle>
            <Dropdown.Menu alignRight className='profile-notification'>
              <div className='pro-head'>
                <img src={avatar1} className='img-radius' alt='User Profile' />
                <span>{dataUser ? dataUser.user_name : 'Unknown'}</span>
                <Link onClick={handleSubmitLogOut} to='#' className='dud-logout' title='Logout'>
                  <i className='feather icon-log-out' />
                </Link>
              </div>
              <ListGroup as='ul' bsPrefix=' ' variant='flush' className='pro-body'>
                {listMenuUser.map((menu, index) => (
                  <ListGroup.Item key={`menuUser_${index}`} as='li' bsPrefix=' '>
                    <Link to={menu.link} className='dropdown-item' onClick={menu.click}>
                      <i className={menu.icon} /> {menu.title}
                    </Link>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Dropdown.Menu>
          </Dropdown>
        </ListGroup.Item>
      </ListGroup>
      <ChatList listOpen={listOpen} closed={() => setListOpen(false)} />
    </React.Fragment>
  )
}

export default NavRight
