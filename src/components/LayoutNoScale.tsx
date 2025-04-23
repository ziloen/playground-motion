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
    const el = ref.current
    if (!el) return
    size.current = {
      width: el.offsetWidth,
      height: el.offsetHeight,
    }
  }, [layoutDependency])

  useLayoutEffect(() => {
    const newHeight = ref.current.offsetHeight
    const newWidth = ref.current.offsetWidth

    if (size.current) {
      const animating = abortControllerRef.current
      const ac = (abortControllerRef.current = new AbortController())

      if (animating) {
        animating.abort()
        controls.stop()
      } else {
        controls.set(size.current)
      }

      controls.start({ width: newWidth, height: newHeight }).then(() => {
        // FIXME: Not working sometimes if set immediately
        requestAnimationFrame(() => {
          if (ac.signal.aborted) return
          abortControllerRef.current = null

          controls.set({ width: '100%', height: '100%' })
        })
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
      test-id="layout-no-scale"
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
