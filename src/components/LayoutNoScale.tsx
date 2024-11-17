import { useAnimation } from 'motion/react'
import type { PropsWithChildren } from 'react'

type Props = PropsWithChildren<{
  layoutDependency?: unknown
}>

/**
 * Prevents scale of children during layout animation
 */
export function LayoutNoScale({ children, layoutDependency }: Props) {
  /** container element */
  const ref = useRef<HTMLDivElement>(null!)
  const controls = useAnimation()
  const size = useRef<{ width: number; height: number } | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  useInsertionEffect(() => {
    if (!ref.current) return
    size.current = {
      width: ref.current.offsetWidth,
      height: ref.current.offsetHeight,
    }
  }, [layoutDependency])

  useLayoutEffect(() => {
    const newHeight = ref.current.offsetHeight
    const newWidth = ref.current.offsetWidth

    if (size.current) {
      const animating = abortControllerRef.current
      const ac = new AbortController()

      if (animating) {
        animating.abort()
        controls.stop()
      } else {
        controls.set(size.current)
      }

      abortControllerRef.current = ac

      controls.start({ width: newWidth, height: newHeight }).then(() => {
        if (ac.signal.aborted) return
        abortControllerRef.current = null
        controls.set({ width: '100%', height: '100%' })
      })
    }

    size.current = {
      width: newWidth,
      height: newHeight,
    }
  }, [layoutDependency])

  return (
    <motion.div
      // prevent size animation
      layout="position"
      layoutDependency={layoutDependency}
      ref={ref}
      className="size-full"
    >
      <motion.div
        className="size-full"
        // animate width and height instead of scale
        animate={controls}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
