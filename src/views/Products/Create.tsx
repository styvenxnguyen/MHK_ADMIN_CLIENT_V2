import { useState, useEffect, useCallback, ChangeEvent, KeyboardEvent } from 'react'
import { Col, Button, Form as FormBootstrap, FormGroup } from 'react-bootstrap'
import { HiChevronDoubleDown } from 'react-icons/hi'
import { HiXMark } from 'react-icons/hi2'
import Select from 'react-select'
import { Formik, Field, Form, ErrorMessage, FieldProps } from 'formik'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'

import BackPreviousPage from '~/components/Button/BackPreviousPage'
import ProductService from '~/services/product.service'
import Title from '~/components/Title/Title'
import { formatCurrency } from '~/utils/common'
import InputTags from '~/components/InputTags'
import { PricePolicyService } from '~/services/pricepolicy.service'
import { TagService } from '~/services/tag.service'

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

interface TypeResponse {
  id: string
  tag_description: string
  tag_title: string
}

interface ProductType {
  id: string
  type_description: string
  type_title: string
}

const optionUnitWeight = [
  { label: 'g', weight: 'g' },
  { label: 'kg', weight: 'kg' }
]

const DataFields = [
  {
    id: 'product_code',
    name: 'product_code',
    label: 'Mã sản phẩm/SKU',
    type: 'text'
  },
  {
    id: 'product_weight',
    name: 'product_weight',
    label: 'Khối lượng',
    type: 'number'
  },
  {
    id: 'product_barcode',
    name: 'product_barcode',
    label: 'Mã vạch/Barcode',
    type: 'text'
  },
  {
    id: 'product_unit_price',
    name: 'product_unit_price',
    label: 'Đơn vị tính',
    type: 'number'
  }
]

