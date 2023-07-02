import { Modal, Button } from 'react-bootstrap'

interface CustomModalProps {
  size?: any
  show: boolean
  handleClose: any
  title?: string
  body: any
  disabled: boolean
  handleSubmit: any
  textSubmit: any
  deleteBtn?: boolean
  handleDelete?: any
  textDelete?: any
  isDelete?: boolean
  centered?: boolean
}

function CustomModal(props: CustomModalProps) {
  const {
    centered = false,
    size,
    show,
    handleClose,
    handleSubmit,
    title,
    body,
    textSubmit,
    disabled,
    deleteBtn,
    handleDelete,
    textDelete,
    isDelete
  } = props

  return (
    <Modal centered={centered} size={size} show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title as='h5'>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        {deleteBtn ? (
          <Button disabled={isDelete} onClick={handleDelete} variant='danger'>
            {textDelete}
          </Button>
        ) : null}
        <Button variant='secondary' onClick={handleClose}>
          Thoát
        </Button>
        <Button disabled={disabled} variant='primary' onClick={handleSubmit}>
          {textSubmit}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default CustomModal
