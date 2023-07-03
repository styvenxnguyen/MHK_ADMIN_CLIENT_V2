import { useState } from 'react'
import { Pagination } from 'react-bootstrap'

const CustomPagination = ({ currentPage, totalPages, onPageChange }: any) => {
  const maxPageButtons = 5 // Số lượng button trang tối đa được hiển thị
  const [previousPage, setPreviousPage] = useState(currentPage) // Lưu trữ trang hiện tại trước đó

  // Tính toán các số trang để hiển thị
  const pageButtons: any = []
  let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2))
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1)

  if (endPage - startPage < maxPageButtons - 1) {
    startPage = Math.max(1, endPage - maxPageButtons + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pageButtons.push(i)
  }

  // Xử lý sự kiện khi click vào button trang
  const handlePageChange = (event: any) => {
    const newPage = parseInt(event.target.text)

    // Kiểm tra nếu trang hiện tại bằng trang mới được click thì không cập nhật lại state và không gọi onPageChange
    // Khi click 2 lần vào nút số trang đang được active thì sẽ e.target.text = null và parseInt(...) = NaN
    // Ngăn chặn việc bị mất render các button số trang
    if (!isNaN(newPage) && previousPage !== newPage) {
      setPreviousPage(currentPage)
      onPageChange(newPage)
    }
  }

  // Render các button trang
  const renderPageButtons = () => {
    return pageButtons.map((page: any) => (
      <Pagination.Item key={page} active={page === currentPage} onClick={handlePageChange}>
        {page}
      </Pagination.Item>
    ))
  }

  return (
    <Pagination className='justify-content-end'>
      <Pagination.First disabled={currentPage === 1} onClick={() => onPageChange(1)} />
      <Pagination.Prev disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)} />
      {startPage > 1 && <Pagination.Ellipsis />}
      {renderPageButtons()}
      {endPage < totalPages && <Pagination.Ellipsis />}
      <Pagination.Next disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)} />
      <Pagination.Last disabled={currentPage === totalPages} onClick={() => onPageChange(totalPages)} />
    </Pagination>
  )
}

export default CustomPagination
