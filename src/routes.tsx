import { Suspense, Fragment, lazy } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import RouteLoader from './components/Loader/RouteLoad'
import GuestGuard from './components/Auth/GuestGuard'
import AdminLayout from '~/layouts/Admin'
import AuthGuard from './components/Auth/AuthGuard'
import Error from './views/Errors'

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
        <Redirect exact from='/' to='/app/dashboard/sell' />
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
        <Route path='*'>
          <Error errorCode='404' />
        </Route>
      </Switch>
    </Suspense>
  )
}

const routes: any = [
  {
    exact: true,
    guard: GuestGuard,
    path: '/login',
    component: lazy(() => import('./views/Auth/Login'))
  },
  {
    exact: true,
    path: '/register',
    component: lazy(() => import('./views/Auth/Register'))
  },
  {
    exact: true,
    path: '/reset-password',
    component: lazy(() => import('./views/Auth/ResetPassword'))
  },
  {
    path: '*',
    layout: AdminLayout,
    guard: AuthGuard,
    routes: [
      //-------------------DASHBOARD---------------------------
      {
        exact: true,
        path: '/app/dashboard/sell',
        component: lazy(() => import('./views/Dashboards/Sell'))
      },
      {
        exact: true,
        path: '/app/dashboard/crm',
        component: lazy(() => import('./views/Dashboards/Crm'))
      },

      //-------------------CUSTOMERS---------------------------
      {
        exact: true,
        path: '/app/customers',
        component: lazy(() => import('./views/Customers'))
      },
      {
        exact: true,
        path: '/app/customers/create',
        component: lazy(() => import('./views/Customers/Create'))
      },

      //-------------------CONFIGURATIONS---------------------------
      {
        exact: true,
        path: '/app/configurations',
        component: lazy(() => import('./views/Configurations'))
      },

      //-------------------CONFIGURATIONS: USERS---------------------------
      {
        exact: true,
        path: '/app/configurations/users',
        component: lazy(() => import('./views/Configurations/Users'))
      }
    ]
  }
]

export default routes
