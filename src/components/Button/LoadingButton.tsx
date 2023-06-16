import { Button } from 'react-bootstrap'

interface BtnLoadingProps {
  onSubmit?: any
  text: any
  loading?: boolean
  disabled?: boolean
  className?: string
  variant?: string
  type?: string
}

const Loader = () => {
  return (
    <span>
      <i className='spinner-border spinner-border-sm mr-1' role='status'></i>Đang xử lý...
    </span>
  )
}

export const ButtonLoading = ({ onSubmit, text, loading, disabled, className, variant, type }: BtnLoadingProps) => {
  return (
    <Button onClick={onSubmit} type={type} disabled={disabled} className={className} variant={variant}>
      {!loading ? text : <Loader />}
    </Button>
  )
}
