import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MotionConfig } from 'framer-motion'
import { Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
import routes from '~react-pages'

function Routes() {
  return useRoutes(routes)
}

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <MotionConfig transition={{ type: 'tween' }}>
          <Suspense>
            <AnimatePresence mode="wait" initial={false}>
              <Routes />
            </AnimatePresence>
          </Suspense>
        </MotionConfig>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
