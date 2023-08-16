import { MotionConfig } from 'framer-motion'
import { Suspense } from 'react'
import {
  Route,
  Routes,
  useLocation
} from 'react-router-dom'
import routes from '~react-pages'

const routeElements = routes.map(route => (
  <Route
    key={route.path}
    path={route.path}
    element={route.element}
  />
))

export default function App() {
  const location = useLocation()

  return (
    <MotionConfig transition={{ type: 'tween' }}>
      <Suspense fallback={
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
        >
          Loading...
        </motion.div>
      }>
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            {routeElements}
          </Routes>
        </AnimatePresence>
      </Suspense>
    </MotionConfig>
  )
}