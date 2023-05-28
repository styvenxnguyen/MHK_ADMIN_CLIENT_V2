import { Card, Col, Row } from 'react-bootstrap'
import ToggleSwitch from '~/components/Toggle/Switch'

interface CardProductProps {
  title: string
  lg?: number
  body: any
  toggle?: boolean
  toggleValue?: boolean
  setToggleValue?: any
  toggleLabel?: any
}
const CardProductComponent = ({ title, body, toggle, toggleValue, setToggleValue, toggleLabel }: CardProductProps) => {
  return (
    <Row>
      <Col>
        <Card>
          <Card.Header className='d-flex align-items-center'>
            <Card.Title as='h5'>{title}</Card.Title>
            {toggle && (
              <ToggleSwitch id={toggleLabel} value={toggleValue} setValue={setToggleValue} label={toggleLabel} />
            )}
          </Card.Header>
          <Card.Body>
            <Row>{body}</Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}

export default CardProductComponent
