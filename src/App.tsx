import { MotionConfig, useAnimate, useAnimation } from 'framer-motion'
import { Suspense } from 'react'
import { RouterProvider, createHashRouter, useLocation } from 'react-router-dom'
import routes from '~react-pages'

const router = createHashRouter(routes)

function LoadingPage({ onLoaded, onLoading }: {
  onLoading: () => void
  onLoaded: () => void
}) {
  useEffect(() => {
    onLoading()
    return onLoaded
  }, [])

  return null
}

export default function App() {
  const [loading, setLoading] = useState(false)
  const delayPromise = useRef<Promise<void>>()

  function onLoading() {
    setLoading(true)
    delayPromise.current = new Promise(resolve => setTimeout(resolve, 1000))
  }

  function onLoaded() {
    delayPromise.current!.then(() => setLoading(false))
  }

  return (
    <MotionConfig transition={{ type: 'tween' }}>
      <Suspense fallback={<LoadingPage
        onLoading={onLoading}
        onLoaded={onLoaded}
      />}>
        <RouterProvider router={router} />
      </Suspense>

      {/* Actual loading page */}
      <AnimatePresence>
        {loading &&
          <motion.div
            className='absolute inset-0 bg-blue'
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
          >
            <p>Loading...</p>
          </motion.div>
        }
      </AnimatePresence>

    </MotionConfig>
  )
}
