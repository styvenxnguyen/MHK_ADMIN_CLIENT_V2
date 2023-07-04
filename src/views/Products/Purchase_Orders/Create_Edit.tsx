import React, { useCallback, useEffect, useState } from 'react'
import { Button, Card, Col, FormControl, Row } from 'react-bootstrap'
import { Link, useHistory, useParams } from 'react-router-dom'
import Select from 'react-select'
import { TbPackage } from 'react-icons/tb'

import BackPreviousPage from '~/components/Button/BackPreviousPage'
import CustomTable from '~/components/Table/CustomTable'
import { formatCurrency } from '~/utils/common'

import OrderService from '~/services/order.service'
import StaffService from '~/services/staff.service'
import AgencyBranchService from '~/services/agencybranch.service'
import { AgencyBranch } from '~/types/AgencyBranch.type'
import { PurchaseOrder } from '~/types/Order.type'
import { OrderProduct } from '~/types/OrderProduct.type'
import { Staff } from '~/types/Staff.type'
import SupplierService from '~/services/supplier.service'
import { SupplierRes } from '~/types/Supplier.type'
import { Helmet } from 'react-helmet'
import PageLoader from '~/components/Loader/PageLoader'
import Error from '~/views/Errors'
import { TagService } from '~/services/tag.service'
import ProductService from '~/services/product.service'
import { ProductPurchase } from '~/types/Product.type'
import { handleAlertConfirm } from '~/hooks/useAlertConfirm'
import { ButtonLoading } from '~/components/Button/LoadingButton'
import Swal from 'sweetalert2'
import { SelectProps } from '~/types/Select.type'
import moment from 'moment'
import InputTagMui from '~/components/InputTags/InputTagMui'
import DebtService from '~/services/debt.service'

