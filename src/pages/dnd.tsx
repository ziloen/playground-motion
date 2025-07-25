const MAX_SCALE = 10
const MIN_SCALE = 0.3
const SCALE_STEP = 0.5

export default function DND() {
  const scale = useMotionValue(1)
  const scaleSpring = useSpring(scale, {
    bounce: 0,
  })

  // scale from mouse position

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
      style={{ scale: scaleSpring }}
      onWheel={(e) => {
        if (e.deltaY === 0) return
        scale.set(
          Math.min(
            Math.max(scale.get() - Math.sign(e.deltaY) * SCALE_STEP, MIN_SCALE),
            MAX_SCALE,
          ),
        )
      }}
      className="size-[100px] rounded-full bg-green-700"
    />
  )
}
