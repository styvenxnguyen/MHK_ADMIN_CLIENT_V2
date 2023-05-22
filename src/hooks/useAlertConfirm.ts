import Swal from 'sweetalert2'

interface Props {
  title?: string
  html?: string
  text?: string
  icon?: any
  confirmText?: string
  handleConfirmed?: any
  showCancelButton: boolean
}

export const handleAlertConfirm = ({
  title,
  html,
  text,
  icon,
  confirmText,
  handleConfirmed,
  showCancelButton
}: Props) => {
  Swal.fire({
    title: title,
    html: html,
    text: text,
    icon: icon,
    confirmButtonText: confirmText,
    showCancelButton: showCancelButton
  }).then((isConfirm) => {
    if (isConfirm.isConfirmed) {
      {
        handleConfirmed() || window.location.reload()
      }
    }
  })
}
