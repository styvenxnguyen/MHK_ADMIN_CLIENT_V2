import Swal, { SweetAlertIcon } from 'sweetalert2'

interface Props {
  title?: string
  html?: string
  text?: string
  icon?: SweetAlertIcon
  confirmText?: string
  cancelText?: string
  handleConfirmed?: () => void
  showCancelButton?: boolean
  confirmButtonColor?: string
}

export const handleAlertConfirm = ({
  title,
  html,
  text,
  icon,
  confirmText,
  cancelText,
  handleConfirmed,
  showCancelButton,
  confirmButtonColor
}: Props) => {
  Swal.fire({
    title: title,
    html: html,
    text: text,
    icon: icon,
    confirmButtonText: confirmText || 'Xác nhận',
    confirmButtonColor: confirmButtonColor || undefined,
    showCancelButton: showCancelButton || false,
    cancelButtonText: cancelText || 'Huỷ'
  }).then((isConfirm) => {
    if (isConfirm.isConfirmed) {
      if (handleConfirmed) {
        handleConfirmed()
      } else {
        window.location.reload()
      }
    }
  })
}
