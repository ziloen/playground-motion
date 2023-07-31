import { ResizablePanel } from '~/components/ResizablePanel'

const tabNames = [
  'i-fluent-emoji:cat',
  'i-fluent-emoji:black-cat',
  // 'i-fluent-emoji:cat-face',
  // 'i-fluent-emoji:cat-with-wry-smile',
  'i-fluent-emoji:cat-with-tears-of-joy',
]

export default function TabView() {
  const [index, setIndex] = useState(0)
  const currentTabName = tabNames[index]


  return (
    <div>
      <div className='grid auto-flow-col gap-2' style={{
        gridAutoColumns: 'max-content',
      }}>
        <motion.div
          layout
          className='bg-gray h-full'
          style={{
            gridColumn: index + 1,
            gridRow: 1,
            borderRadius: 9999,
          }}
        />

        {tabNames.map((tabName, i) =>
          <div
            key={tabName}
            className='flex cursor-pointer z-0 px-2 py-1'
            style={{
              gridColumn: i + 1,
              gridRow: 1,
            }}
            onClick={() => index !== i && setIndex(i)}
          >
            <div className={tabName}></div>
            <div>{tabName}</div>
          </div>
        )}
      </div>


      <div className='mt-2 bg-red'>
        <ResizablePanel>
          <AnimatePresence mode='popLayout' initial={false}>
            <motion.div
              key={index}
              className='flex-center flex-col gap-2 py-4 bg-blue/40'
              initial={{
                opacity: 0,
                y: 200,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -200,
              }}
            >
              <div className={currentTabName}></div>
              <div className='write-vertical-left'>{currentTabName}</div>
            </motion.div>
          </AnimatePresence>
        </ResizablePanel>
      </div>
    </div>
  )
}