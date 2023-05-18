import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { BASENAME } from '~/config/constants'
import routes, { renderRoutes } from './routes'
import { JWTProvider } from './contexts/JWTContext'

function App() {
  return (
    <React.Fragment>
      <Router basename={BASENAME}>
        <JWTProvider>{renderRoutes(routes)}</JWTProvider>
      </Router>
    </React.Fragment>
  )
}

export default App
