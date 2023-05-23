import { Button } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import Swal from 'sweetalert2'

interface BackPreviousPageProps {
  path: any
  text: string
}

const BackPreviousPage = ({ path, text }: BackPreviousPageProps) => {
  const history = useHistory()
  const sweetConfirmAlert = () => {
    Swal.fire({
      title: 'Bạn có chắc chắn muốn thoát ?',
      text: 'Mọi dữ liệu của bạn sẽ không được thay đổi',
      icon: 'question',
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Quay lại',
      showCancelButton: true
    }).then((isExit) => {
      if (isExit.isConfirmed) {
        return history.replace(path)
      }
    })
  }
  return (
    <Button onClick={sweetConfirmAlert} variant='outline-primary' className='m-0 mb-3'>
      <i className='feather icon-arrow-left'></i>
      {text}
    </Button>
  )
}

export default BackPreviousPage
