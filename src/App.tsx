import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MotionConfig } from 'motion/react'
import { Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import routes from '~react-pages'

const router = createBrowserRouter(routes, {
  basename: import.meta.env.BASE_URL,
})

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MotionConfig transition={{ type: 'tween' }}>
        <Suspense>
          <AnimatePresence mode="wait" initial={false}>
            <RouterProvider router={router} />
          </AnimatePresence>
        </Suspense>
      </MotionConfig>
    </QueryClientProvider>
  )
}
