import React, { useEffect, useState, useCallback } from 'react'
import moment from 'moment'
import { Row, Col, Card, Form, FormLabel, FormGroup, FormCheck, Badge, Button } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import PageLoader from '~/components/Loader/PageLoader'
import Error from '../Errors'
import { ButtonLoading } from '~/components/Button/LoadingButton'
import ProductService from '~/services/product.service'
import { Product, ProductVariant } from '~/types/Product.type'
import Select from 'react-select'
import BackPreviousPage from '~/components/Button/BackPreviousPage'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { PricePolicyGetter } from '~/types/PricePolicy.type'

interface priceItemsProp {
  id: string
  type: string
  value: string
}

const ProductDetails = () => {
  const getPriceItems = localStorage.getItem('price_items123')
  const initialPriceItems = getPriceItems !== null ? JSON.parse(getPriceItems) : null
  const [priceItems, setPriceItems] = useState<any>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSorting, setIsSorting] = useState(false)
  const [isFetched, setIsFetched] = useState(true)
  const [productDetail, setProductDetail] = useState<Product>()
  const [optionSelected, setOptionSelected] = useState([])
  const [selectedProduct, setSelectedProduct] = useState<ProductVariant>()
  const params: { id: string } = useParams()

  const getDetailProduct = useCallback(async () => {
    try {
      const res = await ProductService.getDetailProduct(params.id)
      const data = res.data.data
      const listPriceVariants = data.productVariants[0].productPrices.map((price: PricePolicyGetter) => ({
        id: price.price_id,
        type: price.price_type,
        value: price.price_value
      }))
      setProductDetail(data)
      setOptionSelected(
        data.productVariants.map((item: ProductVariant) => ({
          label: `${item.product_variant_name} - ${item.product_variant_barcode}`,
          value: item.id
        }))
      )

      setSelectedProduct(data.productVariants[0])
      if (initialPriceItems) {
        const updatedItems = [...initialPriceItems]
        setPriceItems(updatedItems)
      } else {
        localStorage.setItem('price_items', JSON.stringify(listPriceVariants))
        setPriceItems(listPriceVariants)
      }
    } catch (error) {
      console.log(error)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id])

  const handleSelected = useCallback(
    (e: any) => {
      const data = productDetail?.productVariants.find((v) => v.id === e.value)
      setSelectedProduct(data)
    },
    [productDetail?.productVariants]
  )

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

  const handleSortClick = () => {
    setIsSorting(true)
  }

  const handleCancelSortClick = () => {
    setIsSorting(false)
  }

  const handleSaveClick = () => {
    setIsSorting(false)
    localStorage.setItem('price_items', JSON.stringify(priceItems))
  }

  const handleOnDragEnd = (result: any) => {
    if (!result.destination) return
    const itemsCopy: any = Array.from(priceItems)
    const [reorderedItem] = itemsCopy.splice(result.source.index, 1)
    itemsCopy.splice(result.destination.index, 0, reorderedItem)

    setPriceItems(itemsCopy)
  }

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
          type='submit'
          className='m-0 mb-3'
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
                  <Form.Group className='mb-0' as={Row}>
                    <Form.Label column>Mã SKU</Form.Label>
                    <Col sm={10} lg={7}>
                      <FormLabel className='text-normal' column>
                        : {selectedProduct?.product_variant_SKU ? selectedProduct?.product_variant_SKU : '---'}
                      </FormLabel>
                    </Col>
                  </Form.Group>
                  <Form.Group className='mb-0' as={Row}>
                    <Form.Label column>Mã barcode</Form.Label>
                    <Col sm={10} lg={7}>
                      <FormLabel className='text-normal' column>
                        : {selectedProduct?.product_variant_barcode ? selectedProduct?.product_variant_barcode : '---'}
                      </FormLabel>
                    </Col>
                  </Form.Group>
                  <Form.Group className='mb-0' as={Row}>
                    <Form.Label column>Khối lượng</Form.Label>
                    <Col sm={10} lg={7}>
                      <FormLabel className='text-normal' column>
                        : {selectedProduct?.product_weight ? selectedProduct?.product_weight : '---'}
                      </FormLabel>
                    </Col>
                  </Form.Group>
                  <Form.Group className='mb-0' as={Row}>
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
                  <Form.Group className='mb-0' as={Row}>
                    <Form.Label column>Phân loại</Form.Label>
                    <Col sm={10} lg={7}>
                      <FormLabel className='text-normal' column>
                        : {productDetail?.product_classify ? productDetail?.product_classify : '---'}
                      </FormLabel>
                    </Col>
                  </Form.Group>
                </Col>
                <Col sm={12} lg={4}>
                  <Form.Group className='mb-0' as={Row}>
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
                  <Form.Group className='mb-0' as={Row}>
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
                  <Form.Group className='mb-0' as={Row}>
                    <Form.Label column>Tags</Form.Label>
                    <Col sm={12} lg={7}>
                      <FormLabel className='text-normal' column>
                        :{` `}
                        {productDetail?.productAdditionInformation?.productTagList &&
                        productDetail?.productAdditionInformation?.productTagList?.length > 0 ? (
                          <>
                            {productDetail.productAdditionInformation.productTagList.map((e) => (
                              <Badge key={e.id} variant='warning' className='p-1 mr-2'>
                                {e.tag_title}
                              </Badge>
                            ))}
                          </>
                        ) : (
                          '---'
                        )}
                      </FormLabel>
                    </Col>
                  </Form.Group>
                  <Form.Group className='mb-0' as={Row}>
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
                  <Form.Group className='mb-0' as={Row}>
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
                  {isSorting ? (
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
                  )}
                </Card.Header>
                <Card.Body>
                  <Row className='justify-content-center'>
                    {isSorting ? (
                      <DragDropContext onDragEnd={handleOnDragEnd}>
                        <Droppable droppableId='items'>
                          {(provided) => (
                            <div className='text-center' {...provided.droppableProps} ref={provided.innerRef}>
                              {priceItems.map(({ id, type }: priceItemsProp, index: number) => {
                                return (
                                  <Draggable key={id} draggableId={id} index={index}>
                                    {(provided) => (
                                      <div
                                        className='mb-3'
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                      >
                                        <Badge
                                          style={{
                                            fontWeight: 400,
                                            fontSize: 15,
                                            color: 'white',
                                            width: 200,
                                            padding: 14,
                                            backgroundColor: 'rgb(79, 101, 241)',
                                            backgroundImage:
                                              'linear-gradient(90deg, rgb(111, 137, 251) 0%, rgb(97, 109, 245) 33%, rgb(92, 82, 235) 100%)'
                                          }}
                                        >
                                          {index + 1}. <span>{type}</span>
                                        </Badge>
                                      </div>
                                    )}
                                  </Draggable>
                                )
                              })}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </DragDropContext>
                    ) : (
                      // <div
                      //   style={{
                      //     display: 'grid',
                      //     gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                      //     width: '100%',
                      //     columnGap: '15px',
                      //     padding: '0px 16px'
                      //   }}
                      // >
                      //   {priceItems.map((price: priceItemsProp) => (
                      //     <Form.Group key={price.id} className='mb-0' as={Row} >
                      //       <Form.Label column>{price.type}</Form.Label>
                      //       <Col sm={10} lg={8}>
                      //         <FormLabel className='text-normal' column>
                      //           : {price.value ? formatCurrency(parseInt(price.value)) : '0'}
                      //         </FormLabel>
                      //       </Col>
                      //     </Form.Group>
                      //   ))}
                      // </div>

                      <Col>
                        <Row>
                          {priceItems.map((price: priceItemsProp) => (
                            <Col key={price.id} lg={6}>
                              <Form.Group className='mb-0' as={Row}>
                                <Form.Label column>{price.type}</Form.Label>
                                <Col sm={10} lg={8}>
                                  <FormLabel className='text-normal' column>
                                    : {price.value ? price.value : '0'}
                                  </FormLabel>
                                </Col>
                              </Form.Group>
                            </Col>
                          ))}
                        </Row>
                      </Col>
                    )}
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
