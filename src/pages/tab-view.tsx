import { AutoHeightPanel } from '~/components'

const tabNames = [
  'i-fluent-emoji:cat',
  'i-fluent-emoji:black-cat',
  'i-fluent-emoji:cat-face',
  'i-fluent-emoji:cat-with-wry-smile',
  'i-fluent-emoji:cat-with-tears-of-joy',
]

export default function TabView() {
  const [index, setIndex] = useState(0)
  const currentTabName = tabNames[index]
  const [col, setCol] = useState(`${index + 1} / span 1`)
  const isAnimatingRef = useRef(false)

  function onChange(nextIndex: number) {
    isAnimatingRef.current = true
    const start = Math.min(nextIndex, index) + 1
    const end = Math.max(nextIndex, index) + 2
    setIndex(nextIndex)
    setCol(`${start} / ${end}`)
  }

  function onAnimationEnd() {
    if (!isAnimatingRef.current) return
    isAnimatingRef.current = false
    setCol(`${index + 1} / span 1`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      {/* Back to home */}
      <NavLink to="/">← Home</NavLink>

      <div className="auto-flow-col grid-auto-cols-max relative grid gap-2">
        {/* Active indicator */}
        {/* or use layoutId + classsName="absolute inset-0" */}
        <motion.div
          layout
          layoutDependency={col}
          className="absolute h-full w-full bg-[#005E5D]"
          onLayoutAnimationComplete={onAnimationEnd}
          transition={{ type: 'tween', duration: 0.15, ease: 'easeInOut' }}
          style={{
            gridColumn: col,
            gridRow: 1,
            borderRadius: 9999,
          }}
        />

        {/* Tab labels */}
        {tabNames.map((tabName, i) => (
          <div
            key={tabName}
            className="z-0 flex cursor-pointer select-none px-2 py-1"
            onClick={() => index !== i && onChange(i)}
          >
            <div className={tabName}></div>
            <div>{tabName}</div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-from-[#9059FF] bg-gradient-to-[#0250BC] mt-2 bg-gradient-to-r ">
        {/* add relative to hidden overflow when exit anmation */}
        <AutoHeightPanel className="relative overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              // set key to force remount trigger animation
              key={index}
              className="flex-center flex-col gap-2 bg-black/25 py-4"
              initial={{ opacity: 0, y: 200 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -200 }}
            >
              <div className={currentTabName}></div>
              <div className="write-vertical-left whitespace-nowrap">{currentTabName}</div>
            </motion.div>
          </AnimatePresence>
        </AutoHeightPanel>
      </div>
    </motion.div>
  )
}
