import React from 'react'
import { BASE_URL } from '~/config/constants'
import useAuth from '../../hooks/useAuth'
import PageLoader from '../Loader/PageLoader'

const GuestGuard = ({ children }: any) => {
  const { isLoggedIn } = useAuth()

  if (isLoggedIn) {
    setTimeout(() => {
      window.location.replace(BASE_URL)
    }, 2000)
    return <PageLoader option='100vh' />
  }

  return <React.Fragment>{children}</React.Fragment>
}

export default GuestGuard
