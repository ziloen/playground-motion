import { PropsWithChildren } from 'react'
import useMeasure from 'react-use-measure'

type Props = PropsWithChildren<{
  className?: string
  innerClassName?: string
}>

export function AutoHeightPanel({ children, className, innerClassName }: Props) {
  const [ref, size] = useMeasure()

  return (
    <motion.div
      animate={{ height: size.height || undefined }}
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