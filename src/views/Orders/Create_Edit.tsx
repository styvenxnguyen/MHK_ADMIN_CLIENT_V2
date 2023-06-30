import React, { useEffect, useState, useCallback } from 'react'
import {
  Row,
  Col,
  Card,
  FormControl,
  Button,
  CloseButton,
  FormGroup,
  FormLabel,
  DropdownButton,
  Dropdown,
  Spinner
} from 'react-bootstrap'
import Select, { SingleValue } from 'react-select'
import { TbPackage } from 'react-icons/tb'
import { FiTruck } from 'react-icons/fi'
import { SlSocialDropbox } from 'react-icons/sl'

import BackPreviousPage from '~/components/Button/BackPreviousPage'
import CustomerService from '~/services/customer.service'

import { Customer, CustomerList } from '~/types/Customer.type'
import ProductService from '~/services/product.service'
import { Product, ProductPurchase, ProductVariant } from '~/types/Product.type'
import CustomTable from '~/components/Table/CustomTable'
import { OrderProduct } from '~/types/OrderProduct.type'
import { formatCurrency } from '~/utils/common'
import DeliveryService from '~/services/delivery.service'
import { Helmet } from 'react-helmet'
import PageLoader from '~/components/Loader/PageLoader'
import Error from '../Errors'
import AgencyBranchService from '~/services/agencybranch.service'
import StaffService from '~/services/staff.service'
import PaymentService from '~/services/payment.service'
import OrderService from '~/services/order.service'
import { useHistory, useParams } from 'react-router-dom'
import { PurchaseOrder } from '~/types/PurchaseOrder.type'
import { SelectProps } from '~/types/Select.type'
import { TagService } from '~/services/tag.service'
import { handleAlertConfirm } from '~/hooks/useAlertConfirm'
import Swal from 'sweetalert2'
import moment from 'moment'
import InputTagMui from '~/components/InputTags/InputTagMui'
import { PricePolicy } from '~/types/PricePolicy.type'
import { PricePolicyService } from '~/services/pricepolicy.service'

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

