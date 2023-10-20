import { MotionConfig } from 'framer-motion'
import { Suspense } from 'react'
import {
  HashRouter
} from 'react-router-dom'
import routes from '~react-pages'


function Routes() {
  return useRoutes(routes)
}

export default function App() {
  return (
    <HashRouter>
      <MotionConfig transition={{ type: 'tween' }}>
        <Suspense>
          <AnimatePresence mode="wait" initial={false}>
            <Routes />
          </AnimatePresence>
        </Suspense>
      </MotionConfig>
    </HashRouter>
  )
}


// export default function AppWithRouter() {
//   return (
//     <HashRouter>
//       <App />
//     </HashRouter>
//   )
// }