import { type PropsWithChildren } from 'react'
import useMeasure from 'react-use-measure'

type Props = PropsWithChildren<{
  layoutDependency?: unknown
}>


export function LayoutNoScale({
  children,
  layoutDependency
}: Props) {
  const [ref, { width, height }] = useMeasure()

  return (
    <motion.div
      layout="position"
      layoutDependency={layoutDependency}
      ref={ref}
      className="h-full h-full relative"
    >
      <motion.div
        className='absolute'
        initial={{ height: '100%', width: '100%' }}
        animate={{ height: height || '100%', width: width || '100%' }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
