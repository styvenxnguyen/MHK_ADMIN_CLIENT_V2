import React, { useEffect, useState, useCallback } from 'react'
import { Row, Col, Card, FormControl, Button, CloseButton, FormGroup, FormLabel } from 'react-bootstrap'
import Select, { SingleValue } from 'react-select'
import { TbPackage } from 'react-icons/tb'
import { FiTruck } from 'react-icons/fi'
import { SlSocialDropbox } from 'react-icons/sl'

import BackPreviousPage from '~/components/Button/BackPreviousPage'
import CustomerService from '~/services/customer.service'

import { Customer } from '~/types/Customer.type'
import ProductService from '~/services/product.service'
import { Product } from '~/types/Product.type'
import CustomTable from '~/components/Table/CustomTable'
import { OrderProduct } from '~/types/OrderProduct.type'
import { formatCurrency } from '~/utils/common'
import { ButtonLoading } from '~/components/Button/LoadingButton'
import DeliveryService from '~/services/delivery.service'

const dataDebtSupplier = [
  {
    data: 'Nợ phải thu',
    value: '0'
  },
  {
    data: 'Tổng chi tiêu',
    value: '0'
  },
  {
    data: 'Trả hàng',
    value: '0'
  },
  {
    data: 'Giao hàng thất bại',
    value: '0'
  }
]

const listButton = [
  { label: 'Đẩy qua hãng vận chuyển', value: 1, icon: <FiTruck style={{ fontSize: '18px', marginBottom: '2px' }} /> }
  // {
  //   label: 'Đẩy vận chuyển ngoài',
  //   value: 2,
  //   icon: <RiEBike2Line style={{ fontSize: '18px', marginBottom: '2px' }} />
  // },
  // {
  //   label: 'Khách nhận tại cửa hàng',
  //   value: 3,
  //   icon: <HiOutlineBuildingStorefront style={{ fontSize: '18px', marginBottom: '2px' }} />
  // },
  // { label: 'Giao hàng sau', value: 4, icon: <BsClockHistory style={{ fontSize: '18px', marginBottom: '2px' }} /> }
]

