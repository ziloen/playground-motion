import './tarot.css'

import { range } from 'es-toolkit'
import { gsap } from 'gsap'
import Draggable from 'gsap/Draggable'
import { Flip } from 'gsap/Flip'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { useMemoizedFn } from '~/hooks'

gsap.registerPlugin(Draggable, Flip, MotionPathPlugin)

const CARD_COUNT = 78

export default function Tarot() {
  const [state, setState] = useState(true)

  const elementsRef = useRef<(HTMLElement | null)[]>([])

  const setElementRef = useMemoizedFn(
    (el: HTMLDivElement | null, i: number) => {
      elementsRef.current[i] = el
    },
  )

  const handleClick = useMemoizedFn(() => {
    const state = Flip.getState(elementsRef.current)

    setState((s) => !s)

    requestAnimationFrame(() => {
      Flip.from(state, {
        duration: 1,
        ease: 'power1.inOut',
        stagger: -0.005,
        absolute: false,
        scale: false,
        targets: elementsRef.current,
        motionPath: [],
      })
    })
  })

  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(
    null,
  )

  const onSelectCard = useMemoizedFn((i: number) => {
    setSelectedCardIndex(i)
    setHoveredIndex(null)
  })

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const computeColumns = useMemoizedFn(() => {
    if (hoveredIndex === null) {
      return (
        range(CARD_COUNT - 1)
          .map(() => '22px')
          .join(' ') + ' 200px'
      )
    }

    const columns = range(CARD_COUNT)
      .map((i) => {
        if (i === CARD_COUNT - 1) {
          return '200px'
        }

        if (i === hoveredIndex) {
          return '120px'
        }

        return '22px'
      })
      .join(' ')

    return columns
  })

  if (state) {
    return (
      <div className="grid size-full place-content-center place-items-center gap-4">
        <div onClick={handleClick} className="max-w-[600px]">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci
          labore accusamus accusantium repellendus magni impedit quasi vel
          cupiditate molestiae doloribus. Neque consequuntur quibusdam numquam
          minus cum, accusamus quo vitae illo.
        </div>

        <div
          className="grid grid-flow-col"
          style={{ gridTemplateColumns: `repeat(${CARD_COUNT - 1},3px) 200px` }}
        >
          {range(CARD_COUNT).map((i) => (
            <div
              key={i}
              data-flip-id={`card-${i}`}
              className="aspect-[3/4] w-[200px]"
              style={{
                zIndex: 1,
              }}
              ref={(el) => setElementRef(el, i)}
            >
              <div className="size-full rounded-lg border border-light-gray-900 bg-[#2c3036] shadow"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      className="relative grid size-full auto-cols-fr justify-stretch justify-items-center p-4"
      style={{
        gridTemplateRows: '1fr auto',
      }}
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{
          y: 0,
          opacity: 1,
          transition: {
            delay: 0.5,
            type: 'spring',
            stiffness: 100,
            visualDuration: 0.5,
          },
        }}
        className="sticky left-0 flex gap-4"
        onClick={handleClick}
      >
        {range(3).map((i) => (
          <div
            key={i}
            className="aspect-[3/4] w-[200px] rounded-lg border border-light-gray-900 bg-[#2c3036] shadow"
          />
        ))}
      </motion.div>

      <div className="grid w-full justify-center">
        <div className="flex-center">
          <div
            className="card-deck grid grid-flow-col transition-[grid-template-columns] duration-75"
            style={{
              gridTemplateColumns: computeColumns(),
            }}
            onPointerLeave={() => setHoveredIndex(null)}
          >
            {range(CARD_COUNT).map(
              (i) =>
                i !== selectedCardIndex && (
                  <motion.div
                    key={i}
                    drag
                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    dragElastic={1}
                    layoutId={`card-${i}`}
                    data-flip-id={`card-${i}`}
                    className="card aspect-[3/4] w-[200px]"
                    style={{
                      zIndex: 1,
                    }}
                    ref={(el) => setElementRef(el, i)}
                    onPointerEnter={() => setHoveredIndex(i)}
                    onClick={() => {
                      onSelectCard(i)
                    }}
                  >
                    <div className="size-full cursor-pointer rounded-lg border border-light-gray-900 bg-[#2c3036] shadow transition-transform hover:-translate-y-10"></div>
                  </motion.div>
                ),
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedCardIndex !== null && (
          <div
            className="absolute inset-0 z-1 flex-center"
            onClick={() => {
              setSelectedCardIndex(null)
            }}
          >
            <motion.div
              className="absolute inset-0 bg-light-gray-50/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            ></motion.div>

            <motion.div
              data-flip-id={`card-${selectedCardIndex}`}
              layoutId={`card-${selectedCardIndex}`}
              transition={{
                type: 'tween',
                stiffness: 100,
                damping: 20,
                duration: 0.2,
                visualDuration: 0.2,
              }}
              className="card aspect-[3/4] w-[400px]"
              style={{
                zIndex: 1,
              }}
              ref={(el) => setElementRef(el, selectedCardIndex)}
            >
              <div className="size-full cursor-pointer rounded-lg border border-light-gray-900 bg-[#2c3036] shadow"></div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
