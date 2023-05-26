import { Col, Form, FormControl, FormGroup } from 'react-bootstrap'
import Select from 'react-select'

interface InputProps {
  sm: number
  lg: number
  label: string
  require?: boolean
  inputType: string
  name: string
  placeholder?: any
  onChange: any
  value: any
}

const InputForm = ({ sm, lg, label, require, inputType, name, placeholder, onChange, value }: InputProps) => {
  return (
    <>
      <Col lg={lg} sm={sm}>
        <FormGroup>
          <Form.Label>
            {label} {require ? <span className='text-c-red'>*</span> : null}
          </Form.Label>
          {inputType === 'text' ? (
            <FormControl
              name={name}
              placeholder={placeholder}
              onChange={onChange}
              type='text'
              value={value}
            ></FormControl>
          ) : (
            <Select />
          )}
        </FormGroup>
      </Col>
    </>
  )
}

export default InputForm
