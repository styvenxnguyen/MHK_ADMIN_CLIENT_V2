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
      {
        exact: true,
        path: '/app/customers/detail/:id',
        component: lazy(() => import('./views/Customers/Detail'))
      },
      {
        exact: true,
        path: '/app/customers/detail/:id/edit',
        component: lazy(() => import('./views/Customers/Edit'))
      },

      //-------------------DELIVERY---------------------------
      {
        exact: true,
        path: '/app/deliveries',
        component: lazy(() => import('./views/Deliveries'))
      },

      //-------------------PRODUCTS---------------------------
      {
        exact: true,
        path: '/app/products',
        component: lazy(() => import('./views/Products'))
      },
      {
        exact: true,
        path: '/app/products/create',
        component: lazy(() => import('./views/Products/Create'))
      },
      {
        exact: true,
        path: '/app/products/detail/:id',
        component: lazy(() => import('./views/Products/Detail'))
      },

      //-------------------PRODUCTS: PURCHASE ORDERS---------------------------
      {
        exact: true,
        path: '/app/purchase_orders',
        component: lazy(() => import('./views/Products/Purchase_Orders'))
      },
      {
        path: '/app/purchase_orders/create',
        component: lazy(() => import('./views/Products/Purchase_Orders/Create_Edit'))
      },
      {
        exact: true,
        path: '/app/purchase_orders/detail/:id',
        component: lazy(() => import('./views/Products/Purchase_Orders/Detail'))
      },
      {
        exact: true,
        path: '/app/purchase_orders/detail/:id/edit',
        component: lazy(() => import('./views/Products/Purchase_Orders/Create_Edit'))
      },

      //-------------------SUPPLIERS---------------------------
      {
        exact: true,
        path: '/app/suppliers',
        component: lazy(() => import('./views/Products/Suppliers'))
      },
      {
        exact: true,
        path: '/app/suppliers/detail/:id',
        component: lazy(() => import('./views/Products/Suppliers/Detail'))
      },

      //-------------------ORDERS---------------------------
      {
        exact: true,
        path: '/app/orders',
        component: lazy(() => import('./views/Orders'))
      },
      {
        exact: true,
        path: '/app/orders/create',
        component: lazy(() => import('./views/Orders/Create_Edit'))
      },
      {
        exact: true,
        path: '/app/orders/detail/:id',
        component: lazy(() => import('./views/Orders/Detail'))
      },
      {
        exact: true,
        path: '/app/orders/detail/:id/edit',
        component: lazy(() => import('./views/Orders/Create_Edit'))
      },

      //-------------------APPLICATIONS---------------------------
      {
        exact: true,
        path: '/app/applications',
        component: lazy(() => import('./views/Applications'))
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
      },
      {
        exact: true,
        path: '/app/configurations/users/create',
        component: lazy(() => import('./views/Configurations/Users/Create'))
      },
      {
        exact: true,
        path: '/app/configurations/users/detail/:id',
        component: lazy(() => import('./views/Configurations/Users/Detail'))
      },

      //-------------------CONFIGURATIONS: USERS - TENANT ROLES---------------------------
      {
        exact: true,
        path: '/app/configurations/users/roles',
        component: lazy(() => import('./views/Configurations/Users/Roles'))
      },

      //-------------------CONFIGURATIONS: BRANCHES---------------------------
      {
        exact: true,
        path: '/app/configurations/branches',
        component: lazy(() => import('./views/Configurations/Branches'))
      },

      //-------------------CONFIGURATIONS: PRICE POLICIES---------------------------
      {
        exact: true,
        path: '/app/configurations/price-policies',
        component: lazy(() => import('./views/Configurations/PricePolicies'))
      }
    ]
  }
]

export default routes
