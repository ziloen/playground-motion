import { useAnimation } from 'framer-motion'
import type { PropsWithChildren } from 'react'

type Props = PropsWithChildren<{
  layoutDependency?: unknown
}>

/**
 * Prevents scale of children during layout animation
 *
 * TODO: Only animate width and height when laout animation is triggered
 */
export function LayoutNoScale({ children, layoutDependency }: Props) {
  /** container element */
  const ref = useRef<HTMLDivElement>(null!)
  const controls = useAnimation()

  // animate child width and height when container size change
  useEffect(() => {
    const ro = new ResizeObserver(([entry]) => {
      const size = entry.contentBoxSize[0]
      if (!size) return

      const { inlineSize, blockSize } = size

      controls.start({
        width: inlineSize,
        height: blockSize,
      })
    })

    ro.observe(ref.current)

    return () => ro.disconnect()
  }, [])

  return (
    <motion.div
      // prevent size animation
      layout="position"
      layoutDependency={layoutDependency}
      ref={ref}
      className="relative size-full"
    >
      <motion.div
        className="absolute size-full"
        // animate width and height instead of scale
        animate={controls}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
