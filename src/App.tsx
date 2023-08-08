import { MotionConfig } from 'framer-motion'
import { Suspense } from 'react'
import { RouterProvider, createHashRouter, useLocation } from 'react-router-dom'
import routes from '~react-pages'

const router = createHashRouter(routes, {
  // basename: import.meta.env.BASE_URL,
})

function LoadingPage() {
  return (
    <AnimatePresence>
      <motion.div
        className='grid place-items-center absolute inset-0 bg-sky'
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
      >
        <p className='text-black'>Loading...</p>
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {

  return (
    <MotionConfig transition={{ type: 'tween' }}>
      <Suspense fallback={<LoadingPage />}>
        <RouterProvider router={router} />
      </Suspense>
    </MotionConfig>
  )
}
