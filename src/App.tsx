import { MotionConfig } from 'framer-motion'
import { Suspense } from 'react'
import { BrowserRouter as Router, RouterProvider, createBrowserRouter } from 'react-router-dom'
import routes from '~react-pages'

const router = createBrowserRouter(routes, {
  basename: import.meta.env.BASE_URL,
})

export default function App() {
  return (
    <MotionConfig transition={{ type: 'tween' }}>
      <RouterProvider router={router} />
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
