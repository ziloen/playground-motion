import { Box, useAnimation } from 'framer-motion'
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
  /** container element */
  const ref = useRef<HTMLDivElement>(null)
  const controls = useAnimation()

  // animate child width and height when container size change
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

  function onLayoutMeasure(box: Box, prevBox?: Box | undefined) {
    const w = box.x.max - box.x.min
    const h = box.y.max - box.y.min
    console.log(w, h)

    if (!prevBox) return
    const pw = prevBox.x.max - prevBox.x.min
    const ph = prevBox.y.max - prevBox.y.min
    console.log(pw, ph)
  }

  return (
    <motion.div
      // prevent size animation
      layout="position"
      layoutDependency={layoutDependency}
      onLayoutMeasure={onLayoutMeasure}
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