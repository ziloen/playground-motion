import type { Box } from 'framer-motion'
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
  /** container element */
  const ref = useRef<HTMLDivElement>(null)
  const controls = useAnimation()

  // animate child width and height when container size change
  useResizeObserver(ref, ([entry]) => {
    if (!ref.current) return
    if (!entry) return
    const size = entry.contentBoxSize[0]
    if (!size) return

    const { inlineSize, blockSize } = size

    controls.start({
      width: inlineSize,
      height: blockSize,
    })
  })

  const cb = useRef<{ w: number; h: number }>()
  const pb = useRef<{ w: number; h: number }>()
  function onLayoutMeasure(box: Box, prevBox?: Box | undefined) {
    const w = box.x.max - box.x.min
    const h = box.y.max - box.y.min
    const pw = prevBox ? (prevBox.x.max - prevBox.x.min) : undefined
    const ph = prevBox ? (prevBox.y.max - prevBox.y.min) : undefined

    if (w === pw && h === ph) return

    pb.current = cb.current
    cb.current = { w, h }


    console.log('box:', w, h, 'prevBox:', pw, ph)
  }

  function onLayoutAnimationStart() {
    console.log('onLayoutAnimationStart')
  }

  function onLayoutAnimationComplete() {
    console.log('onLayoutAnimationComplete')
  }

  function onBeforeLayoutMeasure(box: Box) {
    console.log('onBeforeLayoutMeasure', box && box.x.max - box.x.min, box && box.y.max - box.y.min)
  }

  return (
    <motion.div
      // prevent size animation
      layout="position"
      layoutDependency={layoutDependency}
      onLayoutMeasure={onLayoutMeasure}
      onLayoutAnimationStart={onLayoutAnimationStart}
      onLayoutAnimationComplete={onLayoutAnimationComplete}
      onBeforeLayoutMeasure={onBeforeLayoutMeasure}
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