const CEPurchaseOrder = () => {
  const history = useHistory()
  const params: { id: string } = useParams()
  const [purchaseDetail, setPurchaseDetail] = useState<PurchaseOrder>()
  const [isLoading, setIsLoading] = useState(true)
  const [isFetched, setIsFetched] = useState(false)
  const [isLoadingSave, setIsLoadingSave] = useState(false)
  const [isLoadingCreate, setIsLoadingCreate] = useState(false)
  const [isLoadingSupplier, setIsLoadingSupplier] = useState(false)
  const [productList, setProductList] = useState<OrderProduct[]>([])
  const [dataSupplier, setDataSupplier] = useState<SupplierRes>()
  const [optionsStaff, setOptionsStaff] = useState([])
  const [optionsTag, setOptionsTag] = useState([])
  const [optionsProduct, setOptionsProduct] = useState([])
  const [optionsBranch, setOptionsBranch] = useState([])
  const [optionsSupplier, setOptionsSupplier] = useState([])
  const [idSelectedSupplier, setIdSelectedSupplier] = useState('')
  const [selectedStaff, setSelectedStaff] = useState<SelectProps>()
  const [selectedBranch, setSelectedBranch] = useState<SelectProps>()
  const [deliveryDate, setDeliveryDate] = useState('')
  const [note, setNote] = useState('')
  const [canEdit, setCanEdit] = useState(true)
  const loadingMessage = () => 'Đang tải dữ liệu...'
  const [valueTags, setValueTags] = useState<string[]>([])
  const [newTags, setNewTags] = useState<any>()
  const [productsList, setProductsList] = useState<any>([])
  const [dataDebt, setDataDebt] = useState('0')
  const [tagsDetail, setTagsDetail] = useState<{ label: string; value: string }[]>([])

  const totalQuantity = productList.reduce((acc: number, item: any) => acc + parseInt(item.product_amount), 0)
  const totalAmount = productList.reduce((acc: number, item: any) => acc + item.product_amount * item.product_price, 0)
  const totalDiscount = productList.reduce(
    (acc: number, item: any) => acc + (item.product_amount * item.product_price * item.product_discount) / 100,
    0
  )
  const totalPayment = totalAmount - totalDiscount

  const handleListNewTags = useCallback((value: any) => {
    setNewTags(value)
  }, [])

  const dataPurchaseOrder = {
    supplier_id: idSelectedSupplier,
    agency_branch_id: selectedBranch?.value || '',
    shipper_id: '7cfb56ef-aa9e-468e-a7b2-874f046dfec8',
    payment_id: '5f81f1a2-1144-43d1-a5c8-6caa6dbad03f',
    staff_id: selectedStaff?.value || '',
    order_delivery_date: deliveryDate,
    order_note: note,
    products: productList.map((product) => ({
      p_variant_id: product.product_variant_detail_id,
      unit: product.product_unit,
      amount: parseInt(product.product_amount),
      price: parseInt(product.product_price),
      discount: parseInt(product.product_discount)
    }))
  }

  const dataDebtSupplier = [
    {
      data: 'Công nợ',
      value: dataDebt
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
      value: formatCurrency(totalDiscount)
    },
    {
      data: 'Tiền cần trả',
      value: formatCurrency(totalPayment),
      bold: true
    }
  ]

  const changeTags = useCallback((value: string[]) => {
    setValueTags(value)
  }, [])

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
        Cell: ({ row }: any) => row.index + 1
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
            <span>
              {value}% ({formatCurrency((row.values.product_amount * row.values.product_price * value) / 100)})
            </span>
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

  const customPlaceholder = (value: string) => {
    return (
      <span className='flex-between'>
        <span>
          {value === 'Supplier' ? 'Tìm theo tên hoặc số điện thoại nhà cung cấp' : 'Tìm theo mã SKU hoặc tên sản phẩm'}{' '}
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

  const getStaffList = useCallback(async () => {
    try {
      const res = await StaffService.getListStaff()
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
        label: supplier.customer_name + ' - ' + supplier.customer_phone,
        value: supplier.customer_id,
        id_supplier: supplier.id
      }))
      setOptionsSupplier(options)
    } catch (error) {
      console.log(error)
    }
  }, [])

  const getSupplierDetail = useCallback(async (id: string) => {
    setIsLoadingSupplier(true)
    try {
      const res = await SupplierService.getDetailSupplier(id)
      setDataSupplier(res.data.data)
      setIsLoadingSupplier(false)
    } catch (error) {
      setIsLoadingSupplier(false)
    }
  }, [])

  const getProductList = useCallback(async () => {
    try {
      const res = await ProductService.getListProductPurchase()
      const result = res.data.data
      setProductsList(result.map((e: ProductPurchase) => e.product_variant))
      const options = result.map((product: ProductPurchase) => ({
        label: (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span>{`${product.product_variant.sku} - ${product.product_variant.name}`}</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ textAlign: 'end' }}>
                Giá nhập: <span>{formatCurrency(parseInt(product.product_variant.price_sell))}</span>
              </span>
              <div>
                <span>
                  Tồn:{' '}
                  <span style={{ color: `${product.product_variant.amount.inStock === 0 ? 'red' : 'blue'}` }}>
                    {product.product_variant.amount.inStock}
                  </span>
                </span>
                {` `}|{` `}
                <span>
                  Có thể bán:{' '}
                  <span style={{ color: `${product.product_variant.amount.inStock === 0 ? 'red' : 'blue'}` }}>
                    {product.product_variant.amount.available_to_sell}
                  </span>
                </span>
              </div>
            </div>
          </div>
        ),
        value: product.product_variant.id,
        text: `${product.product_variant.sku}${product.product_variant.name}`
      }))
      setOptionsProduct(options)
    } catch (error) {
      console.log(error)
    }
  }, [])

  const filterOption = (option: any, inputValue: any) => {
    return option.data.text.toLowerCase().includes(inputValue.toLowerCase())
  }

  const getAgencyBranch = useCallback(async () => {
    try {
      const res = await AgencyBranchService.getListAgencyBranch()
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

  const getTagList = useCallback(() => {
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

  const getPurchaseOrderDetail = useCallback(() => {
    OrderService.getPurchaseOrderDetail(params.id)
      .then((res) => {
        const data = res.data.data
        setPurchaseDetail(data)
        setProductList(
          data.order_product_list.map((purchase: PurchaseOrder) => {
            return { ...purchase }
          })
        )
        if (data.order_status !== 'Tạo đơn') {
          setCanEdit(false)
        }
        setIdSelectedSupplier(data.supplier.id)
        setSelectedStaff({
          label: data.staff.name,
          value: data.staff.id
        })
        setSelectedBranch({
          label: data.agency_branch.name,
          value: data.agency_branch.id
        })
        setDeliveryDate(moment(data.order_delivery_date).utcOffset(7).format('YYYY-MM-DD'))
        setTagsDetail(
          data.order_tags.map((tag: any) => ({
            label: tag.Tag.tag_title,
            value: tag.Tag.id
          }))
        )
        setNote(data.order_note)
        getDataDebt(data.supplier.user_id)
        setIsLoading(false)
        setIsFetched(true)
      })
      .catch(() => {
        setIsLoading(false)
      })
  }, [params.id, getDataDebt])

  const handleSaveBtn = async () => {
    setIsLoadingSave(true)

    const dataTags = {
      tags: newTags
    }
    const res = await TagService.createTag(dataTags)
    if (res.data.message === 'Success' && newTags) {
      const res = await TagService.getListTag()
      const arr: { tag_title: string; id: string }[] = res.data.data
      const newArr = arr.filter((item1) => newTags.some((item2: any) => item2.tag_title === item1.tag_title))
      const arrTag = valueTags?.concat(newArr.map((e) => e.id))

      const data = {
        ...dataPurchaseOrder,
        tags: arrTag,
        shipper_id: undefined,
        payment_id: undefined,
        agency_branch_id: undefined
      }
      delete data.agency_branch_id
      delete data.payment_id
      delete data.shipper_id
      OrderService.updateOrderDetail(params.id, data)
        .then(() => {
          setTimeout(() => {
            TagService.createTag(dataTags)

            setIsLoadingSave(false)
            handleAlertConfirm({
              text: 'Lưu đơn hàng nhập thành công',
              icon: 'success',
              handleConfirmed: () => history.replace(`/app/purchase_orders/detail/${params.id}`)
            })
          }, 1000)
        })
        .catch(() =>
          setTimeout(() => {
            Swal.fire('', 'Lưu đơn hàng nhập thất bại', 'error')
            setIsLoadingSave(false)
          }, 1000)
        )
    }
  }

  const handleCreateBtn = async () => {
    setIsLoadingCreate(true)

    const data = {
      tags: newTags
    }

    const res = await TagService.createTag(data)

    if (res.data.message === 'Success' && newTags) {
      const res = await TagService.getListTag()
      const arr: { tag_title: string; id: string }[] = res.data.data
      const newArr = arr.filter((item1) => newTags.some((item2: any) => item2.tag_title === item1.tag_title))
      const arrTag = valueTags?.concat(newArr.map((e) => e.id))

      const data = { ...dataPurchaseOrder, tags: arrTag }
      OrderService.createPurchaseOrder(data)
        .then(() => {
          setTimeout(() => {
            setIsLoadingCreate(false)
            handleAlertConfirm({
              text: 'Tạo đơn hàng nhập thành công',
              icon: 'success',
              handleConfirmed: () => history.replace(`/app/purchase_orders`)
            })
          }, 1000)
        })
        .catch(() =>
          setTimeout(() => {
            Swal.fire('', 'Tạo đơn hàng nhập thất bại', 'error')
            setIsLoadingCreate(false)
          }, 1000)
        )
    }
  }

  const selectedProductNew = useCallback(
    (e: any) => {
      const product = productsList?.find((item: { id: string }) => item.id === e.value)
      if (product) {
        setProductList([
          ...productList,
          {
            order_product_item_id: product?.id,
            product_amount: 1,
            product_discount: 0,
            product_price: product?.price_sell,
            product_unit: 'Cái',
            product_variant_detail_SKU: product?.sku,
            product_variant_detail_id: product?.id,
            product_variant_detail_name: product?.name
          }
        ])
      }
    },
    [productsList, productList]
  )

  useEffect(() => {
    if (params.id) {
      getPurchaseOrderDetail()
    } else {
      setTimeout(() => {
        setIsLoading(false)
        setIsFetched(true)
      }, 1000)
    }
    getStaffList()
    getAgencyBranch()
    getSupplierList()
    getProductList()
    getTagList()
  }, [getPurchaseOrderDetail, getStaffList, getAgencyBranch, getSupplierList, getProductList, getTagList, params.id])

  useEffect(() => {
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

  if (isLoading)
    return (
      <>
        <Helmet>
          <title>{params.id ? 'Sửa đơn nhập hàng' : 'Tạo đơn nhập hàng'}</title>
        </Helmet>
        <PageLoader />
      </>
    )

  if (!isFetched) {
    return <Error errorCode='500' />
  }

  return (
    <div>
      <div className='flex-between'>
        <BackPreviousPage
          path={params.id ? `/app/purchase_orders/detail/${params.id}` : '/app/purchase_orders/'}
          text={params.id ? 'Quay lại chi tiết đơn hàng nhập' : 'Quay lại danh sách đơn hàng nhập'}
        />
        {params.id && (
          <h4>
            Sửa đơn nhập <span className='font-weight-bold'>{purchaseDetail?.order_code}</span>
          </h4>
        )}
        <span>
          <ButtonLoading
            className='m-0 mb-3'
            loading={isLoadingSave || isLoadingCreate}
            disabled={isLoadingSave || isLoadingCreate}
            text={
              <>
                <i className={params.id ? 'feather icon-save' : 'feather icon-plus-circle'} />
                {params.id ? 'Lưu' : 'Tạo đơn'}
              </>
            }
            onSubmit={params.id ? handleSaveBtn : handleCreateBtn}
          />
        </span>
      </div>
      <Row className='text-normal'>
        <Col lg={8}>
          <Card style={{ height: '95%' }}>
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
                        <Link className='text-click' to={`/app/supplier/detail/${purchaseDetail?.supplier?.user_id}`}>
                          {purchaseDetail?.supplier && purchaseDetail.supplier.name}
                        </Link>
                      </p>
                      <p>Số điện thoại : {purchaseDetail?.supplier && purchaseDetail.supplier.phone}</p>

                      {purchaseDetail?.supplier && purchaseDetail.supplier.addresses ? (
                        <p>
                          Địa chỉ :
                          <span className='ml-2' style={{ fontWeight: '500' }}>
                            {purchaseDetail.supplier.addresses[0].user_specific_address}
                          </span>
                        </p>
                      ) : (
                        'Chưa cập nhật địa chỉ'
                      )}
                    </div>
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
              ) : (
                <>
                  <Select
                    className='mb-4'
                    options={optionsSupplier}
                    onChange={(e: any) => {
                      setIdSelectedSupplier(e.value)
                      getSupplierDetail(e.id_supplier)
                      getDataDebt(e.id_supplier)
                    }}
                    placeholder={customPlaceholder('Supplier')}
                  />
                  {dataSupplier ? (
                    <>
                      {isLoadingSupplier ? (
                        <div>
                          <PageLoader option='100%' className='d-flex' />
                        </div>
                      ) : (
                        <Row>
                          <Col lg={6}>
                            <div className='font-weight-bold'>
                              <p>
                                <Link className='text-click' to={`/app/suppliers/detail/${dataSupplier.id}`}>
                                  {dataSupplier.customer_name}
                                </Link>
                              </p>
                              <p>Số điện thoại : {dataSupplier.customer_phone}</p>

                              {dataSupplier.address_list.length > 0 ? (
                                <p>
                                  Địa chỉ :
                                  <span className='ml-2' style={{ fontWeight: '500' }}>
                                    {dataSupplier.address_list[0].user_specific_address}
                                  </span>
                                </p>
                              ) : (
                                'Chưa cập nhật địa chỉ'
                              )}
                            </div>
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
                      )}
                    </>
                  ) : (
                    <>
                      <p
                        style={{ color: '#bfb2b2', height: '75%' }}
                        className='d-flex justify-content-center align-items-center'
                      >
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
          <Card style={{ height: '95%' }}>
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
                      placeholder='Chọn chi nhánh'
                      isDisabled={!!params.id}
                      defaultValue={selectedBranch}
                      options={optionsBranch}
                      loadingMessage={loadingMessage}
                      onChange={(e: any) => setSelectedBranch(e)}
                    ></Select>
                  </div>
                </div>
                <div className='flex-between'>
                  <span>Nhân viên:</span>
                  <div style={{ width: '65%' }}>
                    <Select
                      name='staff'
                      options={optionsStaff}
                      isDisabled={!canEdit}
                      loadingMessage={loadingMessage}
                      defaultValue={selectedStaff}
                      onChange={(e: any) => {
                        setSelectedStaff(e)
                      }}
                      placeholder={'Chọn nhân viên'}
                    ></Select>
                  </div>
                </div>
                <div className='flex-between'>
                  <span>Ngày hẹn giao:</span>
                  <div style={{ width: '65%' }}>
                    <FormControl
                      type='date'
                      defaultValue={deliveryDate}
                      onChange={(e: any) => setDeliveryDate(e.target.value)}
                      disabled={!canEdit}
                    />
                  </div>
                </div>
                <div className='flex-between'>
                  <span>Mã tham chiếu : </span>
                  <div style={{ width: '65%' }}>
                    <FormControl />
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
                    onChange={changeTags}
                    list={optionsTag}
                    onChangeNewTags={handleListNewTags}
                    tagsDetail={tagsDetail}
                    position='top'
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
      </Row>
    </div>
  )
}

export default CEPurchaseOrder
