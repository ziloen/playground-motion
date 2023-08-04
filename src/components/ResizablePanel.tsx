import { useSize } from 'ahooks'
import { PropsWithChildren } from 'react'

export function ResizablePanel({ children }: PropsWithChildren) {
  const ref = useRef<HTMLDivElement>(null)
  const size = useSize(ref)

  return (
    <motion.div animate={{ height: size?.height }} transition={{ type: 'tween', duration: 0.2 }}>
      <div ref={ref}>{children}</div>
    </motion.div>
  )
}