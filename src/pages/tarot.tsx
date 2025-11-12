import './tarot.css'

import clsx from 'clsx'
import { range } from 'es-toolkit'
import { gsap } from 'gsap'
import Draggable from 'gsap/Draggable'
import { Flip } from 'gsap/Flip'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { useMotionValueEvent, useScroll } from 'motion/react'
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
        ease: 'sine.inOut',
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

  return (
    <>
      {state && (
        <div className="grid size-full place-content-center place-items-center gap-4">
          <motion.div
            onClick={handleClick}
            className="max-w-[600px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci
            labore accusamus accusantium repellendus magni impedit quasi vel
            cupiditate molestiae doloribus. Neque consequuntur quibusdam numquam
            minus cum, accusamus quo vitae illo.
          </motion.div>

          <div
            className="grid grid-flow-col"
            style={{
              gridTemplateColumns: `repeat(${CARD_COUNT - 1},3px) 200px`,
            }}
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
      )}

      {!state && (
        <div className="relative grid size-full auto-cols-fr p-4">
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
            className="col-[1/2] row-[1/2] grid grid-flow-col justify-center gap-4"
            onClick={handleClick}
          >
            {range(3).map((i) => (
              <div
                key={i}
                className="aspect-[3/4] w-[200px] rounded-lg border border-light-gray-900 bg-[#2c3036] shadow"
              />
            ))}
          </motion.div>

          <div className="col-[1/2] row-[1/2] grid size-full">
            <ScrollMask className="">
              <div
                className="relative grid auto-cols-max grid-flow-col"
                onPointerLeave={() => setHoveredIndex(null)}
              >
                <div
                  className="absolute inset-0 z-2 m-auto size-1 snap-center bg-red"
                  ref={(el) => {
                    if (el) {
                      requestAnimationFrame(() => {
                        el.style.display = 'none'
                      })
                    }
                  }}
                ></div>

                {range(CARD_COUNT)
                  .filter((i) => i !== selectedCardIndex)
                  .map((v, i, a) => (
                    <motion.div
                      key={i}
                      className="z-1 overflow-visible not-last:max-w-[22px] last:max-w-[200px]"
                      whileHover={{
                        maxWidth: i === a.length - 1 ? undefined : '120px',
                      }}
                    >
                      <motion.div
                        key={i}
                        drag
                        dragConstraints={{
                          left: 0,
                          right: 0,
                          top: 0,
                          bottom: 0,
                        }}
                        dragElastic={1}
                        layoutId={`card-${i}`}
                        data-flip-id={`card-${i}`}
                        className="aspect-[3/4] w-[200px]"
                        style={{
                          zIndex: 1,
                        }}
                        ref={(el) => setElementRef(el, i)}
                        onClick={() => {
                          onSelectCard(i)
                        }}
                      >
                        <div className="size-full cursor-pointer rounded-lg border border-light-gray-900 bg-[#2c3036] shadow transition-transform hover:-translate-y-10"></div>
                      </motion.div>
                    </motion.div>
                  ))}
              </div>
              {/* <div
                className="scrollbar-none grid w-full snap-x snap-mandatory items-end justify-safe-center overflow-x-scroll px-10"
                style={{
                  maskImage: `linear-gradient(to right,transparent 0%,#000 30%,#000 70%,transparent 100%)`,
                }}
              >
              </div> */}
            </ScrollMask>
          </div>

          <AnimatePresence>
            {selectedCardIndex !== null && (
              <div className="fixed z-1">
                <motion.div
                  className="fixed inset-0 bg-light-gray-50/20 backdrop-blur-[10px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => {
                    setSelectedCardIndex(null)
                  }}
                />

                <div className="fixed inset-0 m-auto flex-center size-fit perspective-[1300px]">
                  <motion.div
                    data-flip-id={`card-${selectedCardIndex}`}
                    layoutId={`card-${selectedCardIndex}`}
                    initial={{
                      rotateY: 0,
                    }}
                    animate={{
                      rotateY: 180,
                      transition: {
                        delay: 0.3,
                        duration: 0.5,
                        type: 'spring',
                      },
                    }}
                    className="relative z-2 aspect-[3/4] w-[400px] backface-visible transform-3d"
                    ref={(el) => setElementRef(el, selectedCardIndex)}
                  >
                    <div className="absolute z-0 size-full cursor-pointer rounded-lg border border-light-gray-900 bg-[#46afa4] shadow">
                      Back of Card
                    </div>

                    <div className="absolute z-1 size-full translate-z-0.5 cursor-pointer rounded-lg border border-light-gray-900 bg-[#2c3036] shadow">
                      Front of Card
                    </div>
                  </motion.div>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  )
}

function ScrollMask({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isAtStart, setIsAtStart] = useState(true)
  const [isAtEnd, setIsAtEnd] = useState(true)

  const { scrollX, scrollXProgress } = useScroll({
    container: containerRef,
  })

  useMotionValueEvent(scrollXProgress, 'change', (v) => {
    setIsAtStart(v <= 0 || scrollX.get() === 0)
    // 在容器宽度为单数的情况下，会有精度问题，滚动到最后未必能精确到 1
    setIsAtEnd(v >= 0.99)
  })

  return (
    <div className={clsx('relative grid w-full items-end', className)}>
      <div
        className="scrollbar-none grid size-full snap-x snap-mandatory items-end justify-safe-center overflow-x-auto px-10 transition-[--animatable-color-1,--animatable-color-2] duration-500"
        style={{
          '--animatable-color-1': isAtStart ? '#000' : 'transparent',
          '--animatable-color-2': isAtEnd ? '#000' : 'transparent',
          maskImage: `linear-gradient(to right,var(--animatable-color-1),#000 30%,#000 70%,var(--animatable-color-2))`,
        }}
        ref={containerRef}
      >
        {children}
      </div>

      <AnimatePresence>
        {!isAtStart && (
          <motion.button
            key="start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-14 left-5 z-1 size-[44px] rounded-full border bg-dark-gray-300"
            onClick={() => {
              if (!containerRef.current) return
              containerRef.current.scrollBy({ left: -200, behavior: 'smooth' })
            }}
          >
            ←
          </motion.button>
        )}

        {!isAtEnd && (
          <motion.button
            key="end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed right-5 bottom-14 z-1 size-[44px] rounded-full border bg-dark-gray-300"
            onClick={() => {
              if (!containerRef.current) return
              containerRef.current.scrollBy({ left: 200, behavior: 'smooth' })
            }}
          >
            →
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
