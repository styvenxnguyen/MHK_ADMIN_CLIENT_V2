export const formatCurrency = (value: number) => {
  const intValue = Math.floor(value) // Chuyển đổi số thành số nguyên
  const formattedValue = intValue.toLocaleString() // Phân giá trị tiền bằng dấu phẩy
  return formattedValue
}

// const formatCurrency = (value: number) => {
//   const formattedValue = value.toFixed(2) // Định dạng số với hai số thập phân
//   const parts = formattedValue.toString().split('.') // Tách phần nguyên và phần thập phân
//   parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') // Thêm dấu phẩy vào phần nguyên
//   return parts.join('.') // Kết hợp lại phần nguyên và phần thập phân
// }
