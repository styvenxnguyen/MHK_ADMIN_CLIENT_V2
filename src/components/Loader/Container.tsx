interface ProgressTime {
  animationDuration: number
  children: React.ReactNode
  isFinished: boolean
}

const Container = (props: ProgressTime) => {
  return (
    <div
      style={{
        opacity: props.isFinished ? 0 : 1,
        pointerEvents: 'none',
        transition: `opacity ${props.animationDuration}ms linear`
      }}
    >
      {props.children}
    </div>
  )
}

export default Container
