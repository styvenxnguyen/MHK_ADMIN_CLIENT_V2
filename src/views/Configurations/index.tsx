import { Card, Col, Row } from 'react-bootstrap'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'

const configsMenu = [
  {
    title: 'Thiết lập cửa hàng',
    children: [
      {
        name: 'Quản lý chi nhánh',
        description: 'Thêm mới và quản lý thông tin chi nhánh',
        icon: 'feather icon-map-pin',
        url: '/app/configurations/branches'
      },
      {
        name: 'Nhân viên và phân quyền',
        description: 'Quản lý và phân quyền nhân viên',
        icon: 'feather icon-users',
        url: '/app/configurations/users'
      },
      {
        name: 'Chính sách giá',
        description: 'Tạo và quản lý chính sách giá cửa hàng',
        icon: 'feather icon-users',
        url: '/app/configurations/price-policies'
      }
    ]
  }
]

const ConfigurationsList = () => {
  return (
    <>
      <Helmet>
        <title>Cấu hình</title>
      </Helmet>
      {configsMenu.map((configMenu, index) => (
        <Card key={`configsMenu_${index}`}>
          <Card.Header>
            <Card.Title as='h5'>{configMenu.title}</Card.Title>
          </Card.Header>
          <Card.Body>
            <Row>
              {configMenu.children.map((config, index) => (
                <Col lg={3} key={index}>
                  <Link to={config.url}>
                    <Card className='hover-card'>
                      <Card.Body>
                        <Row>
                          <Col lg={1}>
                            <i style={{ fontSize: 18 }} className={config.icon}></i>
                          </Col>
                          <Col lg={10}>
                            <p className='strong-title text-normal'>{config.name}</p>
                            <p style={{ fontSize: 13 }} className='text-normal'>
                              {config.description}
                            </p>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      ))}
    </>
  )
}

export default ConfigurationsList
