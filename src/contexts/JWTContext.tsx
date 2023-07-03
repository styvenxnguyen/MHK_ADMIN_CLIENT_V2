/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useEffect, useReducer } from 'react'
import jwtDecode from 'jwt-decode'

import { ACCOUNT_INITIALISE, LOGIN, LOGOUT } from '../store/actions'
import accountReducer from '~/store/accountReducer'
import Loader from '~/components/Loader/RouteLoad'
import { axiosConfig } from '~/utils/configAxios'

const initialState = {
  isLoggedIn: false,
  isInitialised: false,
  user: null
}

const verifyToken = (accessToken: string) => {
  if (!accessToken) {
    return false
  }

  const decoded: any = jwtDecode(accessToken)
  return decoded.exp > Date.now() / 1000
}

const setSession = (accessToken: string) => {
  if (accessToken) {
    localStorage.setItem('access_token', accessToken)
    // services.defaults.headers.common.Authorization = `${serviceToken}`;
  } else {
    localStorage.removeItem('access_token')
    // delete services.defaults.headers.common.Authorization;
  }
}

const JWTContext = createContext({
  ...initialState,
  login: (phone: number, password: any) => {
    Promise.resolve()
    console.log(phone, password)
  },
  logout: () => {}
})

export const JWTProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(accountReducer, initialState)

  const login = async (phone: number, password: string) => {
    const response = await axiosConfig.post('/auth/login', { phone, password })
    const { data, user } = response.data
    const accessToken = data
    setSession(accessToken)
    dispatch({
      type: LOGIN,
      payload: {
        user
      }
    })
  }

  const logout = () => {
    setSession('')
    dispatch({ type: LOGOUT })
  }

  useEffect(() => {
    const init = async () => {
      try {
        const accessToken = window.localStorage.getItem('access_token')
        if (accessToken && verifyToken(accessToken)) {
          setSession(accessToken)
          // const response = await axiosConfig.get('/auth/me')
          // const userData = response.data.data
          dispatch({
            type: ACCOUNT_INITIALISE,
            payload: {
              isLoggedIn: true,
              user: ''
            }
          })
        } else {
          dispatch({
            type: ACCOUNT_INITIALISE,
            payload: {
              isLoggedIn: false,
              user: null
            }
          })
        }
      } catch (err) {
        dispatch({
          type: ACCOUNT_INITIALISE,
          payload: {
            isLoggedIn: false,
            user: null
          }
        })
      }
    }

    init()
  }, [])

  if (!state.isInitialised) {
    return <Loader />
  }

  return <JWTContext.Provider value={{ ...state, login, logout }}>{children}</JWTContext.Provider>
}

export default JWTContext
