import { useState, useEffect, useCallback } from 'react'
import { Button, Form as FormBootstrap } from 'react-bootstrap'
import { HiChevronDoubleDown } from 'react-icons/hi'
import Select from 'react-select'
import { Formik, Field, Form, ErrorMessage, FieldProps } from 'formik'

import { additionalInfo, generalInfo } from './allProductInfo'
import InputProductForm from './Form/Input'
import BackPreviousPage from '~/components/Button/BackPreviousPage'
import CardProductComponent from './Form/Card'
import { getBrandsList, getTagsList, getTypesList } from '~/services/api'
import ProductService from '~/services/product.service'
import Title from '~/components/Title/Title'
import ToggleSwitch from '~/components/Toggle/Switch'
interface FormValues {
  product_name: string
  product_classify: string
  product_weight: string
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

const ProductCreate = () => {
  const [optionsTag, setOptionsTag] = useState([])
  const [optionsType, setOptionsType] = useState([])
  const [optionsBrand, setOptionsBrand] = useState([])
  const [pricePoliciesList, setPricePoliciesList] = useState<any>([])
  const [optionPricePolicy, setOptionPricePolicy] = useState([])
  const [showProperty, setShowProperty] = useState(false)
  const [showMore, setShowMore] = useState<boolean>(false)
  const [value, setValue] = useState<boolean>(false)
  const [dataProduct, setDataProduct]: any = useState({
    product_name: '',
    product_code: '',
    product_weight: '',
    product_barcode: '',
    product_unit_price: '',
    product_type: '',
    product_brand: '',
    product_tags: '',
    price_retail: '',
    price_wholesales: '',
    price_import: ''
  })

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

  const initialValues: FormValues = {
    product_name: '',
    product_classify: '',
    product_weight: '',
    product_weight_calculator_unit: '',
    type_id: '',
    brand_id: '',
    tagIDList: [],
    properties: [{ key: '', values: [] }],
    product_variant_prices: [{ price_id: '', price_value: '' }]
  }

  const handleChange = (event: any) => {
    console.log(event)
    const { name, value } = event.target
    setDataProduct((prevData: any) => ({
      ...prevData,
      [name]: value
    }))
  }
  console.log(dataProduct)
  const validate = (values: FormValues) => {
    const errors: Partial<FormValues> = {}

    if (!values.product_name) {
      errors.product_name = 'Tên sản phẩm không được để trống!'
    }
    return errors
  }

  const handleSubmit = (values: FormValues) => {
    console.log(values)
  }

  const getListPricePolicies = useCallback(async () => {
    try {
      const res = await ProductService.getListPricePolicies()
      setPricePoliciesList(res.data.data)
    } catch (error) {
      console.log(error)
    }
  }, [])

  useEffect(() => {
    getTagsList().then((response) => {
      const tagsListData = response.data.data
      setOptionsTag(tagsListData.map((tag: any) => ({ label: tag.tag_title, value: tag.id })))
    })

    getBrandsList().then((response) => {
      const brandsListData = response.data.data
      setOptionsBrand(brandsListData.map((brand: any) => ({ label: brand.type_title, value: brand.id })))
    })

    getTypesList().then((response) => {
      const typesListData = response.data.data
      setOptionsType(typesListData.map((type: any) => ({ label: type.type_title, value: type.id })))
    })
  }, [])

  useEffect(() => {
    if (showMore) {
      setOptionPricePolicy(
        pricePoliciesList.map((item: any) => ({
          label: item.price_type,
          value: item.id
        }))
      )
    } else {
      setOptionPricePolicy(
        pricePoliciesList.slice(0, 3).map((item: any) => ({
          label: item.price_type,
          value: item.id
        }))
      )
    }
  }, [pricePoliciesList, showMore])

  useEffect(() => {
    getListPricePolicies()
  }, [getListPricePolicies])

  // const cardInfo = [
  //   {
  //     title: 'Hình thức quản lý',
  //     lg: 8,
  //     body: (
  //       <Col>
  //         <Form.Check type='radio' checked className='text-normal' label='Sản phẩm thường'></Form.Check>
  //       </Col>
  //     )
  //   },
  //   {
  //     title: 'Thông tin bổ sung',
  //     lg: 4,
  //     body: additionalInfo.map((info, index) => (
  // <InputProductForm
  //   key={`generalInfo_${index}`}
  //   sm={info.sm}
  //   lg={info.lg}
  //   label={info.label}
  //   placeholder={info.placeholder}
  //   optionsSelect={
  //     info.optionsSelect === 'optionsTag'
  //       ? optionsTag
  //       : info.optionsSelect === 'optionsBrand'
  //       ? optionsBrand
  //       : optionsType
  //   }
  //   name={info.name}
  //   value={dataProduct[info.name]}
  //   inputType={info.inputType}
  //   onChange={handleChange}
  //   isMulti={info.isMulti}
  // />
  //     ))
  //   },
  //   {
  //     title: 'Thông tin chung',
  //     lg: 8,
  //     body: generalInfo.map((info, index) => (
  //       <InputProductForm
  //         key={`generalInfo_${index}`}
  //         sm={info.sm}
  //         lg={info.lg}
  //         label={info.label}
  //         dir={info.dir}
  //         optionsSelect={info.optionsSelect}
  //         placeholder={info.placeholder}
  //         name={info.name}
  //         value={dataProduct[info.name]}
  //         inputType={info.inputType}
  //         require={info.require}
  //         onChange={handleChange}
  //       />
  //     ))
  //   },
  //   {
  //     title: 'Giá sản phẩm',
  //     lg: 8,
  //     body: (
  //       <div className='relative' style={{ width: '100%' }}>
  //         <div style={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
  //           {optionPricePolicy.map((price: any, index: number) => (
  //             <InputProductForm
  //               key={`pricePolicies_${index}`}
  //               sm={12}
  //               lg={12}
  //               label={price.label}
  //               name={price.name}
  //               onChange={handleChange}
  //               inputType='text'
  //               value={dataProduct[price.name]}
  //             />
  //           ))}
  //         </div>
  // <button className='text-blue font-bold flex gap-1 absolute -top-16 right-4 hover:opacity-60 duration-200 active:opacity-100'>
  //   <i className='feather icon-plus-circle'></i>
  //   Thêm chính sách giá
  // </button>
  //         {showMore ? (
  //           <></>
  //         ) : (
  // <button className='button-showmore' onClick={() => setShowMore(true)}>
  //   <HiChevronDoubleDown />
  //   <span>Hiển thị thêm chính sách giá</span>
  // </button>
  //         )}
  //       </div>
  //     )
  //   },
  //   {
  //     title: 'Thuộc tính',
  //     lg: 8,
  //     toggle: true,
  //     toggleValue: showProperty,
  //     setToggleValue: setShowProperty,
  //     toggleLabel: '',
  //     body: <></>
  //   }
  // ]

  return (
    <>
      <span className='flex-between'>
        <BackPreviousPage path='/app/products' text='Quay lại danh sách sản phẩm' />
        <Button className='m-0 mb-3'>
          <i className='feather icon-plus-circle'></i>
          Lưu sản phẩm
        </Button>
      </span>
      <Formik initialValues={initialValues} validate={validate} onSubmit={handleSubmit}>
        <Form>
          <div className='w-full flex gap-6'>
            <div className='w-[65%]  h-96'>
              <div className='flex flex-col gap-6'>
                <div className='bg-white shadow-md'>
                  <Title label='Hình thức quản lý' />
                  <div className='px-8 py-4'>
                    <FormBootstrap.Check
                      type='radio'
                      checked
                      className='text-normal'
                      label='Sản phẩm thường'
                    ></FormBootstrap.Check>
                  </div>
                </div>

                <div className='bg-white shadow-md'>
                  <Title label='Thông tin chung' />
                  <div className='px-7 py-4'>
                    <div className='flex flex-col'>
                      <Field
                        id='product_name'
                        name='product_name'
                        render={({ field, form }: FieldProps<FormValues['product_name']>) => (
                          <div className='flex flex-col pb-2'>
                            <label className='mb-[4px]' htmlFor='product_name'>
                              Tên sản phẩm <span className='text-red-500'>*</span>
                            </label>
                            <input
                              type='text'
                              id='product_name'
                              {...field}
                              className={`rounded-sm px-2.5 py-2.5 ${
                                form.touched.product_name && form.errors.product_name ? 'error-field' : 'style-field'
                              }`}
                              placeholder='Nhập tên sản phẩm'
                            />
                            <ErrorMessage
                              className='text-red-500 text-sm ml-2 mt-0.5'
                              name='product_name'
                              component='div'
                            />
                          </div>
                        )}
                        type='text'
                      />

                      <div className='grid grid-cols-2 w-full gap-x-5 gap-y-4'>
                        {DataFields.map((item, index) => (
                          <Field
                            key={index}
                            id={item.id}
                            name={item.label}
                            render={({ field, form }: FieldProps<any>) => (
                              <div className='flex flex-col'>
                                <label className='text-start mb-[4px]' htmlFor={item.id}>
                                  {item.label}
                                </label>
                                <div className={`${index === 1 && 'flex flex-row'}`}>
                                  <input
                                    type={item.type}
                                    id={item.id}
                                    {...field}
                                    className={`rounded-sm px-2.5 py-2.5 style-field w-full`}
                                  />
                                  {index === 1 && (
                                    <select className='w-[25%] style-select rounded-r-sm'>
                                      {optionUnitWeight.map((item, index) => (
                                        <option key={index} value={item.weight}>
                                          {item.label}
                                        </option>
                                      ))}
                                    </select>
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

                <div className='bg-white shadow-md relative'>
                  <Title label='Giá sản phẩm' />
                  <div className='px-7 pt-3'>
                    <div className='grid grid-cols-2 gap-x-5 gap-y-4 relative'>
                      {optionPricePolicy.map((item: any, index) => (
                        <Field
                          key={index}
                          id={item}
                          name='product_name'
                          render={({ field, form }: FieldProps<FormValues['product_name']>) => (
                            <div className='flex flex-col'>
                              <label className='text-start mb-[4px]' htmlFor='product_name'>
                                {item.label}
                              </label>
                              <input
                                type='number'
                                id='product_name'
                                {...field}
                                className={`rounded-sm px-2.5 py-2.5 style-field w-full`}
                                placeholder=''
                              />
                            </div>
                          )}
                          type='text'
                        />
                      ))}
                      {!showMore && (
                        <button className='button-showmore' onClick={() => setShowMore(true)}>
                          <HiChevronDoubleDown />
                          <span>Hiển thị thêm chính sách giá</span>
                        </button>
                      )}
                    </div>
                  </div>
                  <button className='text-blue font-bold flex gap-1 absolute top-4 right-4 hover:opacity-60 duration-200 active:opacity-100'>
                    <i className='feather icon-plus-circle'></i>
                    Thêm chính sách giá
                  </button>
                </div>

                <div
                  className={`bg-white shadow-md relative overflow-hidden duration-200  ${
                    value ? 'h-[250px]' : 'h-[102px]'
                  }`}
                >
                  <Title
                    subTitle='Thêm mới thuộc tính giúp sản phẩm có nhiều lựa chọn, như kích cỡ hay màu sắc'
                    label='Thuộc tính'
                  />
                  <div className='absolute top-[7px] left-36'>
                    <div className='switch switch-primary d-inline m-r-10'>
                      <input
                        id='toggleCheck'
                        checked={value}
                        onChange={() => setValue((prevState: any) => !prevState)}
                        type='checkbox'
                      />
                      <label htmlFor='toggleCheck' className='cr'>
                        {' '}
                      </label>
                    </div>
                  </div>

                  <div className='px-7 pt-3'>
                    <div className='flex gap-5'>
                      <Field
                        id='properties'
                        name='properties'
                        render={({ field, form }: FieldProps<FormValues['product_name']>) => (
                          <div className='flex flex-col w-[35%]'>
                            <label className='text-start mb-[4px] font-semibold text-black' htmlFor='product_name'>
                              Tên thuộc tính
                            </label>
                            <input
                              type='text'
                              id='product_name'
                              {...field}
                              className={`rounded-sm px-2.5 py-2.5 style-field w-full`}
                              placeholder=''
                            />
                          </div>
                        )}
                        type='text'
                      />

                      <Field
                        id='properties'
                        name='properties'
                        render={({ field, form }: FieldProps<FormValues['product_name']>) => (
                          <div className='flex flex-col flex-1'>
                            <label className='text-start mb-[4px] font-semibold text-black' htmlFor='product_name'>
                              Giá trị
                            </label>
                            <input
                              type='text'
                              id='product_name'
                              {...field}
                              className={`rounded-sm px-2.5 py-2.5 style-field w-full`}
                              placeholder=''
                            />
                          </div>
                        )}
                        type='text'
                      />
                    </div>
                    {value && (
                      <button className='text-blue font-bold flex gap-1 absolute bottom-4 left-6 hover:opacity-60 duration-200 active:opacity-100'>
                        <i className='feather icon-plus-circle'></i>
                        Thêm thuôc tính khác
                      </button>
                    )}
                  </div>
                </div>

                <div className='h-96'></div>
              </div>
            </div>

            <div className='w-[35%] bg-white'>
              <Title label='Thông tin bổ sung' />
              <div className='mt-3 px-2.5'>
                {additionalInfo.map((info, index) => (
                  <InputProductForm
                    key={`generalInfo_${index}`}
                    sm={info.sm}
                    lg={info.lg}
                    label={info.label}
                    placeholder={info.placeholder}
                    optionsSelect={
                      info.optionsSelect === 'optionsTag'
                        ? optionsTag
                        : info.optionsSelect === 'optionsBrand'
                        ? optionsBrand
                        : optionsType
                    }
                    name={info.name}
                    value={dataProduct[info.name]}
                    inputType={info.inputType}
                    onChange={handleChange}
                    isMulti={info.isMulti}
                  />
                ))}
              </div>
            </div>
          </div>
        </Form>
      </Formik>
    </>
  )
}

export default ProductCreate
