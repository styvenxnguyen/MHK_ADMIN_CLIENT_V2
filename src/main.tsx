import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.scss'
import reportWebVitals from './reportWebVitals.ts'
import { Provider } from 'react-redux'
import store from './store/index.ts'
import { ConfigProvider } from './contexts/ConfigContext.tsx'
import 'regenerator-runtime/runtime'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <ConfigProvider>
      <App />
    </ConfigProvider>
  </Provider>
)

reportWebVitals()
