import { useState, useCallback, useEffect, useMemo } from 'react'
import CustomTable from '../Table/CustomTable'
import DebtService from '~/services/debt.service'
import { Debt } from '~/types/Debt.type'
import { formatCurrency, formatDate } from '~/utils/common'

interface DebtProps {
  id: string
  value: string
}

const Debt = ({ id, value }: DebtProps) => {
  const [isFetched, setIsFetched] = useState(false)
  const [changeLogsDebt, setChangeLogsDebt] = useState<Debt[]>([])
  const columns = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id'
      },
      {
        Header: 'Ngày tạo',
        accessor: 'createdAt',
        Cell: ({ value }: any) => formatDate(value)
      },
      {
        Header: 'Ngày ghi nhận',
        accessor: 'updatedAt',
        Cell: ({ value }: any) => formatDate(value)
      },
      {
        Header: 'Hành động',
        accessor: 'action'
      },
      {
        Header: 'Ghi chú',
        accessor: 'debt_note'
      },
      {
        Header: 'Giá trị thay đổi',
        accessor: 'change_debt',
        Cell: ({ value }: any) => formatCurrency(value * -1)
      },
      {
        Header: 'Tổng công nợ',
        accessor: 'debt_amount',
        Cell: ({ value }: any) => formatCurrency(Math.abs(value))
      }
    ],
    []
  )

  const getDebtLogs = useCallback(() => {
    DebtService.getAllChangeLogs(id).then((res) => {
      const data = res.data.data
      setChangeLogsDebt(data)
      setIsFetched(true)
    })
  }, [id])

  useEffect(() => {
    getDebtLogs()
  }, [getDebtLogs])

  if (!isFetched) {
    return (
      <p className='text-center text-normal strong-title'>
        {value === 'customer' ? 'Khách hàng' : 'Nhà cung cấp'} chưa có dữ liệu công nợ
      </p>
    )
  }

  return <CustomTable data={changeLogsDebt} columns={columns} hiddenColumns={['selection', 'id']} />
}

export default Debt
