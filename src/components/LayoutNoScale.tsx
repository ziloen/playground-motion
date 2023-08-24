import { useAnimation } from 'framer-motion'
import { type PropsWithChildren } from 'react'
import { useResizeObserver } from '~/hooks'

type Props = PropsWithChildren<{
  layoutDependency?: unknown
}>


export function LayoutNoScale({
  children,
  layoutDependency
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const controls = useAnimation()

  useResizeObserver(ref, ([entry]) => {
    if (!entry) return
    const { inlineSize, blockSize } = entry.contentBoxSize[0]!
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
