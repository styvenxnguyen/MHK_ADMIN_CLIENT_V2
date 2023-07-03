import { Form } from 'react-bootstrap'

interface SwitchProps {
  id: string
  value: any
  setValue: any
  label: string
}

export default function ToggleSwitch({ id, value, setValue, label }: SwitchProps) {
  return (
    <Form.Group>
      <div className='switch switch-primary d-inline m-r-10'>
        <input id={id} checked={value} onChange={() => setValue((prevState: any) => !prevState)} type='checkbox' />
        <label htmlFor={id} className='cr'>
          {' '}
        </label>
      </div>
      <Form.Label htmlFor={id}>{label ? label : ''}</Form.Label>
    </Form.Group>
  )
}
