import React, { useCallback, useEffect, useState } from 'react'
import { Button, Card, Col, FormControl, Row } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import Select from 'react-select'
import { TbPackage } from 'react-icons/tb'

import BackPreviousPage from '~/components/Button/BackPreviousPage'
import CustomTable from '~/components/Table/CustomTable'
import { formatCurrency } from '~/utils/common'

import OrderService from '~/services/order.service'
import StaffService from '~/services/staff.service'
import AgencyBranchService from '~/services/agencybranch.service'
import { AgencyBranch } from '~/types/AgencyBranch.type'
import { PurchaseOrder } from '~/types/PurchaseOrder.type'
import { OrderProduct } from '~/types/OrderProduct.type'
import { Staff } from '~/types/Staff.type'
import SupplierService from '~/services/supplier.service'
import { SupplierRes } from '~/types/Supplier.type'
import { Helmet } from 'react-helmet'
import PageLoader from '~/components/Loader/PageLoader'
import Error from '~/views/Errors'
import { TagService } from '~/services/tag.service'
import ProductService from '~/services/product.service'
import { Product, ProductVariant } from '~/types/Product.type'

const CEPurchaseOrder = () => {
  const params: { id: string } = useParams()
  const [purchaseDetail, setPurchaseDetail] = useState<PurchaseOrder>()
  const [isLoading, setIsLoading] = useState(true)
  const [isFetched, setIsFetched] = useState(false)
  const [isLoadingSupplier, setIsLoadingSupplier] = useState(false)
  const [productList, setProductList] = useState<OrderProduct[]>([])
  const [optionsStaff, setOptionsStaff] = useState([])
  const [optionsTag, setOptionsTag] = useState([])
  const [optionsProduct, setOptionsProduct] = useState([])
  const [optionsBranch, setOptionsBranch] = useState([])
  const [optionsSupplier, setOptionsSupplier] = useState([])
  const [selectedProduct, setSelectedProduct] = useState<Product>()
  const [optionsProductVariant, setOptionsProductVariant] = useState([])
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierRes>()
  const loadingMessage = () => 'Đang tải dữ liệu...'

  const totalQuantity = productList.reduce((acc: number, item: any) => acc + parseInt(item.product_amount), 0)
  const totalAmount = productList.reduce((acc: number, item: any) => acc + item.product_amount * item.product_price, 0)
  const totalDiscount = productList.reduce((acc: number, item: any) => acc + parseInt(item.product_discount), 0)
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
        Cell: ({ row, value }: any) => (
          <FormControl
            className='text-center'
            type='number'
            min={1}
            value={value}
            onChange={(e) => handleProductTable(row.index, 'product_amount', e.target.value)}
          />
        )
      },
      {
        Header: 'Giá sản phẩm',
        accessor: 'product_price',
        Cell: ({ row, value }: any) => (
          <FormControl
            value={value}
            className='text-center'
            onChange={(e) => handleProductTable(row.index, 'product_price', e.target.value)}
          />
        )
      },
      {
        Header: 'Chiết khấu',
        accessor: 'product_discount',
        Cell: ({ row, value }: any) => (
          <FormControl
            value={value}
            className='text-center'
            onChange={(e) => handleProductTable(row.index, 'product_discount', e.target.value)}
          />
        )
      },
      {
        Header: 'Đơn vị',
        accessor: 'product_unit',
        Cell: ({ row, value }: any) => (
          <FormControl
            value={value}
            className='text-center'
            onChange={(e) => handleProductTable(row.index, 'product_unit', e.target.value)}
          />
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
        <span>{value === 'Supplier' ? 'Tìm theo tên, SĐT, mã nhà cung cấp...(F4)' : 'Tìm theo tên sản phẩm'} </span>
        <i className='feather icon-search'></i>
      </span>
    )
  }

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
        label: supplier.customer_name,
        value: supplier.id
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
      setSelectedSupplier(res.data.data)
      setIsLoadingSupplier(false)
    } catch (error) {
      setIsLoadingSupplier(false)
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

  const getProductDetail = useCallback(async (id: string) => {
    try {
      const res = await ProductService.getDetailProduct(id)
      const dataProduct: any = res.data.data
      setSelectedProduct(dataProduct)
      const options = dataProduct.productVariants.map((variant: ProductVariant) => ({
        label: variant.product_variant_name,
        value: variant.id
      }))
      setOptionsProductVariant(options)
    } catch (error) {
      console.log(error)
    }
  }, [])

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

  const getPurchaseOrderDetail = useCallback(async () => {
    try {
      const res = await OrderService.getPurchaseOrderDetail(params.id)
      const data = res.data.data
      setPurchaseDetail(data)
      setProductList(
        data.order_product_list.map((purchase: PurchaseOrder) => {
          return { ...purchase }
        })
      )
      setIsLoading(false)
      setIsFetched(true)
    } catch (error) {
      setIsLoading(false)
    }
  }, [params.id])

  const updatedPurchaseOrder = useCallback(async () => {
    try {
      const data: PurchaseOrder = {}
      console.log(data)
      // await OrderService.updatedPurchaseOrderDetail(params.id, data)
    } catch (error) {
      console.log(error)
    }
  }, [])

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
  }, [getPurchaseOrderDetail, getStaffList, getAgencyBranch, getSupplierList, getProductList, params.id])

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
          <Button className='m-0 mb-3 mr-2' variant='secondary' onClick={updatedPurchaseOrder}>
            <i className={params.id ? 'feather icon-save' : 'feather icon-plus-circle'} />
            {params.id ? 'Lưu' : 'Tạo đơn'}
          </Button>
          <Button className='m-0 mb-3'>
            <i className={params.id ? 'feather icon-arrow-up-circle' : 'feather icon-upload'} />
            {params.id ? 'Lưu và nhập đơn' : 'Tạo và nhập đơn'}
          </Button>
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
                  <Select
                    className='mb-4'
                    options={optionsSupplier}
                    onChange={(e: any) => {
                      getSupplierDetail(e.value)
                    }}
                    placeholder={customPlaceholder('Supplier')}
                  />
                  {selectedSupplier ? (
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
                      placeholder={
                        purchaseDetail?.agency_branch?.name ? purchaseDetail.agency_branch?.name : 'Chọn chi nhánh'
                      }
                      isDisabled={!!params.id}
                      options={optionsBranch}
                      loadingMessage={loadingMessage}
                    ></Select>
                  </div>
                </div>
                <div className='flex-between'>
                  <span>Nhân viên:</span>
                  <div style={{ width: '65%' }}>
                    <Select
                      name='staff'
                      options={optionsStaff}
                      loadingMessage={loadingMessage}
                      placeholder={purchaseDetail?.staff ? purchaseDetail.staff.name : 'Chọn nhân viên'}
                    ></Select>
                  </div>
                </div>
                <div className='flex-between'>
                  <span>Ngày hẹn giao:</span>
                  <div style={{ width: '65%' }}>
                    <FormControl type='date' />
                  </div>
                </div>
                <div className='flex-between'>
                  <span>Mã tham chiếu : </span>
                  <div style={{ width: '65%' }}>
                    <FormControl />
                  </div>
                </div>
                <div className='flex-between'>
                  <span>Mã đơn : </span>
                  <div style={{ width: '65%' }}>
                    <FormControl disabled />
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
              <Select
                className='mt-4'
                options={optionsProduct}
                onChange={(e: any) => {
                  getProductDetail(e.value)
                }}
                placeholder={customPlaceholder('Product')}
              />
              {selectedProduct && (
                <Select
                  className='mt-4'
                  options={optionsProductVariant}
                  onChange={(e: any) => {
                    console.log('Hello' + e.value)
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
                <CustomTable columns={columns} data={productList} handleRowClick={{}} hiddenColumns={['selection']} />
              )}

              <hr className='dashed-top' />
              <Row className='justify-content-between'>
                <Col lg={3}>
                  <p className='font-weight-bold'>Ghi chú đơn</p>
                  <FormControl as='textarea' rows={3} className='my-textarea' placeholder='VD: Hàng tặng gói riêng' />
                  <p className='font-weight-bold mt-2'>Tags</p>

                  <Select
                    options={optionsTag}
                    isMulti
                    placeholder='Chọn tags'
                    noOptionsMessage={() => 'Đã chọn hết tags'}
                    menuPlacement='top'
                    loadingMessage={loadingMessage}
                  />
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

export default CEPurchaseOrder
