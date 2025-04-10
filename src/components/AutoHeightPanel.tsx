import type { Transition } from 'motion/react'
import { useAnimation } from 'motion/react'
import type { PropsWithChildren } from 'react'

type Props = PropsWithChildren<{
  className?: string
  innerClassName?: string
  transition?: Transition
}>

export function AutoHeightPanel({
  children,
  className,
  innerClassName,
  transition,
}: Props) {
  const ref = useRef<HTMLDivElement>(null!)
  const controls = useAnimation()

  useEffect(() => {
    const ro = new ResizeObserver(([entry]) => {
      const size = entry.contentBoxSize[0]
      if (!size) return

      controls.start({
        height: size.blockSize,
      })
    })

    ro.observe(ref.current)

    return () => ro.disconnect()
  }, [])

  return (
    <motion.div
      animate={controls}
      transition={transition ?? { type: 'tween', duration: 0.2 }}
      className={className}
    >
      <div ref={ref} className={innerClassName}>
        {children}
      </div>
    </motion.div>
  )
}

/**
 * TODO:With dependency
 */
function TransitionHeight() {}