const OrdersCreate = () => {
  const history = useHistory()
  const params: { id: string } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [isFetched, setIsFetched] = useState(false)
  const [isLoadingCreate, setIsLoadingCreate] = useState(false)
  const [listCustomer, setListCustomer] = useState<CustomerList[]>([])
  const [customerDetail, setCustomerDetail] = useState<Customer>()
  const [optionsProduct, setOptionsProduct] = useState([])
  const [optionsBranch, setOptionsBranch] = useState([])
  const [optionsShipper, setOptionsShipper] = useState([])
  const [optionsStaff, setOptionsStaff] = useState([])
  const [optionsPayment, setOptionsPayment] = useState([])
  const [optionsTag, setOptionsTag] = useState([])
  const [optionsProductVariant, setOptionsProductVariant] = useState([])
  const [valueCustomer, setValueCustomer] = useState<SelectProps>()
  const [selectedProduct, setSelectedProduct] = useState<Product>()
  const [selectedPayment, setSelectedPayment] = useState<SelectProps>()
  const [selectedStaff, setSelectedStaff] = useState<SelectProps>()
  const [selectedBranch, setSelectedBranch] = useState<SelectProps>()
  const [selectedShipper, setSelectedShipper] = useState<SelectProps>()
  const [note, setNote] = useState('')
  const [selectedTags, setSelectedTags] = useState<SelectProps[]>([])
  const [deliveryDate, setDeliveryDate] = useState('')
  const [productList, setProductList] = useState<OrderProduct[]>([])
  const [canEdit, setCanEdit] = useState(true)
  const [activeButton, setActiveButton] = useState<number>(1)
  const [productPurchaseList, setProductPurchaseList] = useState<ProductPurchase[]>([])
  const [tagList, setTagList] = useState<string[]>()

  const handleListTags = (value: string[]) => {
    setTagList(value)
  }

  const totalQuantity = productList.reduce((acc: number, item: any) => acc + parseInt(item.product_amount), 0)
  const totalAmount = productList.reduce((acc: number, item: any) => acc + item.product_amount * item.product_price, 0)
  const totalDiscount = productList.reduce(
    (acc: number, item: any) => acc + (item.product_amount * item.product_price * item.product_discount) / 100,
    0
  )
  const totalPayment = totalAmount - totalDiscount

  const dataOrder = {
    supplier_id: valueCustomer?.value,
    agency_branch_id: selectedBranch?.value,
    shipper_id: selectedShipper?.value,
    staff_id: selectedStaff?.value,
    order_delivery_date: deliveryDate,
    order_note: note,
    payment_id: selectedPayment?.value,
    tags: tagList,
    products: productList.map((product) => ({
      p_variant_id: product.product_variant_detail_id,
      unit: product.product_unit,
      amount: product.product_amount,
      price: product.product_price,
      discount: product.product_discount
    }))
  }

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
          const discount = row.values.product_discount

          const totalPrice = formatCurrency((amount * price * (100 - discount)) / 100)

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
      value: formatCurrency(totalDiscount)
    },
    {
      data: 'Tiền cần trả',
      value: formatCurrency(totalPayment),
      bold: true
    }
  ]

  const customPlaceholder = (value: string) => {
    return (
      <span className='flex-between'>
        <span>{value === 'Customer' ? 'Tìm theo tên khách hàng' : 'Tìm theo mã SKU hoặc tên sản phẩm'} </span>
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

  const getListBranch = useCallback(() => {
    AgencyBranchService.getListAgencyBranch().then((res) => {
      const data = res.data.data
      setOptionsBranch(
        data.map((branch: any) => ({
          label: branch.agency_branch_name,
          value: branch.id
        }))
      )
    })
  }, [])

  const getListTag = useCallback(() => {
    TagService.getListTag().then((response) => {
      const tagsList = response.data.data
      setOptionsTag(
        tagsList.map((tag: any) => ({
          label: tag.tag_title,
          value: tag.id
        }))
      )
    })
  }, [])

  const getListStaff = useCallback(() => {
    StaffService.getListStaff().then((res) => {
      const data = res.data.data
      setOptionsStaff(
        data.map((staff: any) => ({
          label: staff.staff_name,
          value: staff.staff_id
        }))
      )
    })
  }, [])

  const getListPayment = useCallback(() => {
    PaymentService.getAllPayment().then((res) => {
      const data = res.data.data
      setOptionsPayment(
        data.map((payment: any) => ({
          label: payment.payment_type,
          value: payment.id
        }))
      )
    })
  }, [])

  const getProductList = useCallback(async () => {
    try {
      const res = await ProductService.getListProduct()
      const result = res.data.data
      const options = result.map((product: Product) => ({
        label: `${product.product_SKU} - ${product.product_name}`,
        value: product.id
      }))
      setOptionsProduct(options)
    } catch (error) {
      console.log(error)
    }
  }, [])

  const getProductListPurchase = useCallback(async () => {
    try {
      const res = await ProductService.getListProductPurchase()
      const result = res.data.data
      setProductPurchaseList(result)
    } catch (error) {
      console.log(error)
    }
  }, [])

  const getProductDetail = useCallback(async (e: SingleValue<{ label: string; value: string }>) => {
    setSelectedProduct(undefined)
    try {
      if (e) {
        const res = await ProductService.getDetailProduct(e?.value)
        const dataProduct: any = res.data.data
        const options = dataProduct.productVariants.map((variant: ProductVariant) => ({
          label: variant.product_variant_name,
          value: variant.id
        }))
        setOptionsProductVariant(options)
        setSelectedProduct(res.data.data)
      }
    } catch (error) {
      console.log(error)
    }
  }, [])

  const getSellOrderDetail = useCallback(async () => {
    try {
      const res = await OrderService.getSellOrderDetail(params.id)
      const data = res.data.data
      setProductList(
        data.order_product_list.map((purchase: PurchaseOrder) => {
          return { ...purchase }
        })
      )
      if (data.order_status !== 'Tạo đơn') {
        setCanEdit(false)
      }
      setSelectedStaff({
        label: data.staff.name,
        value: data.staff.staff_id
      })
      setSelectedBranch({
        label: data.agency_branch.name,
        value: data.agency_branch.id
      })
      setValueCustomer({
        label: data.supplier.name,
        value: data.supplier.user_id
      })
      setSelectedTags(
        data.order_tags.map((tag: any) => ({
          label: tag.Tag.tag_title,
          value: tag.Tag.id
        }))
      )
      setSelectedPayment({
        label: data.payment.payment_type,
        value: data.payment.id
      })

      setDeliveryDate(moment(data.order_delivery_date).utcOffset(7).format('YYYY-MM-DD'))
      getCustomerDetail(data.supplier.user_id)
        .then(() => {
          setIsLoading(false)
          setIsFetched(true)
        })
        .catch(() => {
          setIsLoading(false)
        })
      setNote(data.order_note)
    } catch (error) {
      setIsLoading(false)
    }
  }, [params.id, getCustomerDetail])

  const selectedCustomer = useCallback(
    (e: SingleValue<{ label: string; value: string; idCustomer: string }>) => {
      if (e) {
        getCustomerDetail(e?.idCustomer)
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

  const selectedProductNew = useCallback(
    (e: any) => {
      const product = selectedProduct?.productVariants.find((item) => item.id === e.value)
      if (product) {
        setProductList([
          ...productList,
          {
            order_product_item_id: product?.id,
            product_amount: 1,
            product_discount: 0,
            product_price: 0,
            product_unit: 'Cái',
            product_variant_detail_SKU: product?.product_variant_SKU,
            product_variant_detail_id: product?.id,
            product_variant_detail_name: product.product_variant_name
          }
        ])
      }
    },
    [selectedProduct?.productVariants, productList]
  )

  const handleCreateBtn = () => {
    setIsLoadingCreate(true)

    OrderService.createSellOrder(dataOrder)
      .then(() => {
        setTimeout(() => {
          setIsLoadingCreate(false)
          handleAlertConfirm({
            text: 'Tạo đơn hàng thành công',
            icon: 'success',
            handleConfirmed: () => history.replace(`/app/orders`)
          })
        }, 1000)
      })
      .catch(() =>
        setTimeout(() => {
          Swal.fire('', 'Tạo đơn hàng thất bại', 'error')
          setIsLoadingCreate(false)
        }, 1000)
      )
  }

  useEffect(() => {
    if (params.id) {
      getSellOrderDetail()
    } else {
      setTimeout(() => {
        setIsLoading(false)
        setIsFetched(true)
      }, 1000)
    }

    getListCustomer()
    getProductList()
    getListShipper()
    getListBranch()
    getListStaff()
    getListPayment()
    getListTag()
    getProductListPurchase()
  }, [
    getSellOrderDetail,
    getListCustomer,
    getProductList,
    getListShipper,
    getListBranch,
    getListStaff,
    getListPayment,
    getListTag,
    getProductListPurchase,
    params.id
  ])

  if (isLoading)
    return (
      <>
        <Helmet>
          <title>{params.id ? 'Sửa đơn hàng' : 'Tạo đơn hàng'}</title>
        </Helmet>
        <PageLoader />
      </>
    )

  if (!isFetched) {
    return <Error errorCode='500' />
  }

  return (
    <React.Fragment>
      <div className='d-flex justify-content-between'>
        <BackPreviousPage
          text={params.id ? 'Quay lại chi tiết đơn hàng' : 'Quay lại danh sách đơn hàng'}
          path={params.id ? `/app/orders/detail/${params.id}` : '/app/orders/'}
        />
        <DropdownButton
          disabled={isLoadingCreate}
          id='create-order-dropdown'
          className={isLoadingCreate || params.id ? 'hide-arrow' : ''}
          title={
            isLoadingCreate ? (
              <span>
                <Spinner size='sm' className='mr-2' animation='border' />
                <span className={isLoadingCreate ? '' : 'mr-2'}>Đang tạo đơn...</span>
              </span>
            ) : (
              <span>
                <i className={params.id ? 'feather icon-save mr-2' : 'feather icon-plus-circle mr-2'} />
                <span className={params.id ? '' : 'mr-2'}>{params.id ? 'Lưu đơn hàng' : 'Tạo đơn hàng'}</span>
              </span>
            )
          }
        >
          <Dropdown.Item onClick={handleCreateBtn}>Tạo đơn</Dropdown.Item>
          {/* <Dropdown.Item>Tạo đơn và duyệt</Dropdown.Item> */}
        </DropdownButton>
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
                        onClick={() => {
                          setValueCustomer(undefined)
                          setCustomerDetail(undefined)
                        }}
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
                          defaultValue={valueCustomer}
                          options={listCustomer.map((e) => ({
                            label: `${e.customer_name} - ${e.customer_phone}`,
                            value: e.customer_id,
                            idCustomer: e.id
                          }))}
                          onChange={(e: any) => {
                            selectedCustomer(e)
                            setValueCustomer(e)
                          }}
                          placeholder={customPlaceholder('Customer')}
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
                      <span>Bán tại:</span>
                      <div style={{ width: '65%' }}>
                        <Select
                          menuPortalTarget={document.body}
                          menuPlacement='auto'
                          placeholder='Chọn chi nhánh'
                          defaultValue={selectedBranch}
                          options={optionsBranch}
                          onChange={(e: any) => setSelectedBranch(e)}
                        ></Select>
                      </div>
                    </div>
                    <div className='flex-between'>
                      <span>Bán bởi:</span>
                      <div style={{ width: '65%' }}>
                        <Select
                          name='staff'
                          menuPortalTarget={document.body}
                          menuPlacement='auto'
                          options={optionsStaff}
                          defaultValue={selectedStaff}
                          onChange={(e: any) => setSelectedStaff(e)}
                          placeholder={'Chọn nhân viên'}
                        ></Select>
                      </div>
                    </div>
                    <div className='flex-between'>
                      <span>Hẹn giao: </span>
                      <div style={{ width: '65%' }}>
                        <FormControl
                          type='date'
                          defaultValue={deliveryDate}
                          onChange={(e: any) => setDeliveryDate(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className='flex-between'>
                      <span>Mã đơn: </span>
                      <div style={{ width: '65%' }}>
                        <FormControl />
                      </div>
                    </div>
                    <div className='flex-between'>
                      <span style={{ width: '30%' }}>Thanh toán dự kiến: </span>
                      <div style={{ width: '65%' }}>
                        <Select
                          name='payment'
                          menuPortalTarget={document.body}
                          menuPlacement='auto'
                          options={optionsPayment}
                          defaultValue={selectedPayment}
                          placeholder={'Chọn phương thức'}
                          onChange={(e: any) => setSelectedPayment(e)}
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

              {selectedProduct && (
                <Select
                  className='mt-4'
                  options={optionsProductVariant}
                  onChange={(e: any) => {
                    selectedProductNew(e)
                  }}
                  placeholder='Chọn phiên bản sản phẩm'
                />
              )}
            </Card.Header>

            <Card.Body>
              {productList.length === 0 ? (
                <div
                  style={{ color: '#9d9d9d' }}
                  className='d-flex justify-content-center align-items-center py-5 flex-column'
                >
                  <TbPackage size={80} />
                  <span className='mt-3'>Đơn hàng chưa có sản phẩm nào</span>
                </div>
              ) : (
                <CustomTable
                  columns={columns}
                  data={productList}
                  handleRowClick={() => 1 == 1}
                  hiddenColumns={['selection', !canEdit && 'advance']}
                />
              )}
              <hr className='dashed-top' />
              <Row className='justify-content-between'>
                <Col lg={3}>
                  <p className='font-weight-bold'>Ghi chú đơn</p>
                  <FormControl
                    as='textarea'
                    rows={3}
                    defaultValue={note}
                    className='my-textarea'
                    placeholder='VD: Hàng tặng gói riêng'
                    onChange={(e: any) => setNote(e.target.value)}
                  />
                  <p className='font-weight-bold mt-2'>Tags</p>
                  <InputTagMui list={optionsTag} onChange={handleListTags} />

                  {/* <Select
                    options={optionsTag}
                    isMulti
                    placeholder='Chọn tags'
                    noOptionsMessage={() => 'Đã chọn hết tags'}
                    menuPlacement='top'
                    defaultValue={selectedTags}
                    loadingMessage={() => 'Đang tải dữ liệu ...'}
                    onChange={(e: any) => setSelectedTags(e)}
                  /> */}
                </Col>
                <Col lg={3}>
                  {totalProduct.map((total, index) => (
                    <span
                      key={`total_${index}`}
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
                    variant={`${index + 1 === activeButton ? 'primary' : 'outline-primary'}`}
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
                      placeholder='Chọn đối tác'
                      menuPlacement='auto'
                      className='ml-3 w-25'
                      defaultValue={selectedShipper}
                      onChange={(e: any) => setSelectedShipper(e)}
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

export default OrdersCreate
