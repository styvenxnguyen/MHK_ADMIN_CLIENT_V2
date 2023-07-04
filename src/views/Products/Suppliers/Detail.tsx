import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Form, FormLabel, Badge, Tabs, Tab, Tooltip, OverlayTrigger } from 'react-bootstrap'
import { axiosConfig } from '~/utils/configAxios'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import Error from '~/views/Errors'
import PageLoader from '~/components/Loader/PageLoader'
import BackPreviousPage from '~/components/Button/BackPreviousPage'
import Addresses from '~/components/AdditionalData/Addresses'
import Debt from '~/components/AdditionalData/Debt'

const SupplierDetail = () => {
  const [showTooltipEmail, setShowTooltipEmail] = useState(false)
  const [showTooltipNote, setShowTooltipNote] = useState(false)
  const [staffName, setStaffName] = useState('---')
  const handleMouseEnterEmail = () => setShowTooltipEmail(true)
  const handleMouseLeaveEmail = () => setShowTooltipEmail(false)
  const handleMouseEnterNote = () => setShowTooltipNote(true)
  const handleMouseLeaveNote = () => setShowTooltipNote(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isFetched, setIsFetched] = useState(false)

  const { id }: any = useParams()
  const [customerData, setCustomerData]: any = useState({})

  useEffect(() => {
    axiosConfig
      .get(`/supplier/get-by-id/${id}`)
      .then((response) => {
        const result = response.data.data
        setCustomerData(result)
        if (result.staff_in_charge) {
          setStaffName(result.staff_in_charge.staff_name)
        }
        setIsLoading(false)
        setIsFetched(true)
      })
      .catch(() => {
        setIsLoading(false)
      })
  }, [id])

  // const handleEditProfile = (e: any) => {
  //   e.preventDefault()
  //   history.push(`/app/customers/detail/${id}/edit`)
  // }

  // const handleDelete = () => {
  //   handleAlertConfirm({
  //     title: 'Xoá khách hàng',
  //     html: `Bạn có chắc chắn muốn xoá khách hàng <b>${customerData.customer_name}</b> ? Thao tác này không thể khôi phục`,
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: 'red',
  //     handleConfirmed: () =>
  //       axiosConfig
  //         .delete(`/customer/delete-by-id/${id}`)
  //         .then(() => {
  //           {
  //             history.push('/app/customers')
  //             Swal.fire('', 'Xoá khách hàng thành công', 'success')
  //           }
  //         })
  //         .catch(() => {
  //           Swal.fire('', 'Xoá khách hàng thất bại', 'success')
  //         })
  //   })
  // }

  const tooltipEmail = (
    <Tooltip
      id={`tooltip-${customerData.customer_email}`}
      onMouseEnter={handleMouseEnterEmail}
      onMouseLeave={handleMouseLeaveEmail}
    >
      {customerData.customer_email}
    </Tooltip>
  )

  const tooltipNote = (
    <Tooltip
      id={`tooltip-${customerData.staff_in_charge_note}`}
      onMouseEnter={handleMouseEnterNote}
      onMouseLeave={handleMouseLeaveNote}
    >
      {customerData.staff_in_charge_note}
    </Tooltip>
  )

  if (isLoading) return <PageLoader />

  if (!isFetched) {
    return <Error errorCode='500' />
  }

  return (
    <React.Fragment>
      <Helmet>
        <title>Chi tiết nhà cung cấp</title>
      </Helmet>
      <div className='d-flex justify-content-between'>
        <BackPreviousPage path='/app/suppliers' text='Quay lại danh sách nhà cung cấp' />
        {/* <Button onClick={handleDelete} type='submit' variant='outline-danger' className='m-0 mb-3'>
          <span style={{ fontWeight: 600 }}>
            <i className='feather icon-trash-2 mr-2'></i>
            Xoá nhà cung cấp
          </span>
        </Button> */}
      </div>
      <Row>
        <Col sm={12} lg={12}>
          <Row>
            <Col sm={12} lg={12}>
              <Card>
                <Card.Header className='flex-between'>
                  <Card.Title as='h5'>
                    <span>
                      <h4 style={{ display: 'inline-block', fontWeight: 600, fontSize: 22 }}>
                        {customerData.customer_name}
                      </h4>
                      <span>
                        {customerData.customer_status === 'Ngừng giao dịch' ? (
                          <Badge
                            style={{ fontSize: 15, marginLeft: 15, padding: 11 }}
                            key='process'
                            pill
                            variant='danger'
                          >
                            Ngừng giao dịch
                          </Badge>
                        ) : (
                          <Badge
                            style={{ fontSize: 15, marginLeft: 15, padding: 11 }}
                            key='stop'
                            pill
                            variant='success'
                          >
                            Đang giao dịch
                          </Badge>
                        )}
                      </span>
                    </span>
                  </Card.Title>
                  {/* <span>
                    <small>
                      <Link to='#' onClick={handleEditProfile}>
                        Cập nhật
                      </Link>
                    </small>
                  </span> */}
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col sm={12} lg={6}>
                      <Form.Group className='mb-0' as={Row} controlId='formHorizontalEmail'>
                        <Form.Label column>Mã nhà cung cấp</Form.Label>
                        <Col sm={10} lg={7}>
                          <FormLabel className='text-normal' column>
                            : {customerData.user_code ? customerData.user_code : '---'}
                          </FormLabel>
                        </Col>
                      </Form.Group>
                      <Form.Group className='mb-0' as={Row} controlId='formHorizontalEmail'>
                        <Form.Label column>Số điện thoại</Form.Label>
                        <Col sm={10} lg={7}>
                          <FormLabel className='text-normal' column>
                            : {customerData.customer_phone ? customerData.customer_phone : '---'}
                          </FormLabel>
                        </Col>
                      </Form.Group>
                      <Form.Group className='mb-0' as={Row} controlId='formHorizontalEmail'>
                        <Form.Label column>Email</Form.Label>
                        <Col sm={10} lg={7}>
                          <OverlayTrigger
                            overlay={tooltipEmail}
                            show={showTooltipEmail}
                            placement='bottom'
                            delay={{ show: 0, hide: 100000 }}
                            trigger={['hover', 'focus']}
                          >
                            <FormLabel
                              onMouseEnter={handleMouseEnterEmail}
                              onMouseLeave={handleMouseLeaveEmail}
                              className='text-normal long-text'
                              column
                            >
                              : {customerData.customer_email ? customerData.customer_email : '---'}
                            </FormLabel>
                          </OverlayTrigger>
                        </Col>
                      </Form.Group>
                      <Form.Group className='mb-0' as={Row} controlId='formHorizontalEmail'>
                        <Form.Label column>Nhân viên phụ trách</Form.Label>
                        <Col sm={10} lg={7}>
                          <FormLabel className='text-normal' column>
                            : {staffName}
                          </FormLabel>
                        </Col>
                      </Form.Group>
                    </Col>
                    <Col sm={12} lg={6}>
                      <Form.Group className='mb-0' as={Row} controlId='formHorizontalEmail'>
                        <Form.Label column>Mã số thuế</Form.Label>
                        <Col sm={10} lg={7}>
                          <FormLabel className='text-normal' column>
                            : {customerData.user_sex ? customerData.user_sex : '---'}
                          </FormLabel>
                        </Col>
                      </Form.Group>
                      <Form.Group className='mb-0' as={Row} controlId='formHorizontalEmail'>
                        <Form.Label column>Website</Form.Label>
                        <Col sm={10} lg={7}>
                          <FormLabel className='text-normal' column>
                            : {customerData.user_sexx ? customerData.user_sex : '---'}
                          </FormLabel>
                        </Col>
                      </Form.Group>
                      <Form.Group className='mb-0' as={Row} controlId='formHorizontalEmail'>
                        <Form.Label column>Mô tả</Form.Label>
                        <Col sm={10} lg={7}>
                          <OverlayTrigger
                            overlay={tooltipNote}
                            show={showTooltipNote}
                            placement='bottom'
                            delay={{ show: 0, hide: 100000 }}
                            trigger={['hover', 'focus']}
                          >
                            <FormLabel
                              onMouseEnter={handleMouseEnterNote}
                              onMouseLeave={handleMouseLeaveNote}
                              className='text-normal long-text'
                              column
                            >
                              : {customerData.staff_in_charge_note ? customerData.staff_in_charge_note : '---'}
                            </FormLabel>
                          </OverlayTrigger>
                        </Col>
                      </Form.Group>
                      <Form.Group className='mb-0' as={Row} controlId='formHorizontalEmail'>
                        <Form.Label column>Tags</Form.Label>
                        <Col sm={10} lg={7}>
                          <FormLabel className='text-normal' column>
                            :{' '}
                            {customerData.tags === undefined
                              ? '---'
                              : customerData.tags.map((tag: any, index: any) => (
                                  <span key={`tag_${index}`}>
                                    <Badge variant='warning' className='ml-2 p-1'>
                                      {tag.tag_title}
                                    </Badge>
                                  </span>
                                ))}
                          </FormLabel>
                        </Col>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>

        <Col sm={12} lg={12}>
          <Tabs variant='pills' defaultActiveKey='addresses' className='tabs-menu'>
            <Tab eventKey='addresses' title='Địa chỉ'>
              <div className='px-3'>
                <Addresses value='supplier' />
              </div>
            </Tab>
            <Tab eventKey='profile' title='Công nợ'>
              <div className='px-3'>
                <Debt id={id} value='supplier' />
              </div>
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default SupplierDetail
