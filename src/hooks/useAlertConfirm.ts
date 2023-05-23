import Swal from 'sweetalert2'

interface Props {
  title?: string
  html?: string
  text?: string
  icon?: any
  confirmText?: string
  handleConfirmed?: any
  showCancelButton?: boolean
  confirmButtonColor?: string
}

export const handleAlertConfirm = ({
  title,
  html,
  text,
  icon,
  confirmText,
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
    showCancelButton: showCancelButton || false
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
