import React, { useCallback, useEffect, useState } from 'react'
import { Badge, Button, Card, Col, FormControl, Row } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import Select from 'react-select'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import BackPreviousPage from '~/components/Button/BackPreviousPage'
import CustomTable from '~/components/Table/CustomTable'
import { formatCurrency } from '~/utils/common'

import OrderService from '~/services/order.service'
import { getTagsList } from '~/services/api'
import StaffService from '~/services/staff.service'
import AgencyBranchService from '~/services/agencybranch.service'
import { AgencyBranch } from '~/types/AgencyBranch.type'
import { PurchaseOrder } from '~/types/PurchaseOrder.type'
import { OrderProduct } from '~/types/OrderProduct.type'
import { Staff } from '~/types/Staff.type'
import SupplierService from '~/services/supplier.service'
import { SupplierRes } from '~/types/Supplier.type'

const EditProduct = () => {
  const params: { id: string } = useParams()
  const [purchaseDetail, setPurchaseDetail] = useState<PurchaseOrder>()
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [productList, setProductList] = useState<OrderProduct[]>([])
  const [optionsStaff, setOptionsStaff] = useState([])
  const [optionsTag, setOptionsTag] = useState([])
  const [optionsBranch, setOptionsBranch] = useState([])
  const [optionsSupplier, setOptionsSupplier] = useState([])
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierRes>()

  const noOptionsMessage = () => 'Đã hết lựa chọn'

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date)
  }
  const totalQuantity = productList.reduce((acc: any, item: any) => acc + item.product_amount, 0)
  const totalAmount = productList.reduce((acc: any, item: any) => acc + item.product_price, 0)
  const totalDiscount = productList.reduce((acc: any, item: any) => acc + item.product_discount, 0)
  const totalPayment = totalAmount - totalDiscount

  const dataDebtSupplier = [
    {
      data: 'Công nợ',
      value: '0'
    },
    {
      data: 'Tổng đơn nhập',
      value: '0'
    },
    {
      data: 'Trả hàng',
      value: '0'
    }
  ]

  const totalProduct = [
    {
      data: 'Số lượng',
      value: totalQuantity
    },
    {
      data: 'Tổng tiền',
      value: formatCurrency(totalAmount)
    },
    {
      data: 'Chiết khấu',
      value: totalDiscount
    },
    {
      data: 'Tiền cần trả',
      value: formatCurrency(totalPayment),
      bold: true
    }
  ]

  const columns = React.useMemo(
    () => [
      {
        Header: 'STT',
        accessor: 'index'
      },
      {
        Header: 'Mã SKU',
        accessor: 'product_variant_detail_SKU'
      },
      {
        Header: 'Tên sản phẩm',
        accessor: 'product_variant_detail_name'
      },
      {
        Header: 'Số lượng',
        accessor: 'product_amount',
        Cell: ({ value }: { value: number }) => <div>{value}</div>
      },
      {
        Header: 'Giá sản phẩm',
        accessor: 'product_price',
        Cell: ({ value }: any) => formatCurrency(value)
      },
      {
        Header: 'Chiết khấu',
        accessor: 'product_discount'
      },
      {
        Header: 'Đơn vị',
        accessor: 'product_unit'
      },
      {
        Header: 'Thành tiền',
        Cell: ({ row }: any) => {
          const amount = row.values.product_amount
          const price = row.values.product_price

          const totalPrice = formatCurrency(amount * price)

          return totalPrice
        }
      }
    ],
    []
  )

  const customPlaceholder = () => {
    return (
      <span className='flex-between'>
        <span>Tìm theo tên, SĐT, mã nhà cung cấp...(F4)</span>
        <i className='feather icon-search'></i>
      </span>
    )
  }

  const getStaffList = useCallback(async () => {
    try {
      const res = await StaffService.getAllStaff()
      const result = res.data.data
      const options = result.map((staff: Staff) => ({
        label: staff.staff_name,
        value: staff.staff_id
      }))
      setOptionsStaff(options)
    } catch (error) {
      console.log(error)
    }
  }, [])

  const getSupplierList = useCallback(async () => {
    try {
      const res = await SupplierService.getAllSupplier()
      const result = res.data.data
      const options = result.map((supplier: SupplierRes) => ({
        label: supplier.customer_name,
        value: supplier.id
      }))
      setOptionsSupplier(options)
    } catch (error) {
      console.log(error)
    }
  }, [])

  const getSupplierDetail = useCallback(async (id: string) => {
    try {
      const res = await SupplierService.getDetailSupplier(id)
      setSelectedSupplier(res.data.data)
    } catch (error) {
      console.log(error)
    }
  }, [])

  const getAgencyBranch = useCallback(async () => {
    try {
      const res = await AgencyBranchService.getAllAgencyBranch()
      const result = res.data.data
      const options = result.map((branch: AgencyBranch) => ({
        label: branch.agency_branch_name,
        value: branch.id
      }))
      setOptionsBranch(options)
    } catch (error) {
      console.log(error)
    }
  }, [])

  const getPurchaseOrderDetail = useCallback(async () => {
    try {
      const res = await OrderService.getPurchaseOrderDetail(params.id)
      setPurchaseDetail(res.data.data)
      setProductList(res.data.data.order_product_list)
    } catch (error) {
      console.log(error)
    }
  }, [params.id])

  const updatedPurchaseOrder = useCallback(async () => {
    try {
      const data: PurchaseOrder = {}
      await OrderService.updatedPurchaseOrderDetail(params.id, data)
    } catch (error) {
      console.log(error)
    }
  }, [params.id])

  useEffect(() => {
    if (params.id) {
      getPurchaseOrderDetail()
    }
    getStaffList()
    getAgencyBranch()
    getSupplierList()
  }, [getPurchaseOrderDetail, getStaffList, getAgencyBranch, getSupplierList, params.id])

  useEffect(() => {
    getTagsList().then((response) => {
      const tagsList = response.data.data
      setOptionsTag(
        tagsList.map((tag: any) => ({
          label: tag.tag_title,
          value: tag.id
        }))
      )
    })
  }, [])

  return (
    <div>
      <div className='flex-between'>
        <BackPreviousPage path={`/app/purchase_orders`} text='Quay lại chi tiết đơn hàng nhập' />
        <Button className='m-0 mb-3'>
          <i className='feather icon-save' />
          Lưu
        </Button>
      </div>
      <Row className='text-normal'>
        <Col lg={8}>
          <Card style={{ height: '90%' }}>
            <Card.Header>
              <h5>
                <i className='feather icon-user mr-2'></i>
                Thông tin nhà cung cấp
              </h5>
            </Card.Header>
            <Card.Body>
              {params.id ? (
                <Row>
                  <Col lg={6}>
                    <div className='font-weight-bold'>
                      <p>
                        <Link to='#'>{purchaseDetail?.supplier && purchaseDetail.supplier.name}</Link>
                      </p>
                      <p>Số điện thoại : {purchaseDetail?.supplier && purchaseDetail.supplier.phone}</p>

                      {purchaseDetail?.supplier && purchaseDetail.supplier.addresses
                        ? purchaseDetail.supplier.addresses.map((address: any, index: any) => (
                            <p key={`addressSupplier_${index}`}>
                              Địa chỉ {index + 1}:{' '}
                              <span style={{ fontWeight: '500' }}>{address.user_specific_address}</span>
                            </p>
                          ))
                        : 'Chưa cập nhật địa chỉ'}
                    </div>
                  </Col>

                  <Col>
                    <div className='box-dash'>
                      {dataDebtSupplier.map((debtSupplier, index) => (
                        <span key={`debtSupplier_${index}`} className='flex-between m-2'>
                          <span>{debtSupplier.data}</span>
                          <span className='text-c-blue font-weight-bold'>{debtSupplier.value}</span>
                        </span>
                      ))}
                    </div>
                  </Col>
                </Row>
              ) : (
                <>
                  {selectedSupplier ? (
                    <Row>
                      <Col lg={6}>
                        <div className='font-weight-bold'>
                          <p>
                            <Link to='#'>{selectedSupplier.customer_name}</Link>
                          </p>
                          <p>Số điện thoại : {selectedSupplier.customer_phone}</p>

                          {selectedSupplier.address_list.length > 0
                            ? selectedSupplier.address_list.map((address: any, index: any) => (
                                <p key={`addressSupplier_${index}`}>
                                  Địa chỉ {index + 1}:{' '}
                                  <span style={{ fontWeight: '500' }}>{address.user_specific_address}</span>
                                </p>
                              ))
                            : 'Chưa cập nhật địa chỉ'}
                        </div>
                      </Col>

                      <Col>
                        <div className='box-dash'>
                          {dataDebtSupplier.map((debtSupplier, index) => (
                            <span key={`debtSupplier_${index}`} className='flex-between m-2'>
                              <span>{debtSupplier.data}</span>
                              <span className='text-c-blue font-weight-bold'>{debtSupplier.value}</span>
                            </span>
                          ))}
                        </div>
                      </Col>
                    </Row>
                  ) : (
                    <>
                      <Select
                        // value={}
                        // noOptionsMessage={() => customNoOptionMessage(true)}
                        options={optionsSupplier}
                        onChange={(e: any) => {
                          getSupplierDetail(e.value)
                        }}
                        placeholder={customPlaceholder()}
                      />
                      <p style={{ color: '#bfb2b2', textAlign: 'center', marginTop: '55px' }}>
                        Chưa có thông tin nhà cung cấp
                      </p>
                    </>
                  )}
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card style={{ height: '90%' }}>
            <Card.Header>
              <h5>
                <i className='feather icon-clipboard mr-2'></i>
                Thông tin đơn hàng nhập
              </h5>
            </Card.Header>
            <Card.Body>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className='flex-between' style={{ display: 'flex' }}>
                  <span>Chi nhánh:</span>
                  <div style={{ width: '65%' }}>
                    <Select
                      placeholder={purchaseDetail?.staff ? purchaseDetail.staff.name : 'Chọn chi nhánh'}
                      isMulti
                      isDisabled={!!params.id}
                      options={optionsBranch}
                      noOptionsMessage={() => 'Đã chọn hết chi nhánh'}
                    ></Select>
                  </div>
                </div>
                <div className='flex-between' style={{ display: 'flex' }}>
                  <span>Nhân viên:</span>
                  <div style={{ width: '65%' }}>
                    <Select
                      name='staff'
                      options={optionsStaff}
                      placeholder={purchaseDetail?.staff ? purchaseDetail.staff.name : 'Chọn nhân viên'}
                      isMulti
                      // onChange={(s) => setFieldValue('staff', s)}
                    ></Select>
                  </div>
                </div>
                <div className='flex-between' style={{ display: 'flex' }}>
                  <span>Ngày hẹn giao:</span>
                  <div style={{ width: '65%' }}>
                    <DatePicker
                      className='w-full'
                      selected={selectedDate}
                      onChange={handleDateChange}
                      dateFormat='yyyy-MM-dd'
                      placeholderText='Chọn ngày hẹn giao'
                    />
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Header>
              <h5>
                <i className='feather icon-archive mr-2'></i>
                Thông tin sản phẩm
              </h5>
            </Card.Header>
            <Card.Body>
              <CustomTable columns={columns} data={productList} handleRowClick={{}} hiddenColumns={['selection']} />

              <hr className='dashed-top' />
              <Row className='justify-content-between'>
                <Col lg={3}>
                  <p className='font-weight-bold'>Ghi chú đơn</p>
                  <FormControl as='textarea' rows={3} className='my-textarea' placeholder='VD: Hàng tặng gói riêng' />
                  <p className='font-weight-bold mt-2'>Tags</p>
                  {params.id ? (
                    <div>
                      {purchaseDetail?.order_tags &&
                        purchaseDetail.order_tags.map((tag: any, index: number) => (
                          <Badge className='p-2 mr-2 mb-2' key={`tagsProduct_${index}`} variant='warning'>
                            {tag.Tag.tag_title}
                          </Badge>
                        ))}
                    </div>
                  ) : (
                    <Select
                      options={optionsTag}
                      isMulti
                      placeholder='Chọn tags'
                      noOptionsMessage={noOptionsMessage}
                      menuPlacement='top'
                    />
                  )}
                </Col>
                <Col lg={3}>
                  {totalProduct.map((total, index) => (
                    <span
                      key={`debtSupplier_${index}`}
                      className={total.bold ? 'font-weight-bold flex-between m-3' : 'flex-between m-3'}
                      style={total.bold ? { borderTop: '1px solid gray', paddingTop: '10px' } : {}}
                    >
                      <span>{total.data}</span>
                      <span>{total.value}</span>
                    </span>
                  ))}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default EditProduct
