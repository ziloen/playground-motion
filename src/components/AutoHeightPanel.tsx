import { useAnimation } from 'framer-motion'
import type { PropsWithChildren } from 'react'
import { useResizeObserver } from '~/hooks'

type Props = PropsWithChildren<{
  className?: string
  innerClassName?: string
}>

export function AutoHeightPanel({ children, className, innerClassName }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const controls = useAnimation()

  useResizeObserver(ref, ([entry]) => {
    if (!ref.current) return
    if (!entry) return
    const size = entry.contentBoxSize[0]
    if (!size) return

    controls.start({
      height: size.blockSize,
    })
  })

  return (
    <motion.div
      animate={controls}
      transition={{ type: 'tween', duration: 0.2 }}
      className={className}
    >
      <div
        ref={ref}
        className={innerClassName}
      >
        {children}
      </div>
    </motion.div>
  )
}