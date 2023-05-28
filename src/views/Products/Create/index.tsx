import { useState, useEffect } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { additionalInfo, generalInfo } from './allProductInfo'
import InputProductForm from './Form/Input'
import BackPreviousPage from '~/components/Button/BackPreviousPage'
import CardProductComponent from './Form/Card'
import { getBrandsList, getPricePoliciesList, getTagsList, getTypesList } from '~/services/api'

const ProductCreate = () => {
  const [optionsTag, setOptionsTag] = useState([])
  const [optionsType, setOptionsType] = useState([])
  const [optionsBrand, setOptionsBrand] = useState([])
  const [pricePoliciesList, setPricePoliciesList] = useState([])
  const [showProperty, setShowProperty] = useState(false)
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

  const handleChange = (event: any) => {
    const { name, value } = event.target
    setDataProduct((prevData: any) => ({
      ...prevData,
      [name]: value
    }))
  }

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

    getPricePoliciesList().then((response) => {
      const pricePoliciesListData = response.data.data
      setPricePoliciesList(
        pricePoliciesListData.map((price: any) => ({
          label: price.price_type,
          name: price.price_type
        }))
      )
    })
  }, [])

  const cardInfo = [
    {
      title: 'Hình thức quản lý',
      lg: 8,
      body: (
        <Col>
          <Form.Check type='radio' checked className='text-normal' label='Sản phẩm thường'></Form.Check>
        </Col>
      )
    },
    {
      title: 'Thông tin bổ sung',
      lg: 4,
      body: additionalInfo.map((info, index) => (
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
      ))
    },
    {
      title: 'Thông tin chung',
      lg: 8,
      body: generalInfo.map((info, index) => (
        <InputProductForm
          key={`generalInfo_${index}`}
          sm={info.sm}
          lg={info.lg}
          label={info.label}
          dir={info.dir}
          optionsSelect={info.optionsSelect}
          placeholder={info.placeholder}
          name={info.name}
          value={dataProduct[info.name]}
          inputType={info.inputType}
          require={info.require}
          onChange={handleChange}
        />
      ))
    },
    {
      title: 'Giá sản phẩm',
      lg: 8,
      body: pricePoliciesList.map((price: any, index) => (
        <InputProductForm
          key={`pricePolicies_${index}`}
          sm={12}
          lg={6}
          label={price.label}
          name={price.name}
          onChange={handleChange}
          inputType='text'
          value={dataProduct[price.name]}
        />
      ))
    },
    {
      title: 'Thuộc tính',
      lg: 8,
      toggle: true,
      toggleValue: showProperty,
      setToggleValue: setShowProperty,
      toggleLabel: '',
      body: <></>
    }
  ]

  return (
    <>
      <span className='flex-between'>
        <BackPreviousPage path='/app/products' text='Quay lại danh sách sản phẩm' />
        <Button className='m-0 mb-3'>
          <i className='feather icon-plus-circle'></i>
          Lưu sản phẩm
        </Button>
      </span>

      <Row>
        <Col lg={8}>
          {cardInfo.map((card, index) => (
            <span key={`cardProduct${card.lg}_${index}`}>
              {card.lg === 8 && <CardProductComponent title={card.title} body={card.body} toggle={card.toggle} />}
            </span>
          ))}
        </Col>
        <Col lg={4}>
          {cardInfo.map((card, index) => (
            <span key={`cardProduct${card.lg}_${index}`}>
              {card.lg === 4 && <CardProductComponent title={card.title} body={card.body} toggle={card.toggle} />}
            </span>
          ))}
        </Col>
      </Row>
    </>
  )
}

export default ProductCreate
