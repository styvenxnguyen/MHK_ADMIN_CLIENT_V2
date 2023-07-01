/* eslint-disable react/no-unknown-property */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect, useState } from 'react'
import { useTable, usePagination, useGlobalFilter, useRowSelect, useSortBy } from 'react-table'
import { Row, Col, CloseButton, Dropdown, DropdownButton } from 'react-bootstrap'
import BTable from 'react-bootstrap/Table'
import Swal from 'sweetalert2'
import CustomPagination from '../Pagination'
import GlobalFilter from '../Filter/GlobalFilter'
import { axiosConfig } from '~/utils/configAxios'
import NoData from '~/views/Errors/svg/NoData.svg'

type CustomInitialState = {
  pageIndex: number
  hiddenColumns: any
  sortBy: { id: string; desc: boolean }[]
}

interface TableProps {
  columns: any
  data: any
  hiddenColumns?: any
  handleRowClick?: any
  selectedTitle?: any
  object?: any
  ButtonAdd?: any
}

function CustomTable({
  columns,
  data,
  hiddenColumns = ['id'],
  handleRowClick,
  selectedTitle,
  object,
  ButtonAdd
}: TableProps) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    page,
    globalFilter,
    setGlobalFilter,
    pageOptions,
    selectedFlatRows,
    preGlobalFilteredRows,
    pageCount,
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize }
  }: any = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex: 0,
        pageSize: 30,
        hiddenColumns,
        sortBy: [{ id: 'createdAt', desc: true }]
      } as CustomInitialState
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: 'selection',
          Header: ({ getToggleAllRowsSelectedProps }: any) => (
            <div style={{ width: '25px', textAlign: 'center' }}>
              <input
                type='checkbox'
                {...getToggleAllRowsSelectedProps()}
                title='Chọn tất cả'
                indeterminate={selectedFlatRows.length > 0 ? selectedFlatRows.length : undefined}
              />
            </div>
          )
        },
        ...columns
      ])
    }
  )

  const clickableColumns = ['user_code', 'customer_name', 'product_name', 'product_SKU', 'order_code', 'staff_name']
  const [showGoToPage, setShowGoToPage] = useState(false)
  const [showErrorPage, setShowErrorPage] = useState(false)
  const [pagePagination, setPagePagination] = useState('')
  const [currentPage, setCurrentPage] = useState(pageIndex + 1)

  const selectedRows = selectedFlatRows.map((row: any) => row.original)
  const selectedCount = selectedFlatRows.length

  const promises = selectedRows.map((row: any) =>
    axiosConfig.delete(`/${object}/delete-by-id/${row.id}`, { data: row })
  )

  const handlePageChange = (newPage: any) => {
    setCurrentPage(newPage)
    setShowGoToPage(false)
    gotoPage(newPage - 1)
  }

  const handleDeleteRow = () => {
    Swal.fire({
      title: `Xoá ${selectedTitle} ?`,
      html: `Bạn có chắc chắn muốn xoá các ${selectedTitle} đã chọn ? </br>Thao tác này không thể khôi phục.`,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Xoá',
      cancelButtonText: 'Thoát',
      confirmButtonColor: 'red',
      icon: 'warning'
    }).then((isConfirm) => {
      if (isConfirm.isConfirmed) {
        Promise.all(promises)
          .then(() => {
            Swal.fire({
              title: 'Thành công',
              html: `Đã xoá ${selectedCount} ${selectedTitle} khỏi danh sách`,
              showCancelButton: false,
              showConfirmButton: true,
              icon: 'success'
            }).then((isConfirm) => {
              if (isConfirm.isConfirmed) {
                window.location.reload()
              }
            })
          })
          .catch(() => {
            Swal.fire('Thất bại', `Đã xảy ra lỗi khi xoá các ${selectedTitle} đã chọn`, 'error')
          })
      }
    })
  }

  const handleCloseBtn = () => {
    setShowGoToPage(false)
    setPagePagination('')
    setShowErrorPage(false)
  }

  useEffect(() => {
    setCurrentPage(pageIndex + 1)
  }, [pageIndex])

  if (data.length === 0) {
    return (
      <div className='d-flex justify-content-center align-items-center flex-column'>
        <img src={NoData} alt='NoData' width={290} />
        <h4 className='mt-5'>KHÔNG TÌM THẤY DỮ LIỆU PHÙ HỢP DO DANH SÁCH BỊ TRỐNG</h4>
      </div>
    )
  }

  return (
    <>
      <Row className='mb-3'>
        <Col className='d-flex align-items-center'>
          Hiển thị
          <select
            className='form-control w-auto mx-2'
            defaultValue={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value))
            }}
          >
            {[30, 50, 100].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
          <span className='strong-title text-normal mr-1'>/ {preGlobalFilteredRows.length} </span>
          kết quả
          {selectedCount === 0 ? null : (
            <span className='flex-between'>
              <span className='text-normal' style={{ marginLeft: '100px' }}>
                Đã chọn {selectedCount}/{rows.length} {selectedTitle}{' '}
              </span>
              <DropdownButton
                variant='secondary'
                className='ml-2 custom-button'
                id='dropdown-selectedRow'
                title='Chọn thao tác'
              >
                <Dropdown.Item className='custom-dropdown-item' href='#/action-1'>
                  Cập nhật thông tin
                </Dropdown.Item>
                <Dropdown.Item className='custom-dropdown-item' href='#/action-2'>
                  Cập nhật trạng thái
                </Dropdown.Item>
                <Dropdown.Item className='custom-dropdown-item' onClick={handleDeleteRow}>
                  Xoá
                </Dropdown.Item>
              </DropdownButton>
            </span>
          )}
        </Col>

        <Col className='d-flex justify-content-end align-items-center'>
          <GlobalFilter
            filter={globalFilter}
            setFilter={setGlobalFilter}
            setValueInputPagination={setPagePagination}
            setShowErrorPage={setShowErrorPage}
          />
          {ButtonAdd ? (
            <span className='ml-2'>
              <ButtonAdd />
            </span>
          ) : null}
        </Col>
      </Row>
      <BTable bordered hover responsive {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup: any) => (
            <tr key={headerGroup.Header} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column: any, index: any) => (
                <th key={`headerTable_${index}`} {...column.getHeaderProps()}>
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row: any) => {
            prepareRow(row)
            return (
              <tr key={row.values.id} {...row.getRowProps()}>
                {row.cells.map((cell: any) => {
                  if (cell.column.id === 'selection') {
                    return (
                      <td key={row.values.id} style={{ width: '50px', textAlign: 'center' }} {...cell.getCellProps()}>
                        <input
                          {...row.getToggleRowSelectedProps()}
                          type='checkbox'
                          {...cell.getCellProps()}
                          indeterminate={selectedFlatRows.length > 0 ? selectedFlatRows.length : undefined}
                          title=''
                        />
                      </td>
                    )
                  } else if (clickableColumns.includes(cell.column.id)) {
                    return (
                      <td
                        className='text-click'
                        key={row.values.id}
                        onClick={() => {
                          handleRowClick(row)
                        }}
                        {...cell.getCellProps()}
                      >
                        {cell.render('Cell')}
                      </td>
                    )
                  } else {
                    return (
                      <td key={row.values.id} {...cell.getCellProps()}>
                        {cell.render('Cell')}
                      </td>
                    )
                  }
                })}
              </tr>
            )
          })}
        </tbody>
      </BTable>
      <Row className='justify-content-between mt-3'>
        <Col sm={12} md={6}>
          <span className='d-flex align-items-center'>
            Trang{' '}
            <strong className='ml-1 mr-1'>
              {' '}
              {pageIndex + 1} trên tổng {pageOptions.length}{' '}
            </strong>{' '}
            |
            <span className='custom-a ml-1 mr-1' onClick={() => setShowGoToPage(true)}>
              Chọn nhanh trang
            </span>{' '}
            {showGoToPage ? (
              <span className='flex-between'>
                <input
                  id='page-input'
                  type='number'
                  placeholder='Số trang'
                  className='form-control ml-2'
                  value={pagePagination}
                  onChange={(e) => {
                    setPagePagination(e.target.value)
                    const page = e.target.value ? Number(e.target.value) - 1 : 0
                    gotoPage(page)
                  }}
                  onKeyDown={(e) => {
                    const inputVal = parseInt((e.target as HTMLInputElement).value + e.key)
                    if (e.key === '-' || e.key === '+' || e.key === '.' || e.key === 'e') {
                      e.preventDefault()
                    } else if (inputVal > pageOptions.length || inputVal === 0) {
                      e.preventDefault()
                      setShowErrorPage(true)
                    } else {
                      setShowErrorPage(false)
                    }
                  }}
                  style={{ width: '100px' }}
                  min='1'
                  max={pageOptions.length}
                  title='Nhập số trang'
                />
                <CloseButton onClick={handleCloseBtn} className='ml-3' aria-label='hide' />
                {showErrorPage ? (
                  <span className='text-c-red ml-3'>Số trang hiện có : {pageOptions.length}</span>
                ) : null}
              </span>
            ) : null}
          </span>
        </Col>
        <Col sm={12} md={6}>
          <CustomPagination currentPage={currentPage} totalPages={pageCount} onPageChange={handlePageChange} />
        </Col>
      </Row>
    </>
  )
}

export default CustomTable
