export const formatCurrency = (value: number) => {
  const intValue = Math.floor(value) // Chuyển đổi số thành số nguyên
  const formattedValue = intValue.toLocaleString() // Phân giá trị tiền bằng dấu phẩy
  return formattedValue
}
