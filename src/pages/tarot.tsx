import './tarot.css'

import clsx from 'clsx'
import { range, shuffle } from 'es-toolkit'
import { useMotionValueEvent, useScroll } from 'motion/react'
import { Activity } from 'react'
import { useMemoizedFn, useNextLayoutEffect } from '~/hooks'
import { flipFrom } from '~/utils'

const CARDS = shuffle(
  Object.entries(
    import.meta.glob('../assets/*Prex*.png', {
      eager: true,
      import: 'default',
    }),
  ).map(([, path]) => path as string),
)

export default function Tarot() {
  const [state, setState] = useState(true)

  const elementsRef = useRef(new Map<string, HTMLDivElement>())

  const nextLayoutEffect = useNextLayoutEffect()

  const [animating, setAnimating] = useState(false)

  const handleClick = useMemoizedFn(() => {
    if (animating) return

    const prevPositions = elementsRef.current
      .values()
      .map((el) => el.getBoundingClientRect())
      .toArray()

    setAnimating(true)
    setState((s) => !s)

    nextLayoutEffect(() => {
      flipFrom(prevPositions, {
        targets: Array.from(elementsRef.current.values()),
        duration: 2_000,
        easing: 'cubic-bezier(0.83, 0, 0.17, 1)',
        stagger: -5,
      }).then(() => {
        setAnimating(false)
      })
    })
  })

  const [selectedCard, setSelectedCard] = useState<string | null>(null)

  const onSelectCard = useMemoizedFn((e: React.MouseEvent, i: string) => {
    const rect = e.currentTarget.getBoundingClientRect()

    setSelectedCard(i)

    nextLayoutEffect(() => {})
  })

  return (
    <>
      <Activity mode={state ? 'visible' : 'hidden'}>
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
              gridTemplateColumns: `repeat(${CARDS.length - 1},3px) 200px`,
            }}
          >
            {CARDS.map((path, i) => (
              <div
                key={path}
                data-flip-id={`card-${path}`}
                className="aspect-1/2 w-[100px]"
                style={{
                  zIndex: 1,
                }}
                ref={(el) => {
                  if (el) elementsRef.current.set(path, el)
                  else elementsRef.current.delete(path)
                }}
              >
                <div className="size-full rounded-lg border border-light-gray-900 bg-[#2c3036]"></div>
              </div>
            ))}
          </div>
        </div>
      </Activity>

      <Activity mode={state ? 'hidden' : 'visible'}>
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
                className="aspect-1/2 w-[200px] rounded-lg border border-light-gray-900 bg-[#2c3036] shadow"
              />
            ))}
          </motion.div>

          <div className="pointer-events-none col-[1/2] row-[1/2] grid size-full">
            <ScrollMask className="pointer-events-none">
              <div
                className="group/card-deck pointer-events-auto relative grid auto-cols-max grid-flow-col"
                style={{
                  gridTemplateColumns: `repeat(${CARDS.length - 1},22px) max-content`,
                }}
              >
                <div
                  className="absolute inset-0 z-2 m-auto size-1 snap-center bg-red"
                  ref={hideOnBush}
                />

                {CARDS.filter((p) => p !== selectedCard).map((v) => (
                  <div
                    key={v}
                    className="group/card z-1 w-fit transition-transform duration-300 ease-spring hover:-translate-x-10 hover:preceding:-translate-x-10 hover:following:translate-x-10"
                  >
                    <div
                      className="aspect-1/2 w-[200px] cursor-pointer rounded-lg border border-light-gray-900 bg-[#2c3036] transition-transform group-hover/card:-translate-y-10"
                      ref={(el) => {
                        if (el) elementsRef.current.set(v, el)
                        else elementsRef.current.delete(v)
                      }}
                      onClick={(e) => {
                        onSelectCard(e, v)
                      }}
                    />
                  </div>
                ))}
              </div>
            </ScrollMask>
          </div>

          <AnimatePresence>
            {selectedCard !== null && (
              <div className="fixed z-1">
                <motion.div
                  className="fixed inset-0 bg-light-gray-50/20 backdrop-blur-[10px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => {
                    setSelectedCard(null)
                  }}
                />

                <div className="fixed inset-0 m-auto flex-center size-fit perspective-[1300px]">
                  <motion.div
                    data-flip-id={`card-${selectedCard}`}
                    layoutId={`card-${selectedCard}`}
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
                    className="relative z-2 aspect-1/2 w-[400px] transform-3d"
                    ref={(el) => {
                      if (el) elementsRef.current.set(selectedCard, el)
                      else elementsRef.current.delete(selectedCard)
                    }}
                  >
                    <div className="absolute z-0 size-full cursor-pointer rounded-lg border border-light-gray-900 bg-[#2c3036] shadow backface-hidden">
                      Back of Card
                    </div>

                    <img
                      src={selectedCard}
                      className="absolute z-1 aspect-[1/2_auto] size-full w-full rotate-y-180 cursor-pointer backface-hidden"
                      alt="Prex Card"
                    />
                  </motion.div>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </Activity>
    </>
  )
}

function hideOnBush(el: HTMLElement | null) {
  if (!el) return

  requestAnimationFrame(() => {
    el.style.display = 'none'
  })
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
        className="scrollbar-none grid size-full snap-x snap-mandatory items-end justify-center-safe overflow-x-auto px-10 transition-[--animatable-color-1,--animatable-color-2] duration-500"
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
