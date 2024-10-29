import { useMotionValue, useSpring, useTransform } from 'framer-motion'

export default function HoverCard() {
  const ref = useRef<HTMLDivElement>(null)
  const enterX = useRef(0)
  const enterY = useRef(0)

  const dxMV = useMotionValue(0)
  const dyMV = useMotionValue(0)
  const dx = useSpring(dxMV, { damping: 15 })
  const dy = useSpring(dyMV, { damping: 15 })

  return (
    <div className="px-8 pt-8">
      <motion.div
        ref={ref}
        onMouseEnter={(e) => {
          enterX.current = e.nativeEvent.x
          enterY.current = e.nativeEvent.y
        }}
        onMouseMove={(e) => {
          if (!ref.current) return
          const dx = e.clientX - enterX.current
          const dy = e.clientY - enterY.current
          const factor = -0.15
          const x = dx * factor
          const y = dy * factor * 1.2

          dxMV.set(x)
          dyMV.set(y)
        }}
        onMouseLeave={() => {
          if (!ref.current) return
          dxMV.set(0)
          dyMV.set(0)
        }}
        className="relative isolate h-[100px] w-[300px] rounded-2xl bg-red-50 bg-no-repeat clear-fix"
        style={{
          backgroundImage:
            'url(https://w.wallhaven.cc/full/d6/wallhaven-d6y12l.jpg)',
          backgroundSize: '200% auto',
          backgroundPosition: useTransform(
            () => `calc(50% + ${dx.get()}px) calc(50% + ${dy.get()}px)`
          ),
        }}
      >
        <div className="absolute -z-1 h-full w-full bg-gradient-to-b from-black/80 to-transparent"></div>
        <p className="mx-2 mt-2 text-orange-500">
          Lorem ipsum, dolor consectetur.
        </p>
        <p className="mx-2 mt-2">
          Molestiae quidem totam fugiat facere, magni soluta! Nobis neque fuga?
        </p>
      </motion.div>
    </div>
  )
}
