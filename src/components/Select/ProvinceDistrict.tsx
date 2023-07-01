import { useState, useEffect } from 'react'
import axios from 'axios'
import Select from 'react-select'
import { Col, Form, Row } from 'react-bootstrap'

const ProvinceDistrictSelect = ({ onChange, initialValues }: any) => {
  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [selectedProvince, setSelectedProvince]: any = useState(null)
  const [selectedDistrict, setSelectedDistrict]: any = useState(null)

  const customNoOptionMessage = (province: any) => {
    if (province === true) return 'Tỉnh/Thành phố bạn đang tìm kiếm không tồn tại'
    else return 'Vui lòng chọn Tỉnh/Thành phố trước'
  }

  const customPlaceholder = (placeholder: any) => {
    return (
      <span className='flex-between'>
        <span>Tìm kiếm hoặc chọn {placeholder}</span>
        <i className='feather icon-search'></i>
      </span>
    )
  }

  useEffect(() => {
    axios
      .get('https://provinces.open-api.vn/api/?depth=2')
      .then((response) => {
        const data = response.data
        const options = data.map((province: any) => ({
          value: province.code,
          label: province.name,
          districts: province.districts
        }))
        setProvinces(options)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [])

  useEffect(() => {
    if (initialValues.province && selectedProvince !== initialValues.province) {
      const provinceOption: any = provinces.find((province: any) => province.label === initialValues.province)
      if (provinceOption) {
        setSelectedProvince(provinceOption)
        setDistricts(
          provinceOption.districts.map((district: any) => ({
            value: district.code,
            label: district.name
          }))
        )
      }
    }
  }, [initialValues.province, provinces, selectedProvince])

  useEffect(() => {
    if (initialValues.district && selectedDistrict !== initialValues.district) {
      const districtOption: any = districts.find((district: any) => district.label === initialValues.district)
      if (districtOption) {
        setSelectedDistrict(districtOption)
      }
    }
  }, [initialValues.district, districts, selectedDistrict])

  const handleProvinceChange = (selectedOption: any) => {
    setSelectedProvince(selectedOption)
    setSelectedDistrict(null)
    setDistricts(
      selectedOption.districts.map((district: any) => ({
        value: district.code,
        label: district.name
      }))
    )
    onChange(selectedOption.label, '---')
  }

  const handleDistrictChange = (selectedOption: any) => {
    setSelectedDistrict(selectedOption)
    onChange(selectedProvince.label, selectedOption.label)
  }

  return (
    <Row>
      <Col sm={12} lg={6}>
        <Form.Label>
          Chọn Tỉnh/Thành phố <span className='text-c-red'>*</span>
        </Form.Label>
        <Select
          value={selectedProvince}
          noOptionsMessage={() => customNoOptionMessage(true)}
          options={provinces}
          onChange={handleProvinceChange}
          placeholder={customPlaceholder('Tỉnh/Thành phố')}
        />
      </Col>
      <Col sm={12} lg={6}>
        <Form.Label>Chọn Quận/Huyện</Form.Label>
        <Select
          value={selectedDistrict}
          noOptionsMessage={() => customNoOptionMessage(false)}
          options={districts}
          onChange={handleDistrictChange}
          placeholder={customPlaceholder('Quận/Huyện')}
        />
      </Col>
    </Row>
  )
}

export default ProvinceDistrictSelect
