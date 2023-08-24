import { useAnimation } from 'framer-motion'
import { type PropsWithChildren } from 'react'
import { useResizeObserver } from '~/hooks'

type Props = PropsWithChildren<{
  layoutDependency?: unknown
}>

/**
 * Prevents scale of children during layout animation
 * 
 * TODO: Only animate width and height when laout animation is triggered
 */
export function LayoutNoScale({
  children,
  layoutDependency
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const controls = useAnimation()

  useResizeObserver(ref, ([entry]) => {
    if (!entry) return
    const size = entry.contentBoxSize[0]
    if (!size) return

    const { inlineSize, blockSize } = size

    controls.start({
      width: inlineSize,
      height: blockSize,
    })
  })

  return (
    <motion.div
      layout="position"
      layoutDependency={layoutDependency}
      ref={ref}
      className="h-full h-full relative"
    >
      <motion.div
        className='absolute h-full w-full'
        animate={controls}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}