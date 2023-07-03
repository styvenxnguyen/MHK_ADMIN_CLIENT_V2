import moment from 'moment'

export const formatCurrency = (value: number) => {
  const intValue = Math.floor(value)
  const formattedValue = intValue.toLocaleString()
  return formattedValue
}

export const formatDate = (value: string) => {
  return moment(value).utcOffset(7).format('DD/MM/YYYY - HH:mm:ss')
}
