import { useState, useEffect, useCallback, ChangeEvent, KeyboardEvent } from 'react'
import { Card, Col, Form, FormGroup, Row } from 'react-bootstrap'
import { HiChevronDoubleDown } from 'react-icons/hi'
import { HiXMark } from 'react-icons/hi2'
import Select, { SingleValue } from 'react-select'
import { Formik } from 'formik'

import BackPreviousPage from '~/components/Button/BackPreviousPage'
import ProductService from '~/services/product.service'
import { formatCurrency } from '~/utils/common'
import InputTags from '~/components/InputTags'
import { PricePolicyService } from '~/services/pricepolicy.service'
import { TagService } from '~/services/tag.service'
import { Helmet } from 'react-helmet'
import { ButtonLoading } from '~/components/Button/LoadingButton'
import Swal from 'sweetalert2'
import { validationSchemaProductCreate } from '~/hooks/useValidation'
import { handleAlertConfirm } from '~/hooks/useAlertConfirm'
import { useHistory } from 'react-router-dom'
import InputTagMui from '~/components/InputTags/InputTagMui'

interface FormValues {
  product_name: string
  product_classify: string
  product_weight: number
  product_weight_calculator_unit: string
  type_id: string
  brand_id: string
  tagIDList: string[]
  properties: [
    {
      key: string
      values: string[]
    }
  ]
  product_variant_prices: [{ price_id: string; price_value: string }]
}

interface VariantPrice {
  id: string
  isImportDefault: boolean
  isSellDefault: boolean
  price_description: string
  price_type: string
}

interface ProductType {
  id: string
  type_description: string
  type_title: string
}

const CardGeneralInformation = [
  { label: 'Mã sản phẩm/SKU', name: '', id: 'formCodeProduct' },
  { label: 'Khối lượng', name: 'product_weight', id: 'formWeightProduct' },
  { label: 'Mã vạch/Barcode', name: '', id: 'formBarcodeProduct' },
  { label: 'Đơn vị tính', name: '', id: 'formUnitProduct' }
]

const options = [
  { value: 'g', label: 'g' },
  { value: 'kg', label: 'kg' }
]

