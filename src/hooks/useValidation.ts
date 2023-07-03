import * as Yup from 'yup'

const phoneRegExp = /^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0|3|4|5|7|8])+([0-9]{7})$/

//----------------------AUTH----------------------
export const validationSchemaRegister = Yup.object().shape({
  name: Yup.string().max(255).required('Tên không được bỏ trống'),
  phone: Yup.string().matches(phoneRegExp, 'Số điện thoại không hợp lệ').required('Vui lòng nhập số điện thoại'),
  email: Yup.string().email('Địa chỉ email không hợp lệ').max(255).required('Vui lòng nhập địa chỉ Email'),
  password: Yup.string().max(255).required('Vui lòng nhập mật khẩu').min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
  repassword: Yup.string()
    .oneOf([Yup.ref('password'), ''], 'Mật khẩu nhập lại không khớp')
    .required('Vui lòng nhập lại mật khẩu xác nhận')
})

export const validationSchemaResetPassword = Yup.object().shape({
  email: Yup.string()
    .email('Địa chỉ email không hợp lệ')
    .max(255, 'Địa chỉ email vượt quá độ dài cho phép')
    .required('Vui lòng nhập địa chỉ Email')
})

//----------------------CUSTOMER----------------------
export const validationSchemaCustomerCreate = Yup.object().shape({
  name: Yup.string().required('Tên khách hàng không được để trống'),
  email: Yup.string().email('Email không hợp lệ').required('Email không được để trống'),
  phone: Yup.string().matches(phoneRegExp, 'Số điện thoại không hợp lệ').required('Số điện thoại không được để trống'),
  code: Yup.string().required('Mã khách hàng không được để trống'),
  address: Yup.string().required('Địa chỉ không được để trống'),
  province: Yup.string().required('Vui lòng chọn Tỉnh/Thành phố')
})

export const validationSchemaCustomerEdit = Yup.object().shape({
  name: Yup.string().required('Tên khách hàng không được để trống'),
  email: Yup.string().email('Email không hợp lệ').required('Email không được để trống'),
  phone: Yup.string().matches(phoneRegExp, 'Số điện thoại không hợp lệ').required('Số điện thoại không được để trống'),
  code: Yup.string().required('Mã khách hàng không được để trống')
})

//----------------------CUSTOMER-ADDITIONAL-DATA----------------------
export const validationSchemaAddresses = Yup.object().shape({
  address: Yup.string().required('Địa chỉ không được để trống'),
  province: Yup.string().required('Vui lòng chọn Tỉnh/Thành phố')
})

//----------------------STAFF or USER----------------------
export const validationSchemaUserCreate = Yup.object().shape({
  name: Yup.string().required('Tên nhân viên không được để trống'),
  phone: Yup.string().matches(phoneRegExp, 'Số điện thoại không hợp lệ').required('Số điện thoại không được để trống'),
  address: Yup.string().required('Địa chỉ không được để trống'),
  dob: Yup.date().required('Ngày sinh không được bỏ trống'),
  province: Yup.string().required('Vui lòng chọn Tỉnh/Thành phố'),
  password: Yup.string().required('Mật khẩu không được để trống').min(8, 'Mật khẩu phải có tối thiểu 8 kí tự'),
  positions: Yup.array().of(
    Yup.object().shape({
      role: Yup.mixed().required('Vui lòng chọn ít nhất một vai trò'),
      branches: Yup.array()
        .min(1, 'Vui lòng chọn ít nhất một chi nhánh')
        .required('Vui lòng chọn ít nhất một chi nhánh')
    })
  )
})

export const validationSchemaUserEdit = Yup.object().shape({
  staff_name: Yup.string().required('Tên nhân viên không được để trống')
  // staff_email: Yup.string().email('Email không hợp lệ').nullable(),
  // staff_phone: Yup.string()
  //   .matches(phoneRegExp, 'Số điện thoại không hợp lệ')
  //   .required('Số điện thoại không được để trống'),
  // address: Yup.string().required('Địa chỉ không được để trống'),
  // province: Yup.string().required('Vui lòng chọn Tỉnh/Thành phố và Quận/Huyện')
})

//----------------------ROLE----------------------
export const validationSchemaUserRole = Yup.object().shape({
  role_title: Yup.string().required('Tên vai trò không được để trống')
})

//----------------------BRANCH----------------------
export const validationSchemaBranch = Yup.object().shape({
  name: Yup.string().required('Tên chi nhánh không được để trống'),
  phone: Yup.string().matches(phoneRegExp, 'Số điện thoại không hợp lệ').required('Số điện thoại không được để trống'),
  address: Yup.string().required('Địa chỉ không được để trống'),
  code: Yup.string().required('Mã chi nhánh không được để trống')
})

//----------------------PRODUCT----------------------
export const validationSchemaProperty = Yup.object().shape({
  property1: Yup.string()
    .required('Tên thuộc tính không được để trống')
    .matches(/^[a-zA-ZÀ-Ỹà-ỹ\s]+$/, 'Chỉ được nhập chữ vào tên thuộc tính'),
  property2: Yup.string()
    .required('Tên thuộc tính không được để trống')
    .test('notOneOf', 'Tên các thuộc tính không được trùng nhau', function (value) {
      const property1 = this.resolve(Yup.ref('property1')) as string
      return !value || !property1 || value.toLowerCase() !== property1.toLowerCase()
    })
    .matches(/^[a-zA-ZÀ-Ỹà-ỹ\s]+$/, 'Chỉ được nhập chữ vào tên thuộc tính'),
  property3: Yup.string()
    .required('Tên thuộc tính không được để trống')
    .test('notOneOf', 'Tên các thuộc tính không được trùng nhau', function (value) {
      const property1 = this.resolve(Yup.ref('property1')) as string
      const property2 = this.resolve(Yup.ref('property2')) as string
      return (
        !value ||
        !property1 ||
        !property2 ||
        (value.toLowerCase() !== property1.toLowerCase() && value.toLowerCase() !== property2.toLowerCase())
      )
    })
    .matches(/^[a-zA-ZÀ-Ỹà-ỹ\s]+$/, 'Chỉ được nhập chữ vào tên thuộc tính')
})

export const validationSchemaProductCreate = Yup.object().shape({
  product_name: Yup.string().required('Tên sản phẩm không được để trống')
})
