import { HashLoader } from 'react-spinners'

const PageLoader = ({ option }: any) => {
  return <HashLoader style={{ height: option ? option : '70vh' }} className='d-block m-auto' color='#36d7b7' />
}

export default PageLoader
