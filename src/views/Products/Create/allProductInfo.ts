export const generalInfo = [
  {
    label: 'Tên sản phẩm',
    lg: 12,
    sm: 12,
    name: 'product_name',
    placeholder: 'Nhập tên sản phẩm',
    inputType: 'text',
    require: true
  },
  {
    label: 'Mã sản phẩm',
    lg: 6,
    sm: 12,
    name: 'product_code',
    placeholder: 'Nhập mã sản phẩm',
    inputType: 'text'
  },
  {
    label: 'Khối lượng',
    lg: 6,
    sm: 12,
    name: 'product_weight',
    inputType: 'group',
    dir: true,
    optionsSelect: [
      {
        label: 'g',
        value: 'g'
      },
      {
        label: 'kg',
        value: 'kg'
      }
    ]
  },
  {
    label: 'Mã vạch/Barcode',
    lg: 6,
    sm: 12,
    name: 'product_barcode',
    placeholder: 'Nhập tay hoặc sử dụng quét vạch để quét mã vạch (3-15 kí tự)',
    inputType: 'text'
  },
  {
    label: 'Đơn vị tính',
    lg: 6,
    sm: 12,
    name: 'product_unit_price',
    placeholder: 'Nhập đơn vị tính',
    inputType: 'text'
  }
]

export const additionalInfo = [
  {
    label: 'Loại sản phẩm',
    lg: 12,
    sm: 12,
    name: 'product_type',
    inputType: 'select',
    optionsSelect: 'optionsType',
    isMulti: false,
    placeholder: 'Chọn loại sản phẩm'
  },
  {
    label: 'Nhãn hiệu',
    lg: 12,
    sm: 12,
    name: 'product_brand',
    inputType: 'select',
    optionsSelect: 'optionsBrand',
    isMulti: false,
    placeholder: 'Chọn nhãn hiệu'
  },
  {
    label: 'Tags',
    lg: 12,
    sm: 12,
    name: 'product_tags',
    inputType: 'select',
    optionsSelect: 'optionsTag',
    isMulti: true,
    placeholder: 'Chọn tags'
  }
]
