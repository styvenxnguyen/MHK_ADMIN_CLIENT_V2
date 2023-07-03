import { withNProgress } from '@tanem/react-nprogress'
import Bar from './Bar'
import Container from './Container'

interface ProgressValue {
  isFinished: boolean
  animationDuration: number
  progress: number
}

const Progress = (props: ProgressValue) => {
  return (
    <Container animationDuration={props.animationDuration} isFinished={props.isFinished}>
      <Bar animationDuration={props.animationDuration} progress={props.progress} />
    </Container>
  )
}

export default withNProgress(Progress)
