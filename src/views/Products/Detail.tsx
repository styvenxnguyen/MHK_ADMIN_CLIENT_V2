import React, { useEffect, useState, useCallback } from 'react'
import moment from 'moment'
import { Row, Col, Card, Form, FormLabel, FormGroup, FormCheck } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import PageLoader from '~/components/Loader/PageLoader'
import Error from '../Errors'
import { ButtonLoading } from '~/components/Button/LoadingButton'
import ProductService from '~/services/product.service'
import { Product, ProductVariant } from '~/types/Product.type'
import Select from 'react-select'
import { formatCurrency } from '~/utils/common'
import BackPreviousPage from '~/components/Button/BackPreviousPage'

// interface NewItem {
//   id: string
//   value: string
//   content: string
// }

const ProductDetails = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isFetched, setIsFetched] = useState(true)
  const [productDetail, setProductDetail] = useState<Product>()
  const [optionSelected, setOptionSelected] = useState([])
  const [selectedProduct, setSelectedProduct] = useState<ProductVariant>()
  const params: { id: string } = useParams()

  const getDetailProduct = useCallback(async () => {
    try {
      const res = await ProductService.getDetailProduct(params.id)
      setProductDetail(res.data.data)
      setOptionSelected(
        res.data.data.productVariants.map((item: ProductVariant) => ({
          label: `${item.product_variant_name} - ${item.product_variant_barcode}`,
          value: item.id
        }))
      )
      setSelectedProduct(res.data.data.productVariants[0])
    } catch (error) {
      console.log(error)
    }
  }, [params.id])

  const handleSelected = useCallback(
    (e: any) => {
      const data = productDetail?.productVariants.find((v) => v.id === e.value)
      setSelectedProduct(data)
    },
    [productDetail?.productVariants]
  )
  console.log(selectedProduct)

  useEffect(() => {
    getDetailProduct()
      .then(() => {
        setIsLoading(false)
        setIsFetched(true)
      })
      .catch(() => {
        setIsLoading(false)
      })
  }, [getDetailProduct])
  // const showLoader = false
  // const [isSorting, setIsSorting] = useState(false)

  // const data: any = {}
  // const initialItems = JSON.parse(localStorage.getItem('items') ?? '[]')
  // const [items, setItems] = useState<NewItem[]>([])

  // const history = useHistory()

  // useEffect(() => {
  //   TagService.getListTag()
  //     .then((response) => {
  //       const data = response.data.data
  //       const newPriceVariantsList = data.map((price: any, index: number) => ({
  //         id: `item-${index + 1}`,
  //         content: price.price_type,
  //         value: (Math.random() * 10000).toFixed(3)
  //       }))

  //       if (initialItems) {
  //         const updatedItems = [...initialItems]

  //         newPriceVariantsList.forEach((newItem: NewItem) => {
  //           const existingItemIndex = updatedItems.findIndex((item) => item.id === newItem.id)
  //           if (existingItemIndex !== -1) {
  //             // Nếu đã tồn tại một phần tử có cùng id, cập nhật giá trị của phần tử đó
  //             updatedItems[existingItemIndex].value = newItem.value
  //           } else {
  //             // Nếu không tồn tại phần tử có cùng id, thêm phần tử mới vào mảng
  //             updatedItems.push(newItem)
  //           }
  //         })
  //         localStorage.setItem('items', JSON.stringify(updatedItems))
  //         setItems(updatedItems)
  //       } else {
  //         localStorage.setItem('items', JSON.stringify(newPriceVariantsList))
  //         setItems(newPriceVariantsList)
  //       }

  //       setIsLoading(false)
  //       setIsFetched(true)
  //     })
  //     .catch(() => {
  //       setIsLoading(false)
  //     })
  // }, [])

  // const handleSortClick = () => {
  //   setIsSorting(true)
  // }

  // const handleCancelSortClick = () => {
  //   setItems([...initialItems])
  //   setIsSorting(false)
  // }

  // const handleSaveClick = () => {
  //   setIsSorting(false)
  //   localStorage.setItem('items', JSON.stringify(items))
  // }

  // const handleOnDragEnd = (result: any) => {
  //   if (!result.destination) return
  //   const itemsCopy = Array.from(items)
  //   const [reorderedItem] = itemsCopy.splice(result.source.index, 1)
  //   itemsCopy.splice(result.destination.index, 0, reorderedItem)
  //   setItems(itemsCopy)
  // }

  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>Chi tiết sản phẩm</title>
        </Helmet>
        <PageLoader />
      </>
    )
  }

  if (!isFetched) {
    return <Error errorCode='500' />
  }

  return (
    <React.Fragment>
      <div className='d-flex justify-content-between'>
        <BackPreviousPage text='Quay lại danh sách sản phẩm' path='/app/products' />
        <ButtonLoading
          text={
            <span style={{ fontWeight: 600 }}>
              <i className='feather icon-trash-2 mr-2'></i>
              Xoá sản phẩm
            </span>
          }
          // loading={showLoader}
          type='submit'
          className='m-0 mb-3'
          // disabled={showLoader}
          variant='outline-danger'
        ></ButtonLoading>
      </div>

      <Row>
        <Col sm={4} lg={4}>
          <div className='mb-3'>
            {optionSelected.length > 0 && (
              <Select
                defaultValue={[optionSelected[0]]}
                isMulti={false}
                name='colors'
                options={optionSelected}
                onChange={handleSelected}
                className='basic-multi-select'
                classNamePrefix='select'
              />
            )}
          </div>
        </Col>
        <Col sm={12} lg={12}>
          <Card>
            <Card.Header>
              <Card.Title as='h5'>Thông tin sản phẩm</Card.Title>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col sm={12} lg={4}>
                  <Form.Group className='mb-0' as={Row} controlId='formHorizontalEmail'>
                    <Form.Label column>Mã SKU</Form.Label>
                    <Col sm={10} lg={7}>
                      <FormLabel className='text-normal' column>
                        : {selectedProduct?.product_variant_SKU ? selectedProduct?.product_variant_SKU : '---'}
                      </FormLabel>
                    </Col>
                  </Form.Group>
                  <Form.Group className='mb-0' as={Row} controlId='formHorizontalEmail'>
                    <Form.Label column>Mã barcode</Form.Label>
                    <Col sm={10} lg={7}>
                      <FormLabel className='text-normal' column>
                        : {selectedProduct?.product_variant_barcode ? selectedProduct?.product_variant_barcode : '---'}
                      </FormLabel>
                    </Col>
                  </Form.Group>
                  <Form.Group className='mb-0' as={Row} controlId='formHorizontalEmail'>
                    <Form.Label column>Khối lượng</Form.Label>
                    <Col sm={10} lg={7}>
                      <FormLabel className='text-normal' column>
                        : {selectedProduct?.product_weight ? selectedProduct?.product_weight : '---'}
                      </FormLabel>
                    </Col>
                  </Form.Group>
                  <Form.Group className='mb-0' as={Row} controlId='formHorizontalEmail'>
                    <Form.Label column>Đơn vị tính</Form.Label>
                    <Col sm={10} lg={7}>
                      <FormLabel className='text-normal' column>
                        :{' '}
                        {selectedProduct?.product_weight_calculator_unit
                          ? selectedProduct?.product_weight_calculator_unit
                          : '---'}
                      </FormLabel>
                    </Col>
                  </Form.Group>
                  <Form.Group className='mb-0' as={Row} controlId='formHorizontalEmail'>
                    <Form.Label column>Phân loại</Form.Label>
                    <Col sm={10} lg={7}>
                      <FormLabel className='text-normal' column>
                        : {productDetail?.product_classify ? productDetail?.product_classify : '---'}
                      </FormLabel>
                    </Col>
                  </Form.Group>
                  <Form.Group className='mb-0' as={Row} controlId='formHorizontalEmail'>
                    <Form.Label column>Mô tả</Form.Label>
                    <Col sm={10} lg={6}>
                      {/* <FormLabel className='text-normal' column>
                        : {data.user_staff ? data.user_staff : '---'}
                      </FormLabel> */}
                    </Col>
                  </Form.Group>
                </Col>
                <Col sm={12} lg={4}>
                  <Form.Group className='mb-0' as={Row} controlId='formHorizontalEmail'>
                    <Form.Label column>Loại sản phẩm</Form.Label>
                    <Col sm={10} lg={7}>
                      <FormLabel className='text-normal' column>
                        :{' '}
                        {productDetail?.productAdditionInformation.type.type_title
                          ? productDetail?.productAdditionInformation.type.type_title
                          : '---'}
                      </FormLabel>
                    </Col>
                  </Form.Group>
                  <Form.Group className='mb-0' as={Row} controlId='formHorizontalEmail'>
                    <Form.Label column>Nhãn hiệu</Form.Label>
                    <Col sm={10} lg={7}>
                      <FormLabel className='text-normal' column>
                        :{' '}
                        {productDetail?.productAdditionInformation.brand.brand_title
                          ? productDetail?.productAdditionInformation.brand.brand_title
                          : '---'}
                      </FormLabel>
                    </Col>
                  </Form.Group>
                  <Form.Group className='mb-0' as={Row} controlId='formHorizontalEmail'>
                    <Form.Label column>Tags</Form.Label>
                    <Col sm={12} lg={7}>
                      <FormLabel className='text-normal' column>
                        :{` `}
                        {productDetail?.productAdditionInformation?.productTagList &&
                        productDetail?.productAdditionInformation?.productTagList?.length > 0 ? (
                          <>
                            {productDetail.productAdditionInformation.productTagList.map((e, index) => (
                              <React.Fragment key={e.id}>
                                {e.tag_title}{' '}
                                {productDetail.productAdditionInformation.productTagList.length === index + 1 ? (
                                  <></>
                                ) : (
                                  <>,</>
                                )}
                              </React.Fragment>
                            ))}
                          </>
                        ) : (
                          '---'
                        )}
                      </FormLabel>
                    </Col>
                  </Form.Group>
                  <Form.Group className='mb-0' as={Row} controlId='formHorizontalEmail'>
                    <Form.Label column>Ngày tạo</Form.Label>
                    <Col sm={10} lg={7}>
                      <FormLabel className='text-normal' column>
                        :{' '}
                        {productDetail?.createdAt
                          ? moment(productDetail?.createdAt).utcOffset(7).format('DD/MM/YYYY - HH:mm:ss')
                          : '---'}
                      </FormLabel>
                    </Col>
                  </Form.Group>
                  <Form.Group className='mb-0' as={Row} controlId='formHorizontalEmail'>
                    <Form.Label column>Ngày cập nhật cuối</Form.Label>
                    <Col sm={10} lg={7}>
                      <FormLabel className='text-normal' column>
                        :{' '}
                        {productDetail?.updatedAt
                          ? moment(productDetail?.updatedAt).utcOffset(7).format('DD/MM/YYYY - HH:mm:ss')
                          : '---'}
                      </FormLabel>
                    </Col>
                  </Form.Group>
                </Col>
                <Col className='d-flex justify-content-center' sm={12} lg={3}>
                  <div className='text-center'>
                    <i className='feather icon-image no-image'></i>
                    <p className='m-0'>Sản phẩm chưa có ảnh tải lên</p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={12} lg={8}>
          <Row>
            <Col sm={12} lg={12}>
              <Card>
                <Card.Header className='flex-between'>
                  <Card.Title as='h5'>Giá sản phẩm</Card.Title>
                  {/* {isSorting ? (
                    <span>
                      <span className='text-normal' style={{ marginRight: 200, color: '#122ee2' }}>
                        Sắp xếp theo thứ tự vị trí ưu tiên từ trên xuống dưới
                      </span>
                      <Button variant='danger' onClick={handleCancelSortClick} className='strong-title mr-2' size='sm'>
                        Huỷ
                      </Button>
                      <Button onClick={handleSaveClick} className='strong-title' size='sm'>
                        Lưu
                      </Button>
                    </span>
                  ) : (
                    <Button onClick={handleSortClick} className='strong-title' size='sm'>
                      Sắp xếp
                    </Button>
                  )} */}
                </Card.Header>
                <Card.Body>
                  <Row>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                        width: '100%',
                        columnGap: '15px',
                        padding: '0px 16px'
                      }}
                    >
                      {selectedProduct?.productPrices.map((e) => (
                        <Form.Group key={e.id} className='mb-0' as={Row} controlId='formHorizontalEmail'>
                          <Form.Label column>{e.price_type}</Form.Label>
                          <Col sm={10} lg={8}>
                            <FormLabel className='text-normal' column>
                              : {e.price_value ? formatCurrency(parseInt(e.price_value)) : '0'}
                            </FormLabel>
                          </Col>
                        </Form.Group>
                      ))}
                    </div>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col sm={12} lg={4}>
          <Row>
            <Col sm={12} lg={12}>
              <Card>
                <Card.Header>
                  <Card.Title as='h5'>Thông tin thêm</Card.Title>
                </Card.Header>
                <Card.Body>
                  <Form>
                    <FormGroup>
                      <FormCheck
                        checked
                        disabled
                        className='mt-2 mb-3'
                        type='checkbox'
                        label='Cho phép bán'
                      ></FormCheck>
                      <FormCheck type='checkbox' label='Áp dụng thuế'></FormCheck>
                    </FormGroup>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default ProductDetails
