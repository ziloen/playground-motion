import { useLatest } from 'ahooks'
import { ValueAnimationTransition, animate, useMotionValue } from 'framer-motion'
import { type PropsWithChildren } from 'react'
import { useResizeObserver } from '~/hooks'

type Props = PropsWithChildren<{
  layoutDependency?: unknown
  transition?: ValueAnimationTransition | undefined
}>


/** 
 * Prevent layout scale during layout animation.
 */
export function LayoutNoScale({
  children,
  layoutDependency,
  transition
}: Props) {
  /** container element */
  const ref = useRef<HTMLDivElement>(null)
  /** is container layout animating */
  const layoutAnimating = useRef(false)
  type Size = '100%' | number
  /** child width */
  const width = useMotionValue<Size>('100%')
  /** child height */
  const height = useMotionValue<Size>('100%')
  /** container size */
  const containerSize = useRef({ w: '100%' as Size, h: '100%' as Size })

  const transitionRef = useLatest(transition)

  useResizeObserver(ref, ([entry]) => {
    if (!entry) return
    const size = entry.contentBoxSize[0]
    if (!size) return

    const { inlineSize: w, blockSize: h } = size

    setSize: {
      // If layout is not animating, skip animation
      if (!layoutAnimating.current) break setSize

      width.stop()
      height.stop()
      const options: ValueAnimationTransition = transitionRef.current || { type: 'tween', duration: .3 }
      animate(width, w, options)
        .then(() => {
          if (layoutAnimating.current) return
          width.set('100%')
        })
      animate(height, h, options)
        .then(() => {
          if (layoutAnimating.current) return
          height.set('100%')
        })
    }

    // save container size
    containerSize.current = { w, h }
  })

  function onLayoutAnimationStart() {
    layoutAnimating.current = true
    const { w: lw, h: lh } = containerSize.current
    // set last size before container size change
    width.set(lw)
    height.set(lh)
  }

  function onLayoutAnimationComplete() {
    layoutAnimating.current = false
  }

  return (
    <motion.div
      layout="position"
      layoutDependency={layoutDependency}
      onLayoutAnimationStart={onLayoutAnimationStart}
      onLayoutAnimationComplete={onLayoutAnimationComplete}
      ref={ref}
      className="h-full h-full relative"
    >
      <motion.div
        className='absolute'
        style={{ width, height }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
