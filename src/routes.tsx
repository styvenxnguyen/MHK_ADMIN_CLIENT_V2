import React, { Suspense, Fragment, lazy } from 'react'
import { Switch, Redirect, Route } from 'react-router-dom'
import RouteLoader from './components/Loader/RouteLoad'
import GuestGuard from './components/Auth/GuestGuard'

interface RouteType {
  exact: boolean
  path: string
  guard?: any
  component: any
  layout?: any
  routes?: any[]
}

export function renderRoutes(routes: RouteType[] = []) {
  return (
    <Suspense fallback={<RouteLoader />}>
      <Switch>
        {routes.map((route, i) => {
          const Guard = route.guard || Fragment
          const Layout = route.layout || Fragment
          const Component = route.component

          return (
            <Route
              key={i}
              path={route.path}
              exact={route.exact}
              render={(props: any) => (
                <Guard>
                  <Layout>{route.routes ? renderRoutes(route.routes) : <Component {...props} />}</Layout>
                </Guard>
              )}
            />
          )
        })}
      </Switch>
    </Suspense>
  )
}

const routes: any = [
  {
    exact: true,
    guard: GuestGuard,
    path: '/login',
    component: lazy(() => import('~/views/auth/login'))
  },
  {
    exact: true,
    path: '/register',
    component: lazy(() => import('~/views/auth/register'))
  },
  {
    exact: true,
    path: '/reset-password',
    component: lazy(() => import('~/views/auth/reset-password'))
  }
]

export default routes
