import { Col, Form, FormControl, FormGroup } from 'react-bootstrap'
import Select from 'react-select'

interface InputProductProps {
  sm: number
  lg: number
  label: string
  require?: boolean
  inputType: string
  name: string
  placeholder?: any
  onChange: any
  value: any
  optionsSelect?: any
  isMulti?: boolean,
  dir?: boolean
}

const InputProductForm = ({
  sm,
  lg,
  label,
  require,
  inputType,
  name,
  placeholder,
  onChange,
  value,
  optionsSelect,
  isMulti,
  dir
}: InputProductProps) => {
  const noOptionsMessage = () => 'Đang tải dữ liệu...'
  return (
    <>
      <Col lg={lg} sm={sm}>
        <FormGroup>
          <Form.Label>
            {label} {require ? <span className='text-c-red'>*</span> : null}
          </Form.Label>
          {inputType === 'text' && (
            <FormControl
              name={name}
              placeholder={placeholder}
              onChange={onChange}
              type='text'
              value={value}
            ></FormControl>
          )}
          {inputType === 'group' && (
            <FormGroup className='d-flex row'>
              <Col lg={9}>
                <FormControl
                  name={name}
                  placeholder={placeholder}
                  className='no-spin'
                  onChange={onChange}
                  type='text'
                  dir={dir ? 'rtl' : ''}
                  value={value}
                ></FormControl>
              </Col>
              <Col lg={3}>
                <Select options={optionsSelect} defaultValue={optionsSelect[0]} />
              </Col>
            </FormGroup>
          )}
          {inputType === 'select' && (
            <Select
              isMulti={isMulti ? true : false}
              options={optionsSelect}
              placeholder={placeholder}
              noOptionsMessage={noOptionsMessage}
            ></Select>
          )}
        </FormGroup>
      </Col>
    </>
  )
}

export default InputProductForm
