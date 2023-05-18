import React from 'react'
import { Redirect } from 'react-router-dom'

import useAuth from '~/hooks/useAuth'

const AuthGuard = ({ children }: any) => {
  const { isLoggedIn } = useAuth()

  if (!isLoggedIn) {
    return <Redirect to='/login' />
  }

  return <React.Fragment>{children}</React.Fragment>
}

export default AuthGuard
