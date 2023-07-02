import React, { useEffect, useState, useCallback } from 'react'
import { Row, Col, Card, FormControl, Button, CloseButton, FormGroup, FormLabel, Spinner } from 'react-bootstrap'
import Select, { SingleValue } from 'react-select'
import { TbPackage } from 'react-icons/tb'
import { FiTruck } from 'react-icons/fi'
import { SlSocialDropbox } from 'react-icons/sl'

import BackPreviousPage from '~/components/Button/BackPreviousPage'
import CustomerService from '~/services/customer.service'

import { Customer, CustomerList } from '~/types/Customer.type'
import ProductService from '~/services/product.service'
import { ProductSell } from '~/types/Product.type'
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
import { Link, useHistory, useParams } from 'react-router-dom'
import { PurchaseOrder } from '~/types/Order.type'
import { SelectProps } from '~/types/Select.type'
import { TagService } from '~/services/tag.service'
import { handleAlertConfirm } from '~/hooks/useAlertConfirm'
import Swal from 'sweetalert2'
import moment from 'moment'
import InputTagMui from '~/components/InputTags/InputTagMui'
import { PricePolicy } from '~/types/PricePolicy.type'
import { PricePolicyService } from '~/services/pricepolicy.service'
import DebtService from '~/services/debt.service'

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
  const [showLoader, setShowLoader] = useState(false)
  const [listCustomer, setListCustomer] = useState<CustomerList[]>([])
  const [customerDetail, setCustomerDetail] = useState<Customer>()
  const [optionsProduct, setOptionsProduct] = useState([])
  const [optionsBranch, setOptionsBranch] = useState([])
  const [optionsShipper, setOptionsShipper] = useState([])
  const [optionsStaff, setOptionsStaff] = useState([])
  const [optionsPayment, setOptionsPayment] = useState([])
  const [optionsTag, setOptionsTag] = useState([])
  const [valueCustomer, setValueCustomer] = useState<SelectProps>()
  const [selectedPayment, setSelectedPayment] = useState<SelectProps>()
  const [selectedStaff, setSelectedStaff] = useState<SelectProps>()
  const [selectedBranch, setSelectedBranch] = useState<SelectProps>()
  const [selectedShipper, setSelectedShipper] = useState<SelectProps>()
  const [note, setNote] = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [productList, setProductList] = useState<OrderProduct[]>([])
  const [canEdit, setCanEdit] = useState(true)
  const [activeButton, setActiveButton] = useState<number>(1)
  const [dataDebt, setDataDebt] = useState('0')
  const [tagList, setTagList] = useState<string[]>()
  const [newTags, setNewTags] = useState<any>()
  const [productsList, setProductsList] = useState<ProductSell[]>([])
  const [priceValueID, setPriceValueID] = useState()
  const [tagsDetail, setTagsDetail] = useState<{ label: string; value: string }[]>([])

  const handleListTags = useCallback((value: string[]) => {
    setTagList(value)
  }, [])

  const handleListNewTags = useCallback((value: any) => {
    setNewTags(value)
  }, [])

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
    products: productList.map((product) => ({
      p_variant_id: product.product_variant_detail_id,
      unit: product.product_unit,
      amount: product.product_amount,
      price: product.product_price,
      discount: product.product_discount
    }))
  }

  const dataDebtSupplier = [
    {
      data: 'Nợ phải thu',
      value: dataDebt
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
            <>
              <FormControl
                value={value}
                type='number'
                className='text-center no-spin'
                onChange={(e) => handleProductTable(row.index, 'product_price', e.target.value)}
              />
            </>
          ) : (
            formatCurrency(value)
          )
      },
      {
        Header: 'Chiết khấu(%)',
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
        <span>
          {value === 'Customer' ? 'Tìm theo tên hoặc số điện thoại khách hàng' : 'Tìm theo mã SKU hoặc tên sản phẩm'}{' '}
        </span>
        <i className='feather icon-search'></i>
      </span>
    )
  }

  const getDataDebt = useCallback((id: string) => {
    DebtService.getTotal(id).then((res) => {
      const debtValue = res.data.data.debt_amount
      setDataDebt(formatCurrency(Math.abs(debtValue)))
    })
  }, [])

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

  const getListPrice = useCallback(async () => {
    try {
      const res = await PricePolicyService.getListPrice()
      setPriceValueID(res.data.data.find((item: PricePolicy) => item.isSellDefault === true)?.id)
    } catch (error) {
      console.log(error)
    }
  }, [])

  const getProductList = useCallback(async () => {
    try {
      if (priceValueID) {
        const res = await ProductService.getListProductSell(priceValueID)
        const result = res.data.data
        setProductsList(result)
        const options = result.map((product: ProductSell) => ({
          label: (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span>{`${product.product.sku} - ${product.product.name}`}</span>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ textAlign: 'end' }}>
                  Giá nhập: <span>{formatCurrency(product.price.price_value)}</span>
                </span>
                <div>
                  <span>
                    Tồn:{' '}
                    <span style={{ color: `${product.available_quantity === 0 ? 'red' : 'blue'}` }}>
                      {product.available_quantity}
                    </span>
                  </span>
                  {` `}|{` `}
                  <span>
                    Có thể bán:{' '}
                    <span style={{ color: `${product.available_to_sell_quantity === 0 ? 'red' : 'blue'}` }}>
                      {product.available_to_sell_quantity}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          ),
          text: `${product.product.sku}${product.product.name}`,
          value: product.id
        }))
        setOptionsProduct(options)
      }
    } catch (error) {
      console.log(error)
    }
  }, [priceValueID])

  const getSellOrderDetail = useCallback(async () => {
    try {
      const res = await OrderService.getSellOrderDetail(params.id)
      const data = res.data.data
      setProductList(
        data.order_product_list.map((purchase: PurchaseOrder) => {
          return { ...purchase }
        })
      )
      if (data.order_status !== 'Đặt hàng') {
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
      setSelectedShipper({
        label: data.shipper.shipper_unit,
        value: data.shipper.id
      })
      setValueCustomer({
        label: data.supplier.name,
        value: data.supplier.user_id
      })
      setTagsDetail(
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
      getDataDebt(data.supplier.user_id)
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
  }, [params.id, getCustomerDetail, getDataDebt])

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
      const product = productsList?.find((item: { id: string }) => item.id === e.value)

      if (product) {
        setProductList([
          ...productList,
          {
            order_product_item_id: product?.id,
            product_amount: 1,
            product_discount: product.product_discount,
            product_price: product?.price.price_value,
            product_unit: 'Cái',
            product_variant_detail_SKU: product?.product.sku,
            product_variant_detail_id: product?.product.product_variant_id,
            product_variant_detail_name: product.product.name
          }
        ])
      }
    },

    [productList, productsList]
  )

  const filterOption = (option: any, inputValue: any) => {
    return option.data.text.toLowerCase().includes(inputValue.toLowerCase())
  }

  const handleSaveBtn = async () => {
    setShowLoader(true)
    const data = {
      tags: newTags
    }

    const res = await TagService.createTag(data)

    if (res.data.message === 'Success' && newTags) {
      const res = await TagService.getListTag()
      const arr: { tag_title: string; id: string }[] = res.data.data
      const newArr = arr.filter((item1) => newTags.some((item2: any) => item2.tag_title === item1.tag_title))
      const arrTag = tagList?.concat(newArr.map((e) => e.id))

      const dataUpdate = {
        ...dataOrder,
        tags: arrTag,
        agency_branch_id: undefined,
        shipper_id: undefined,
        payment_id: undefined
      }
      delete dataUpdate.agency_branch_id
      delete dataUpdate.shipper_id
      delete dataUpdate.payment_id

      console.log(dataUpdate)

      OrderService.updateOrderDetail(params.id, dataUpdate)
        .then(() => {
          setTimeout(() => {
            setShowLoader(false)
            handleAlertConfirm({
              text: 'Lưu đơn hàng thành công',
              icon: 'success',
              handleConfirmed: () => history.replace(`/app/orders/detail/${params.id}`)
            })
          }, 1000)
        })
        .catch(() =>
          setTimeout(() => {
            Swal.fire('', 'Lưu đơn hàng thất bại', 'error')
            setShowLoader(false)
          }, 1000)
        )
    }
  }

  const handleCreateBtn = async () => {
    setShowLoader(true)
    const data = {
      tags: newTags
    }

    const res = await TagService.createTag(data)

    if (res.data.message === 'Success' && newTags) {
      const res = await TagService.getListTag()
      const arr: { tag_title: string; id: string }[] = res.data.data
      const newArr = arr.filter((item1) => newTags.some((item2: any) => item2.tag_title === item1.tag_title))
      const arrTag = tagList?.concat(newArr.map((e) => e.id))

      const dataSubmit = { ...dataOrder, tags: arrTag }

      OrderService.createSellOrder(dataSubmit)
        .then(() => {
          setTimeout(() => {
            setShowLoader(false)
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
            setShowLoader(false)
          }, 1000)
        )
    }
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
    getListPrice()
  }, [
    getSellOrderDetail,
    getListCustomer,
    getProductList,
    getListShipper,
    getListBranch,
    getListStaff,
    getListPayment,
    getListTag,
    getListPrice,
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

        <Button className='m-0 mb-3' disabled={showLoader} onClick={params.id ? handleSaveBtn : handleCreateBtn}>
          {showLoader ? (
            <span>
              <Spinner size='sm' className='mr-2' animation='border' />
              <span className={showLoader ? '' : 'mr-2'}>{params.id ? 'Đang lưu...' : 'Đang tạo đơn...'}</span>
            </span>
          ) : (
            <span>
              <i className={params.id ? 'feather icon-save mr-2' : 'feather icon-plus-circle mr-2'} />
              <span className={params.id ? '' : 'mr-2'}>{params.id ? 'Lưu đơn hàng' : 'Tạo đơn hàng'}</span>
            </span>
          )}
        </Button>
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
                      <Link
                        to={`/app/customers/detail/${customerDetail.id}`}
                        style={{ fontSize: '17px' }}
                        className='mr-1 text-click'
                      >
                        {customerDetail.customer_name}
                      </Link>
                      <span style={{ fontSize: '17px' }} className='ml-1'>
                        - {customerDetail.customer_phone}{' '}
                      </span>
                      {canEdit && (
                        <CloseButton
                          style={{ float: 'initial' }}
                          className='m-0 ml-2'
                          onClick={() => {
                            setValueCustomer(undefined)
                            setCustomerDetail(undefined)
                          }}
                        />
                      )}
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
                              <span className='text-c-red font-weight-bold'>{debtSupplier.value}</span>
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
                            getDataDebt(e.idCustomer)
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
                          isDisabled={!canEdit}
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
                          isDisabled={!canEdit}
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
                          disabled={!canEdit}
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
                          isDisabled={!canEdit}
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
              {canEdit && (
                <Select
                  className='mt-4'
                  options={optionsProduct}
                  onChange={(e: any) => {
                    selectedProductNew(e)
                  }}
                  placeholder={customPlaceholder('Product')}
                  filterOption={filterOption}
                />
              )}

              {/* {selectedProduct && (
                <Select
                  className='mt-4'
                  options={optionsProductVariant}
                  onChange={(e: any) => {
                    selectedProductNew(e)
                  }}
                  placeholder='Chọn phiên bản sản phẩm'
                />
              )} */}
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
                  <InputTagMui
                    list={optionsTag}
                    onChange={handleListTags}
                    onChangeNewTags={handleListNewTags}
                    position='top'
                    tagsDetail={tagsDetail}
                  />
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
                      isDisabled={!canEdit}
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
