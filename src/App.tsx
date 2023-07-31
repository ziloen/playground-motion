import { MotionConfig } from 'framer-motion'
import { Suspense } from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import routes from '~react-pages'

const router = createBrowserRouter(routes, {
  basename: import.meta.env.BASE_URL,
})

export default function App() {
  return (
    <MotionConfig transition={{ type: 'tween' }}>
      <Suspense fallback={<p>Loading...</p>}>
        <RouterProvider router={router} />
      </Suspense>
    </MotionConfig>
  )
}