const ProductCreate = () => {
  const history = useHistory()
  const [showLoader, setShowLoader] = useState(false)
  const [optionsTag, setOptionsTag] = useState([])
  const [optionsType, setOptionsType] = useState<ProductType[]>([])
  const [optionsBrand, setOptionsBrand] = useState<ProductType[]>([])
  const [optionPricePolicy, setOptionPricePolicy] = useState([])
  const [showMore, setShowMore] = useState<boolean>(false)
  const [value, setValue] = useState<boolean>(false)
  const [valueBrand, setValueBrand] = useState()
  const [unitWeight, setUnitWeight] = useState('g')
  const [valueType, setValueType] = useState()
  const [valueTags, setValueTags] = useState<string[]>([])
  const [listVariantPrice, setListVariantPrice] = useState<{ price_id: string; price_value: string }[]>([
    { price_id: '', price_value: '' }
  ])
  const [showProperty, setShowProperty] = useState<{ valueName: string; value: []; key: number }[]>([])
  const [openToggle, setOpenToggle] = useState<boolean>(false)
  const [inputSize, setInputSize] = useState('Kích thước')
  const [inputColor, setInputColor] = useState('Màu sắc')
  const [inputMaterial, setInputMaterial] = useState('Chất liệu')
  const [listProperty, setListProperty] = useState<{ key: string; values: string[] }[]>([
    {
      key: inputSize,
      values: []
    }
  ])
  const [newTags, setNewTags] = useState<any>()

  const handleListNewTags = useCallback((value: any) => {
    setNewTags(value)
  }, [])

  const changeTags = useCallback((value: string[]) => {
    setValueTags(value)
  }, [])
  const DataAdditionalInformation = [
    {
      id: 'type_id',
      label: 'type_id',
      title: 'Loại sản phẩm',
      placeholder: 'Chọn loại sản phẩm',
      type: 'select',
      isMulti: false,
      listOption: optionsType,
      nameOption: 'type'
    },
    {
      id: 'brand_id',
      label: 'brand_id',
      title: 'Nhãn hiệu',
      placeholder: 'Chọn nhãn hiệu',
      type: 'select',
      isMulti: false,
      listOption: optionsBrand,
      nameOption: 'brand'
    },
    {
      id: 'tagIDList',
      label: 'tagIDList',
      title: 'Tags',
      placeholder: 'Chọn tags',
      type: 'select',
      isMulti: true,
      listOption: optionsTag,
      nameOption: 'tags'
    }
  ]

  const initialValues: FormValues = {
    product_name: '',
    product_classify: '',
    product_weight: 0,
    product_weight_calculator_unit: 'g',
    type_id: '',
    brand_id: '',
    tagIDList: [],
    properties: [{ key: '', values: [] }],
    product_variant_prices: [{ price_id: '', price_value: '' }]
  }

  const handleSubmit = async (values: FormValues) => {
    setShowLoader(true)

    const data = {
      tags: newTags
    }

    const res = await TagService.createTag(data)
    if (res.data.message === 'Success' && newTags) {
      const res = await TagService.getListTag()
      const arr: { tag_title: string; id: string }[] = res.data.data
      const newArr = arr.filter((item1) => newTags.some((item2: any) => item2.tag_title === item1.tag_title))
      const arrTag = valueTags?.concat(newArr.map((e) => e.id))
      try {
        const dataSubmit = {
          product_name: values.product_name,
          product_classify: 'Sản phẩm thường',
          product_weight: `${values.product_weight}`,
          product_weight_calculator_unit: unitWeight,
          type_id: valueType,
          brand_id: valueBrand,
          tagIDList: arrTag,
          properties: listProperty,
          product_variant_prices: listVariantPrice.filter((item) => item.price_value !== '')
        }
        ProductService.createProduct(dataSubmit)
          .then(() => {
            setTimeout(() => {
              setShowLoader(false)
              handleAlertConfirm({
                text: 'Thêm sản phẩm mới thành công',
                icon: 'success',
                handleConfirmed: () => history.replace('/app/products')
              })
            }, 1000)
          })
          .catch(() => {
            setTimeout(() => {
              setShowLoader(false)
              handleAlertConfirm({
                text: 'Thêm sản phẩm mới thất bại',
                icon: 'error'
              })
            }, 1000)
          })
      } catch (error) {
        Swal.fire('', 'Lỗi kết nối tới máy chủ', 'error')
      }
    }
  }

  const handleUnitWeight = useCallback((e: SingleValue<{ value: string; label: string }>) => {
    if (e?.value) {
      setUnitWeight(e.value)
    }
  }, [])

  const handleChangeInput = useCallback(
    (event: ChangeEvent<any>, item: { value: string }) => {
      const value = event.target.value
      const newArr = listVariantPrice.map((i: { price_id: string; price_value: string }) => {
        if (i.price_id === item.value)
          return {
            ...i,
            price_value: formatCurrency(parseInt(value))
          }
        return i
      })
      setListVariantPrice(newArr)
    },
    [listVariantPrice]
  )

  const handleChangPropertyValue = (v: any, index: number, option: string[]) => {
    const newList: any = [...listProperty]
    switch (v) {
      case '11':
        newList[index].values = option
        break
      case '12':
        newList[index].values = option
        break
      case '13':
        newList[index].values = option
        break
    }
    setListProperty(newList)
  }

  const handleChangPropertyName = (v: any, index: number) => {
    const newList: any = [...listProperty]
    switch (v.target.name) {
      case '1':
        setInputSize(v.target.value)
        newList[index].key = v.target.value
        break
      case '2':
        setInputColor(v.target.value)
        newList[index].key = v.target.value
        break
      case '3':
        setInputMaterial(v.target.value)
        newList[index].key = v.target.value
        break
    }
    setListProperty(newList)
  }

  const handleChangeSelect = useCallback((e: any, option: any) => {
    switch (option.name) {
      case 'brand':
        setValueBrand(e.value)
        break
      case 'type':
        setValueType(e.value)
        break
    }
  }, [])

  const handleAdd = () => {
    if (showProperty.length === 1) {
      setShowProperty([...showProperty, { valueName: 'Màu sắc', value: [], key: 2 }])
      setListProperty([...listProperty, { key: inputColor, values: [] }])
    } else if (showProperty.length === 2) {
      if (showProperty.some((item) => item.key === 3)) {
        setShowProperty([...showProperty, { valueName: 'Màu sắc', value: [], key: 2 }])
        setListProperty([...listProperty, { key: inputColor, values: [] }])
      } else {
        setShowProperty([...showProperty, { valueName: 'Chất liệu', value: [], key: 3 }])
        setListProperty([...listProperty, { key: inputMaterial, values: [] }])
      }
    }
  }

  const deletedRowProperty = (key: number, index: number) => {
    setShowProperty(showProperty.filter((item) => item.key !== key))
    setListProperty(listProperty.filter((_, i) => i !== index))
    switch (key) {
      case 2:
        setInputColor('Màu sắc')
        break
      case 3:
        setInputMaterial('Chất liệu')
    }
  }

  const getListPricePolicies = useCallback(async () => {
    try {
      const res = await PricePolicyService.getListPrice()
      setOptionPricePolicy(
        res.data.data.map((item: VariantPrice) => ({
          label: item.price_type,
          value: item.id
        }))
      )
      setListVariantPrice(
        res.data.data.map((item: VariantPrice) => ({
          price_value: '',
          price_id: item.id
        }))
      )
    } catch (error) {
      console.log(error)
    }
  }, [])

  const handleKeyPress = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
    }
  }

  const getListTag = useCallback(async () => {
    try {
      const res = await TagService.getListTag()
      const data = res.data.data
      setOptionsTag(
        data.map((tag: any) => ({
          label: tag.tag_title,
          value: tag.id
        }))
      )
    } catch (error) {
      console.log(error)
    }
  }, [])

  const getListBrand = useCallback(async () => {
    try {
      const res = await ProductService.getListProductBrand()
      setOptionsBrand(res.data.data)
    } catch (error) {
      console.log(error)
    }
  }, [])

  const getListType = useCallback(async () => {
    try {
      const res = await ProductService.getListProductType()
      setOptionsType(res.data.data)
    } catch (error) {
      console.log(error)
    }
  }, [])

  useEffect(() => {
    getListPricePolicies()
    getListBrand()
    getListTag()
    getListType()
  }, [getListPricePolicies, getListBrand, getListTag, getListType])

  return (
    <>
      <Helmet>
        <title>Thêm sản phẩm</title>
      </Helmet>

      <Formik initialValues={initialValues} validationSchema={validationSchemaProductCreate} onSubmit={handleSubmit}>
        {({ errors, handleChange, handleSubmit, touched, values }) => (
          <Form onKeyDown={handleKeyPress}>
            <span className='flex-between'>
              <BackPreviousPage path='/app/products' text='Quay lại danh sách sản phẩm' />
              <ButtonLoading
                text={
                  <span>
                    <i className='feather icon-plus-circle mr-2'></i>
                    Lưu sản phẩm
                  </span>
                }
                onSubmit={handleSubmit}
                loading={showLoader}
                type='submit'
                disabled={showLoader}
                className='m-0 mb-3'
              ></ButtonLoading>
            </span>

            <Row>
              <Col sm={12} lg={8}>
                <Row>
                  <Col lg={12}>
                    <Card>
                      <Card.Header>
                        <Card.Title as='h5'>Hình thức quản lý</Card.Title>
                      </Card.Header>
                      <Card.Body>
                        <Form.Group controlId='formProductClassify'>
                          <Form.Check
                            type='radio'
                            readOnly
                            checked
                            className='text-normal'
                            label='Sản phẩm thường'
                          ></Form.Check>
                        </Form.Group>
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col sm={12} lg={12}>
                    <Card>
                      <Card.Header>
                        <Card.Title as='h5'>Thông tin chung</Card.Title>
                      </Card.Header>
                      <Card.Body>
                        <Form.Group controlId='formProductName'>
                          <Form.Label>
                            Tên sản phẩm <span className='text-c-red'>*</span>
                          </Form.Label>
                          <Form.Control
                            name='product_name'
                            value={values.product_name}
                            onChange={handleChange}
                            placeholder='Nhập tên sản phẩm'
                          />
                          {touched.product_name && errors.product_name && (
                            <small className='text-danger form-text'>{errors.product_name}</small>
                          )}
                        </Form.Group>
                        <Row>
                          {CardGeneralInformation.map((item, index) => (
                            <Col key={index} lg={6}>
                              <Form.Group controlId={item.id}>
                                <Form.Label>{item.label}</Form.Label>
                                <div className='d-flex'>
                                  <Form.Control
                                    type={index === 1 ? 'number' : 'text'}
                                    style={{ width: index === 1 ? '75%' : '100%' }}
                                    name={item.name}
                                    value={index === 1 ? values.product_weight : ''}
                                    onChange={handleChange}
                                  />
                                  {index === 1 && (
                                    <div style={{ flex: '1' }}>
                                      <Select onChange={handleUnitWeight} defaultValue={options[0]} options={options} />
                                    </div>
                                  )}
                                </div>
                              </Form.Group>
                            </Col>
                          ))}
                        </Row>
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col sm={12} lg={12}>
                    <Card>
                      <Card.Header style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Card.Title as='h5'>Giá sản phẩm</Card.Title>
                        <span className='hover-70' style={{ color: '#04a9f5', fontWeight: '600', cursor: 'pointer' }}>
                          <i style={{ marginRight: '4px' }} className='feather icon-plus-circle'></i>
                          Thêm chính sách giá
                        </span>
                      </Card.Header>
                      <Card.Body>
                        <Row>
                          {(showMore ? optionPricePolicy : optionPricePolicy.slice(0, 3)).map(
                            (item: { label: string; value: string }, index) => (
                              <Col key={index} lg={6}>
                                <Form.Group controlId={item.label}>
                                  <Form.Label>{item.label}</Form.Label>
                                  <Form.Control
                                    type='number'
                                    name={item.value}
                                    // value={item.value}
                                    onChange={(value) => {
                                      handleChangeInput(value, item)
                                    }}
                                  />
                                </Form.Group>
                              </Col>
                            )
                          )}
                        </Row>
                        <span
                          style={{ color: '#04a9f5', fontWeight: '600', cursor: 'pointer' }}
                          className='hover-70'
                          onClick={() => setShowMore(!showMore)}
                          aria-hidden='true'
                        >
                          <HiChevronDoubleDown
                            style={{ marginRight: '4px', marginBottom: '3px' }}
                            className={`${showMore && 'rotate-180'}`}
                          />
                          <span>{showMore ? 'Thu gọn giá sản phẩm' : 'Hiển thị thêm chính sách giá'}</span>
                        </span>
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col lg={12}>
                    <Card>
                      <Card.Header style={{ position: 'relative' }}>
                        <Card.Title as='h5'>Thuộc tính</Card.Title>
                        <div
                          style={{ position: 'absolute', top: '8px', left: '120px' }}
                          className='switch switch-primary'
                        >
                          <input
                            id='toggleCheck'
                            checked={value}
                            onChange={() => {
                              setValue((prevState: any) => !prevState)
                              setShowProperty([
                                {
                                  valueName: 'Kích thước',
                                  value: [],
                                  key: 1
                                }
                              ])
                              setOpenToggle(!openToggle)
                            }}
                            type='checkbox'
                          />
                          <label htmlFor='toggleCheck' className='cr'>
                            {' '}
                          </label>
                        </div>
                        <p style={{ marginTop: '15px' }}>
                          Thêm mới thuộc tính giúp sản phẩm có nhiều lựa chọn, như kích cỡ hay màu sắc
                        </p>
                      </Card.Header>

                      {value && (
                        <Card.Body>
                          {showProperty.map((e, index) => (
                            <Row key={index} style={{ position: 'relative' }}>
                              <Col lg={4}>
                                <Form.Group>
                                  {index === 0 && (
                                    <Form.Label style={{ fontWeight: '600', color: 'black' }}>
                                      Tên thuộc tính
                                    </Form.Label>
                                  )}
                                  <input
                                    type='text'
                                    name={`${e.key}`}
                                    value={e.key === 1 ? inputSize : e.key === 2 ? inputColor : inputMaterial}
                                    id={`${index + 1}`}
                                    onChange={(v) => handleChangPropertyName(v, index)}
                                    className={`style-field`}
                                    style={{ borderRadius: '3px', padding: '8px', width: '100%' }}
                                    placeholder=''
                                  />
                                </Form.Group>
                              </Col>
                              <Col lg={8}>
                                <Form.Group>
                                  {index === 0 && (
                                    <Form.Label style={{ fontWeight: '600', color: 'black' }}>Giá trị</Form.Label>
                                  )}
                                  <InputTags
                                    id={`${index + 1}`}
                                    name={`${e.key + 10}`}
                                    index={index}
                                    onChange={handleChangPropertyValue}
                                    list={listProperty}
                                    placeholder='Gõ ký tự và ấn Enter để thêm thuộc tính'
                                  />
                                </Form.Group>
                              </Col>
                              {index > 0 && (
                                <button
                                  className='hover-70'
                                  onClick={() => deletedRowProperty(e.key, index)}
                                  style={{
                                    position: 'absolute',
                                    right: '-2px',
                                    bottom: '23px',
                                    cursor: 'pointer',
                                    border: 'none',
                                    background: 'white'
                                  }}
                                >
                                  <HiXMark style={{ fontSize: '20px' }} />
                                </button>
                              )}
                            </Row>
                          ))}

                          {showProperty.length < 3 && openToggle && (
                            <span
                              className='hover-70'
                              style={{ color: '#04a9f5', fontWeight: '600', cursor: 'pointer' }}
                              onClick={handleAdd}
                              aria-hidden='true'
                            >
                              <i style={{ marginRight: '4px' }} className='feather icon-plus-circle'></i>
                              Thêm thuộc tính khác
                            </span>
                          )}
                        </Card.Body>
                      )}
                    </Card>
                  </Col>
                </Row>
              </Col>

              <Col sm={12} lg={4}>
                <Card>
                  <Card.Header>
                    <Card.Title as='h5'>Thông tin bổ sung</Card.Title>
                  </Card.Header>
                  <Card.Body>
                    {DataAdditionalInformation.slice(0, 2).map((item, index) => (
                      <FormGroup key={index}>
                        <Form.Label>{item.title}</Form.Label>
                        <Select
                          name={item.nameOption}
                          isMulti={item.isMulti}
                          options={item.listOption.map((item: any) => ({
                            value: item.id,
                            label: index === 0 ? item.type_title : index === 1 ? item.brand_title : item.tag_title
                          }))}
                          onChange={handleChangeSelect}
                          placeholder={item.placeholder}
                        ></Select>
                      </FormGroup>
                    ))}
                    {DataAdditionalInformation.slice(2, 3).map((item, index) => (
                      <FormGroup key={index}>
                        <Form.Label>{item.title}</Form.Label>
                        <InputTagMui
                          onChange={changeTags}
                          list={optionsTag}
                          onChangeNewTags={handleListNewTags}
                          position='top'
                        />
                      </FormGroup>
                    ))}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </>
  )
}

export default ProductCreate
