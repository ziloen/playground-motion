import { clamp } from 'es-toolkit'

const MAX_SCALE = 10
const MIN_SCALE = 0.3
const SCALE_STEP = 0.5

export default function DND() {
  const scale = useMotionValue(1)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  return (
    <motion.div
      drag
      // 释放时是否有惯性效果
      dragMomentum={false}
      // 是否允许拖拽出边界时，超出边界后会回弹到范围内
      // false: 不允许拖拽出边界
      dragElastic={0.5}
      // 拖拽限制范围
      dragConstraints={useRef(document.body)}
      style={{ x, y, scale }}
      onWheel={(e) => {
        if (e.deltaY === 0) return
        const oldScale = scale.get()
        const newScale = clamp(
          oldScale - Math.sign(e.deltaY) * SCALE_STEP,
          MIN_SCALE,
          MAX_SCALE,
        )
        const rect = e.currentTarget.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const ratio = 1 - newScale / oldScale
        x.set(x.get() + (e.clientX - centerX) * ratio)
        y.set(y.get() + (e.clientY - centerY) * ratio)
        scale.set(newScale)
      }}
      className="size-[100px] rounded-full bg-green-700"
    />
  )
}
