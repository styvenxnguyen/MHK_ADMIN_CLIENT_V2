import { HashLoader } from 'react-spinners'

interface PageLoaderProps {
  option?: string
  className?: string
}

const PageLoader = ({ option, className }: PageLoaderProps) => {
  return (
    <HashLoader
      style={{ height: option ? option : '80vh' }}
      className={className ? className : 'd-block m-auto'}
      color='#36d7b7'
    />
  )
}

export default PageLoader