const ProductCreate = () => {
  const [optionsTag, setOptionsTag] = useState<TypeResponse[]>([])
  const [optionsType, setOptionsType] = useState<ProductType[]>([])
  const [optionsBrand, setOptionsBrand] = useState<ProductType[]>([])
  const [optionPricePolicy, setOptionPricePolicy] = useState([])
  const [showMore, setShowMore] = useState<boolean>(false)
  const [value, setValue] = useState<boolean>(false)
  const [valueBrand, setValueBrand] = useState()
  const [valueType, setValueType] = useState()
  const [valueTags, setValueTags] = useState([])
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
      values: ['']
    }
  ])

  const sweetSuccessAlert = () => {
    const MySwal = withReactContent(Swal)
    MySwal.fire({
      title: 'Tạo sản phẩm thành công',
      text: 'Chúc mừng bạn đã tạo sản phẩm thành công',
      icon: 'success',
      confirmButtonText: 'Xác nhận',
      confirmButtonColor: 'success',
      showCancelButton: false
    })
  }

  const DataAdditionalInformation = [
    {
      id: 'type_id',
      name: 'type_id',
      label: 'Loại sản phẩm',
      placeholder: 'Chọn loại sản phẩm',
      type: 'select',
      isMulti: false,
      listOption: optionsType,
      nameOption: 'type'
    },
    {
      id: 'brand_id',
      name: 'brand_id',
      label: 'Nhãn hiệu',
      placeholder: 'Chọn nhãn hiệu',
      type: 'select',
      isMulti: false,
      listOption: optionsBrand,
      nameOption: 'brand'
    },
    {
      id: 'tagIDList',
      name: 'tagIDList',
      label: 'Tags',
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

  const validate = (values: FormValues) => {
    const errors: Partial<FormValues> = {}

    if (!values.product_name) {
      errors.product_name = 'Tên sản phẩm không được để trống!'
    }
    return errors
  }

  const handleSubmit = async (values: FormValues) => {
    try {
      const dataSubmit = {
        product_name: values.product_name,
        product_classify: 'Sản phẩm thường',
        product_weight: `${values.product_weight}`,
        product_weight_calculator_unit: values.product_weight_calculator_unit,
        type_id: valueType,
        brand_id: valueBrand,
        tagIDList: valueTags,
        properties: listProperty,
        product_variant_prices: listVariantPrice.filter((item) => item.price_value !== '')
      }
      await ProductService.createProduct(dataSubmit)
      sweetSuccessAlert()
    } catch (error) {
      console.log(error)
    }
  }

  const handleChangeInput = useCallback(
    (event: ChangeEvent<HTMLInputElement>, item: { value: string }) => {
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
      case 'tags':
        {
          const newAr = e.map((i: any) => i.value)
          setValueTags(newAr)
        }
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
      setOptionsTag(res.data.data)
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
      <Formik initialValues={initialValues} validate={validate} onSubmit={handleSubmit}>
        <Form onKeyDown={handleKeyPress}>
          <span className='flex-between'>
            <BackPreviousPage path='/app/products' text='Quay lại danh sách sản phẩm' />
            <Button type='submit' className='m-0 mb-3'>
              <i className='feather icon-plus-circle'></i>
              Lưu sản phẩm
            </Button>
          </span>
          <div style={{ width: '100%', display: 'flex', gap: '25px' }}>
            <div style={{ width: '65%' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                <div
                  style={{
                    background: 'white',
                    boxShadow: 'rgba(50, 50, 93, 0.25) 0px 1px 8px -3px, rgba(0, 0, 0, 0.3) 0px 3px 5px -3px'
                  }}
                >
                  <Title label='Hình thức quản lý' />
                  <div style={{ padding: '20px 30px' }}>
                    <FormBootstrap.Check
                      type='radio'
                      checked
                      className='text-normal'
                      label='Sản phẩm thường'
                    ></FormBootstrap.Check>
                  </div>
                </div>

                <div
                  className='bg-white'
                  style={{ boxShadow: 'rgba(50, 50, 93, 0.25) 0px 1px 8px -3px, rgba(0, 0, 0, 0.3) 0px 3px 5px -3px' }}
                >
                  <Title label='Thông tin chung' />
                  <div style={{ padding: '16px 28px', paddingBottom: '40px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <Field
                        id='product_name'
                        name='product_name'
                        render={({ field, form }: FieldProps<FormValues['product_name']>) => (
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              position: 'relative',
                              marginBottom: '25px'
                            }}
                          >
                            <label
                              style={{ marginBottom: '4px', color: '#46515F', fontSize: '14px' }}
                              htmlFor='product_name'
                            >
                              Tên sản phẩm <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                              type='text'
                              id='product_name'
                              {...field}
                              className={` ${
                                form.touched.product_name && form.errors.product_name ? 'error-field' : 'style-field'
                              }`}
                              style={{ borderRadius: '4px', padding: '10px' }}
                              placeholder='Nhập tên sản phẩm'
                            />
                            <ErrorMessage className='error-text' name='product_name' component='div' />
                          </div>
                        )}
                        type='text'
                      />

                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                          width: '100%',
                          columnGap: '20px',
                          rowGap: '20px'
                        }}
                      >
                        {DataFields.map((item, index) => (
                          <Field
                            key={index}
                            id={item.id}
                            name={item.id}
                            render={({ field }: FieldProps<any>) => (
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <label
                                  style={{ marginBottom: '4px', color: '#46515F', fontSize: '14px' }}
                                  htmlFor={item.id}
                                >
                                  {item.label}
                                </label>
                                <div className={`${index === 1 && 'd-flex'}`}>
                                  <input
                                    type={item.type}
                                    id={item.id}
                                    {...field}
                                    className='style-field'
                                    style={{ borderRadius: '4px', padding: '10px', width: '100%' }}
                                  />
                                  {index === 1 && (
                                    <>
                                      <Field
                                        id='product_weight_calculator_unit'
                                        name='product_weight_calculator_unit'
                                        render={({ field }: FieldProps<any>) => (
                                          <select {...field} className='w-[25%] style-select rounded-r-sm'>
                                            {optionUnitWeight.map((item, index) => (
                                              <option key={index} value={item.weight}>
                                                {item.label}
                                              </option>
                                            ))}
                                          </select>
                                        )}
                                      />
                                    </>
                                  )}
                                </div>
                              </div>
                            )}
                            type={item.type}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className='bg-white shadow-md relative'
                  style={{
                    backgroundColor: 'white',
                    position: 'relative',
                    boxShadow: 'rgba(50, 50, 93, 0.25) 0px 1px 8px -3px, rgba(0, 0, 0, 0.3) 0px 3px 5px -3px'
                  }}
                >
                  <Title label='Giá sản phẩm' />
                  <div style={{ paddingTop: '12px', padding: '0 9px', paddingBottom: '40px' }}>
                    <div
                      style={{
                        position: 'relative',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                        columnGap: '20px',
                        rowGap: '20px',
                        width: '100%',
                        padding: '20px',
                        paddingBottom: '40px'
                      }}
                    >
                      {(showMore ? optionPricePolicy : optionPricePolicy.slice(0, 3)).map(
                        (item: { label: string; value: string }, index) => (
                          <Field
                            key={index}
                            id={item.value}
                            name={item.value}
                            render={({ field }: FieldProps<any>) => (
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <label
                                  style={{ marginBottom: '4px', color: '#46515F', fontSize: '14px' }}
                                  htmlFor={item.value}
                                >
                                  {item.label}
                                </label>
                                <input
                                  type='number'
                                  id={item.value}
                                  {...field}
                                  onChange={(value) => {
                                    handleChangeInput(value, item)
                                  }}
                                  className={`style-field`}
                                  style={{
                                    borderRadius: '4px',
                                    padding: '10px',
                                    width: '100%'
                                  }}
                                  placeholder=''
                                />
                              </div>
                            )}
                            type='text'
                          />
                        )
                      )}
                      <div className='button-showmore' onClick={() => setShowMore(!showMore)} aria-hidden='true'>
                        <HiChevronDoubleDown className={`${showMore && 'rotate-180'}`} />
                        <span>{showMore ? 'Ẩn bớt chính sách giá' : 'Hiển thị thêm chính sách giá'}</span>
                      </div>
                    </div>
                  </div>
                  <button className='button-addPrice'>
                    <i className='feather icon-plus-circle'></i>
                    Thêm chính sách giá
                  </button>
                </div>

                <div
                  style={{
                    backgroundColor: 'white',
                    boxShadow: 'rgba(50, 50, 93, 0.25) 0px 1px 8px -3px, rgba(0, 0, 0, 0.3) 0px 3px 5px -3px',
                    position: 'relative',
                    overflow: 'hidden',
                    transitionDuration: '200ms',
                    height: value ? `fit-content` : '95px',
                    paddingBottom: value ? '40px' : '0px'
                  }}
                >
                  <Title
                    subTitle='Thêm mới thuộc tính giúp sản phẩm có nhiều lựa chọn, như kích cỡ hay màu sắc'
                    label='Thuộc tính'
                  />
                  <div style={{ position: 'absolute', top: '7px', left: '140px' }}>
                    <div className='switch switch-primary d-inline m-r-10'>
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
                  </div>

                  <div style={{ padding: '0 28px', paddingTop: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', rowGap: '2px' }}>
                      {showProperty.map((item, index: number) => (
                        <FormGroup key={index}>
                          <div style={{ display: 'flex', gap: '20px', position: 'relative' }}>
                            <div
                              className='flex flex-col w-[35%]'
                              style={{ display: 'flex', flexDirection: 'column', width: '35%' }}
                            >
                              <label
                                style={{ marginBottom: '4px', color: '#46515F', fontSize: '14px', fontWeight: '600' }}
                                htmlFor={`${index + 1}`}
                              >
                                Tên thuộc tính
                              </label>
                              <input
                                type='text'
                                name={`${item.key}`}
                                value={item.key === 1 ? inputSize : item.key === 2 ? inputColor : inputMaterial}
                                id={`${index + 1}`}
                                onChange={(v) => handleChangPropertyName(v, index)}
                                className={`style-field`}
                                style={{ borderRadius: '4px', padding: '10px', width: '100%' }}
                                placeholder=''
                              />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', flex: '1' }}>
                              <label
                                style={{ marginBottom: '4px', color: '#46515F', fontSize: '14px', fontWeight: '600' }}
                                htmlFor={`${index + 1}`}
                              >
                                Giá trị
                              </label>
                              <InputTags
                                id={`${index + 1}`}
                                name={`${item.key + 10}`}
                                index={index}
                                onChange={handleChangPropertyValue}
                                list={listProperty}
                                placeholder='Gõ ký tự và ấn Enter để thêm thuộc tính'
                              />
                            </div>
                            {index > 0 && (
                              <button
                                onClick={() => deletedRowProperty(item.key, index)}
                                style={{
                                  position: 'absolute',
                                  right: '-14px',
                                  bottom: '11px',
                                  cursor: 'pointer',
                                  border: 'none',
                                  background: 'white'
                                }}
                              >
                                <HiXMark style={{ fontSize: '20px' }} />
                              </button>
                            )}
                          </div>
                        </FormGroup>
                      ))}
                    </div>

                    {showProperty.length < 3 && openToggle && (
                      <div onClick={handleAdd} className='button-addProperty' aria-hidden='true'>
                        <i className='feather icon-plus-circle'></i>
                        Thêm thuộc tính khác
                      </div>
                    )}
                  </div>
                </div>

                <div className='h-96'></div>
              </div>
            </div>

            <div
              style={{
                width: '35%',
                backgroundColor: 'white',
                boxShadow: 'rgba(50, 50, 93, 0.25) 0px 1px 8px -3px, rgba(0, 0, 0, 0.3) 0px 3px 5px -3px',
                height: 'fit-content'
              }}
            >
              <Title label='Thông tin bổ sung' />
              <div className='mt-3 px-2.5'>
                <Col>
                  {DataAdditionalInformation.map((item, index) => (
                    <FormGroup key={index}>
                      <FormBootstrap.Label>{item.label}</FormBootstrap.Label>
                      <Select
                        name={item.nameOption}
                        isMulti={item.isMulti}
                        options={item.listOption.map((item: any) => ({
                          value: item.id,
                          label: index === 2 ? item.tag_title : item.type_title
                        }))}
                        onChange={handleChangeSelect}
                        placeholder={item.placeholder}
                      ></Select>
                    </FormGroup>
                  ))}
                </Col>
              </div>
            </div>
          </div>
        </Form>
      </Formik>
    </>
  )
}

export default ProductCreate
