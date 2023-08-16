import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'

import '@unocss/reset/tailwind.css'
import 'uno.css'
import './styles/main.css'

createRoot(document.querySelector('#root')!).render(
  <HashRouter>
    <App />
  </HashRouter>
)
