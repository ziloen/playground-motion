const MAX_SCALE = 10
const MIN_SCALE = 0.3
const SCALE_STEP = 0.3

export default function DND() {
  const [scale, setScale] = useState(1)

  // scale from mouse position
  //

  return (
    <motion.div
      drag
      dragMomentum={false}
      style={{ scale }}
      dragConstraints={useRef(document.body)}
      dragElastic={1}
      onWheel={e => {
        if (e.deltaY > 0) {
          setScale(scale => Math.min(Math.max(scale - SCALE_STEP, MIN_SCALE), MAX_SCALE))
        } else {
          setScale(scale => Math.min(Math.max(scale + SCALE_STEP, MIN_SCALE), MAX_SCALE))
        }
      }}
      className="size-[100px] rounded-full bg-green-700"
    />
  )
}
