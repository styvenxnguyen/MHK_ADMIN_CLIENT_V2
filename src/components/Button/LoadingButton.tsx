import { Button } from 'react-bootstrap'

const Loader = () => {
  return (
    <span>
      <i className='spinner-border spinner-border-sm mr-1' role='status'></i>Đang xử lý...
    </span>
  )
}

export const ButtonLoading = ({ onSubmit, text, loading, disabled, className, variant }: any) => {
  return (
    <Button onClick={onSubmit} disabled={disabled} className={className} variant={variant}>
      {!loading ? text : <Loader />}
    </Button>
  )
}
