import clsx from 'clsx'
import { AutoHeightPanel } from '~/components'
import EmojiBlackCat from '~icons/fluent-emoji/black-cat'
import EmojiCat from '~icons/fluent-emoji/cat'
import EmojiCatFace from '~icons/fluent-emoji/cat-face'
import EmojiCatWithTearsOfJoy from '~icons/fluent-emoji/cat-with-tears-of-joy'
import EmojiCatWithWrySmile from '~icons/fluent-emoji/cat-with-wry-smile'

const tabNames = [
  ['i-fluent-emoji:cat', EmojiCat],
  ['i-fluent-emoji:black-cat', EmojiBlackCat],
  ['i-fluent-emoji:cat-face', EmojiCatFace],
  ['i-fluent-emoji:cat-with-wry-smile', EmojiCatWithWrySmile],
  ['i-fluent-emoji:cat-with-tears-of-joy', EmojiCatWithTearsOfJoy],
] as [string, React.ComponentType][]

export default function TabView() {
  const [index, setIndex] = useState(0)
  const currentTabName = tabNames[index][0]
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

      <div className="relative grid auto-cols-max grid-flow-col gap-2">
        {/* Active indicator */}
        {/* or use layoutId + classsName="absolute inset-0" */}
        <motion.div
          layout
          layoutDependency={col}
          className="absolute size-full bg-[#005E5D]"
          onLayoutAnimationComplete={onAnimationEnd}
          transition={{ type: 'tween', duration: 0.15, ease: 'easeInOut' }}
          style={{
            gridColumn: col,
            gridRow: 1,
            borderRadius: 9999,
          }}
        />

        {/* Tab labels */}
        {tabNames.map(([tabName, Comp], i) => {
          const isActive = i === index

          return (
            <div
              key={tabName}
              className={clsx(
                'z-0 flex cursor-pointer select-none transition-colors px-2 py-1',
                !isActive && 'hover:text-violet-100'
              )}
              onClick={() => !isActive && onChange(i)}
            >
              <Comp />
              <div>{tabName}</div>
            </div>
          )
        })}
      </div>

      <div className="mt-2 bg-gradient-to-r from-[#9059FF] to-[#0250BC]">
        {/* add relative to hidden overflow when exit anmation */}
        <AutoHeightPanel className="relative overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              // set key to force remount trigger animation
              key={index}
              className="flex-col gap-2 bg-black/25 py-4 flex-center"
              initial={{ opacity: 0, y: 200 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -200 }}
            >
              <div className={currentTabName}></div>
              <div className="whitespace-nowrap writing-vertical-lr">{currentTabName}</div>
            </motion.div>
          </AnimatePresence>
        </AutoHeightPanel>
      </div>
    </motion.div>
  )
}
