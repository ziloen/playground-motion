import { MotionConfig } from 'framer-motion'
import { Suspense } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import routes from '~react-pages'

export default function App() {
  return (
    <MotionConfig transition={{ type: 'tween' }}>
      <Router>
        <Routes />
      </Router>
    </MotionConfig>
  )
}

function Routes() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      {useRoutes(routes)}
    </Suspense>
  )
}