const OrderCreate = () => {
  const [listCustomer, setListCustomer] = useState<Customer[]>([])
  const [customerDetail, setCustomerDetail] = useState<Customer>()
  const [optionsProduct, setOptionsProduct] = useState([])
  // const [optionsProductVariant, setOptionsProductVariant] = useState([])
  const [seletedProduct, setSelectedProduct] = useState()
  const [productList, setProductList] = useState<OrderProduct[]>([])
  const canEdit = true
  const [activeButton, setActiveButton] = useState<number>(1)
  const [optionsShipper, setOptionsShipper] = useState([])

  const columns = React.useMemo(() => {
    const handleProductTable = (rowIndex: number, columnId: string, value: any) => {
      const updatedData: any = [...productList]
      updatedData[rowIndex][columnId] = value
      setProductList(updatedData)
    }

    const handleDeleteRow = (rowIndex: number) => {
      const newData = [...productList]
      newData.splice(rowIndex, 1)
      setProductList(newData)
    }

    return [
      {
        Header: 'STT',
        Cell: ({ row }: any) => productList.length - row.index
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
        Cell: ({ row, value }: any) =>
          canEdit ? (
            <FormControl
              className='text-center'
              type='number'
              min={1}
              value={value}
              onChange={(e) => handleProductTable(row.index, 'product_amount', e.target.value)}
            />
          ) : (
            formatCurrency(value)
          )
      },
      {
        Header: 'Giá sản phẩm',
        accessor: 'product_price',
        Cell: ({ row, value }: any) =>
          canEdit ? (
            <FormControl
              value={value}
              type='number'
              className='text-center no-spin'
              onChange={(e) => handleProductTable(row.index, 'product_price', e.target.value)}
            />
          ) : (
            formatCurrency(value)
          )
      },
      {
        Header: 'Chiết khấu',
        accessor: 'product_discount',
        Cell: ({ row, value }: any) =>
          canEdit ? (
            <FormControl
              type='number'
              value={value}
              className='text-center no-spin'
              onChange={(e) => handleProductTable(row.index, 'product_discount', e.target.value)}
            />
          ) : (
            formatCurrency(value)
          )
      },
      {
        Header: 'Đơn vị',
        accessor: 'product_unit',
        Cell: ({ row, value }: any) =>
          canEdit ? (
            <FormControl
              value={value}
              className='text-center'
              onChange={(e) => handleProductTable(row.index, 'product_unit', e.target.value)}
            />
          ) : (
            value
          )
      },
      {
        Header: 'Thành tiền',
        Cell: ({ row }: any) => {
          const amount = row.values.product_amount
          const price = row.values.product_price
          const totalPrice = formatCurrency(amount * price)
          return totalPrice
        }
      },
      {
        Header: 'Chức năng',
        accessor: 'advance',
        Cell: ({ row }: any) => (
          <Button className='' variant='outline-danger' onClick={() => handleDeleteRow(row.index)}>
            <i className='feather icon-trash-2' />
            Xoá
          </Button>
        )
      }
    ]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productList.length])

  const customPlaceholder = (value: string) => {
    return (
      <span className='flex-between'>
        <span>{value === 'Supplier' ? 'Tìm theo tên khách hàng' : 'Tìm theo tên sản phẩm'} </span>
        <i className='feather icon-search'></i>
      </span>
    )
  }

  const getListCustomer = useCallback(async () => {
    try {
      const res = await CustomerService.getListCustomer()
      setListCustomer(res.data.data)
    } catch (error) {
      console.log(error)
    }
  }, [])

  const getCustomerDetail = useCallback(async (id: string) => {
    try {
      const res = await CustomerService.getCustomerDetail(id)
      setCustomerDetail(res.data.data)
    } catch (error) {
      console.log(error)
    }
  }, [])

  const getProductList = useCallback(async () => {
    try {
      const res = await ProductService.getListProduct()
      const result = res.data.data
      const options = result.map((product: Product) => ({
        label: product.product_name,
        value: product.id
      }))
      setOptionsProduct(options)
    } catch (error) {
      console.log(error)
    }
  }, [])

  const getProductDetail = useCallback(async (e: SingleValue<{ label: string; value: string }>) => {
    try {
      if (e) {
        const res = await ProductService.getDetailProduct(e?.value)
        // const dataProduct: any = res.data.data
        // const options = dataProduct.productVariants.map((variant: ProductVariant) => ({
        //   label: variant.product_variant_name,
        //   value: variant.id
        // }))
        // setOptionsProductVariant(options)
        setSelectedProduct(res.data.data)
      }
    } catch (error) {
      console.log(error)
    }
  }, [])

  const selectedCustomer = useCallback(
    (e: SingleValue<{ label: string; value: string }>) => {
      if (e) {
        getCustomerDetail(e?.value)
      }
    },
    [getCustomerDetail]
  )

  const getListShipper = useCallback(() => {
    DeliveryService.getAllDelivery()
      .then((res) => {
        const data = res.data.data
        setOptionsShipper(
          data.map((shipper: any) => ({
            label: shipper.shipper_unit,
            value: shipper.id
          }))
        )
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  useEffect(() => {
    getListCustomer()
    getProductList()
    getListShipper()
  }, [getListCustomer, getProductList, getListShipper])

  return (
    <React.Fragment>
      <div className='d-flex justify-content-between'>
        <BackPreviousPage text='Quay lại danh sách đơn hàng' path='/app/products' />
        <ButtonLoading
          type='submit'
          // loading={showLoader}
          // disabled={showLoader}
          className='m-0 mb-3'
          text={
            <>
              <i className='feather icon-plus-circle'></i>
              Tạo đơn hàng
            </>
          }
        />
      </div>

      <Row className='text-normal'>
        <Col lg={12}>
          <Row style={{ maxHeight: '400px' }}>
            <Col lg={8}>
              <Card style={{ height: '90%' }}>
                <Card.Header>
                  <Card.Title as='h5'>
                    <i className='feather icon-user mr-2' />
                    Thông tin khách hàng
                  </Card.Title>
                  {customerDetail && (
                    <div className='d-flex align-items-center mt-2'>
                      <span style={{ fontSize: '17px', color: '#0088FF', fontWeight: '600' }} className='mr-1'>
                        {customerDetail.customer_name}
                      </span>
                      <span style={{ fontSize: '17px' }} className='ml-1'>
                        - {customerDetail.customer_phone}{' '}
                      </span>
                      <CloseButton
                        style={{ float: 'initial' }}
                        className='m-0 ml-2'
                        onClick={() => setCustomerDetail(undefined)}
                      />
                    </div>
                  )}
                </Card.Header>
                {customerDetail ? (
                  <Card.Body>
                    <Row>
                      <Col lg={6}>
                        <div className='font-weight-bold'>
                          <p>Đia chỉ giao hàng</p>
                        </div>
                        <p>
                          {customerDetail.customer_name} - {customerDetail.customer_phone}
                        </p>
                        <p>
                          {customerDetail.address_list[0].user_specific_address}{' '}
                          {customerDetail.address_list[0].user_district} {customerDetail.address_list[0].user_province}
                        </p>
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
                  </Card.Body>
                ) : (
                  <Card.Body style={{ height: '90%' }}>
                    <Row>
                      <Col>
                        <Select
                          className='mb-4'
                          options={listCustomer.map((e) => ({
                            label: `${e.customer_name} - ${e.customer_phone}`,
                            value: e.id
                          }))}
                          onChange={(e) => selectedCustomer(e)}
                          placeholder={customPlaceholder('Supplier')}
                        />
                      </Col>
                    </Row>
                    <>
                      <p
                        style={{ color: '#bfb2b2', height: '75%' }}
                        className='d-flex justify-content-center align-items-center'
                      >
                        Chưa có thông tin khách hàng
                      </p>
                    </>
                  </Card.Body>
                )}
              </Card>
            </Col>
            <Col sm={12} lg={4}>
              <Card style={{ height: '90%' }}>
                <Card.Header>
                  <Card.Title as='h5'>Thông tin bổ sung</Card.Title>
                </Card.Header>
                <Card.Body style={{ height: '325px', overflowY: 'auto' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className='flex-between'>
                      <span>Bán bởi:</span>
                      <div style={{ width: '65%' }}>
                        <Select
                          placeholder='Chọn chi nhánh'
                          // isDisabled={!!params.id}
                          // defaultValue={selectedBranch}
                          // options={optionsBranch}
                          // loadingMessage={loadingMessage}
                          // onChange={(e: any) => setSelectedBranch(e)}
                        ></Select>
                      </div>
                    </div>
                    <div className='flex-between'>
                      <span>Bán tại:</span>
                      <div style={{ width: '65%' }}>
                        <Select
                          name='staff'
                          // options={optionsStaff}
                          // isDisabled={!canEdit}
                          // loadingMessage={loadingMessage}
                          // defaultValue={selectedStaff}
                          // onChange={(e: any) => {
                          //   setSelectedStaff(e)
                          // }}
                          placeholder={'Chọn nhân viên'}
                        ></Select>
                      </div>
                    </div>
                    <div className='flex-between'>
                      <span>Nguồn:</span>
                      <div style={{ width: '65%' }}>
                        <Select
                          name='staff'
                          // options={optionsStaff}
                          // isDisabled={!canEdit}
                          // loadingMessage={loadingMessage}
                          // defaultValue={selectedStaff}
                          // onChange={(e: any) => {
                          //   setSelectedStaff(e)
                          // }}
                          placeholder={'Chọn nhân viên'}
                        ></Select>
                      </div>
                    </div>
                    <div className='flex-between'>
                      <span>Hẹn giao: </span>
                      <div style={{ width: '65%' }}>
                        <Select
                          name='staff'
                          // options={optionsStaff}
                          // isDisabled={!canEdit}
                          // loadingMessage={loadingMessage}
                          // defaultValue={selectedStaff}
                          // onChange={(e: any) => {
                          //   setSelectedStaff(e)
                          // }}
                          placeholder={'Chọn nhân viên'}
                        ></Select>
                      </div>
                    </div>
                    <div className='flex-between'>
                      <span>Mã đơn: </span>
                      <div style={{ width: '65%' }}>
                        <Select
                          name='staff'
                          // options={optionsStaff}
                          // isDisabled={!canEdit}
                          // loadingMessage={loadingMessage}
                          // defaultValue={selectedStaff}
                          // onChange={(e: any) => {
                          //   setSelectedStaff(e)
                          // }}
                          placeholder={'Chọn nhân viên'}
                        ></Select>
                      </div>
                    </div>
                    <div className='flex-between'>
                      <span style={{ width: '30%' }}>Đường dẫn đơn hàng: </span>
                      <div style={{ width: '65%' }}>
                        <Select
                          name='staff'
                          // options={optionsStaff}
                          // isDisabled={!canEdit}
                          // loadingMessage={loadingMessage}
                          // defaultValue={selectedStaff}
                          // onChange={(e: any) => {
                          //   setSelectedStaff(e)
                          // }}
                          placeholder={'Chọn nhân viên'}
                        ></Select>
                      </div>
                    </div>
                    <div className='flex-between'>
                      <span>Tham chiếu: </span>
                      <div style={{ width: '65%' }}>
                        <Select
                          name='staff'
                          // options={optionsStaff}
                          // isDisabled={!canEdit}
                          // loadingMessage={loadingMessage}
                          // defaultValue={selectedStaff}
                          // onChange={(e: any) => {
                          //   setSelectedStaff(e)
                          // }}
                          placeholder={'Chọn nhân viên'}
                        ></Select>
                      </div>
                    </div>
                    <div className='flex-between'>
                      <span style={{ width: '30%' }}>Thanh toán dự kiến: </span>
                      <div style={{ width: '65%' }}>
                        <Select
                          name='staff'
                          // options={optionsStaff}
                          // isDisabled={!canEdit}
                          // loadingMessage={loadingMessage}
                          // defaultValue={selectedStaff}
                          // onChange={(e: any) => {
                          //   setSelectedStaff(e)
                          // }}
                          placeholder={'Chọn nhân viên'}
                        ></Select>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>

        <Col lg={12} sm={12}>
          <Card>
            <Card.Header>
              <h5>
                <i className='feather icon-archive mr-2'></i>
                Thông tin sản phẩm
              </h5>
              <Select
                className='mt-4'
                options={optionsProduct}
                onChange={(e) => {
                  getProductDetail(e)
                }}
                placeholder={customPlaceholder('Product')}
              />
            </Card.Header>
            {seletedProduct ? (
              <Card.Body>
                <CustomTable
                  columns={columns}
                  data={productList}
                  handleRowClick={() => 1 == 1}
                  hiddenColumns={['selection', !canEdit && 'advance']}
                />
                <hr className='dashed-top' />
              </Card.Body>
            ) : (
              <Card.Body>
                {' '}
                <div
                  style={{ color: '#9d9d9d' }}
                  className='d-flex justify-content-center align-items-center py-5 flex-column'
                >
                  <TbPackage size={80} />
                  <span className='mt-3'>Đơn hàng chưa có sản phẩm nào</span>
                </div>
              </Card.Body>
            )}
          </Card>
        </Col>

        <Col sm={12} lg={12}>
          <Card>
            <Card.Header>
              <h5>
                <SlSocialDropbox className='mr-2' />
                Đóng gói và giao hàng
              </h5>
              <div className='d-flex pt-4'>
                {listButton.map((button, index) => (
                  <Button
                    key={index}
                    variant={`${index + 1 === activeButton ? 'outline-primary' : 'outline-secondary'}`}
                    onClick={() => setActiveButton(button.value)}
                    style={{ display: 'flex', gap: '10px', alignItems: 'center' }}
                  >
                    <span>{button.icon}</span>
                    {button.label}
                  </Button>
                ))}
              </div>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col>
                  <FormGroup className='d-flex align-items-center'>
                    <FormLabel>Chọn nhân viên vận chuyển: </FormLabel>
                    <Select
                      options={optionsShipper}
                      defaultValue={optionsShipper[0]}
                      menuPlacement='top'
                      className='ml-3 w-25'
                    />
                  </FormGroup>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default OrderCreate
