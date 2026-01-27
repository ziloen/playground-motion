import styles from './tarot.module.css'

import clsx from 'clsx/lite'
import { range, shuffle } from 'es-toolkit'
import { useControls } from 'leva'
import { useMotionValueEvent, useScroll } from 'motion/react'
import { Activity } from 'react'
import { flushSync } from 'react-dom'
import { useGetState, useMemoizedFn, useNextLayoutEffect } from '~/hooks'
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

  const [animating, setAnimating, getAnimating] = useGetState(false)

  const handleClick = useMemoizedFn(async () => {
    if (getAnimating()) return

    const prevPositions = elementsRef.current
      .values()
      .map((el) => el.getBoundingClientRect())
      .toArray()

    setAnimating(true)
    setState((s) => !s)

    await nextLayoutEffect()

    // TODO: ::view-transition-group(.class) 无法读取到 CSS 变量，导致无法实现 stagger 效果
    await flipFrom(prevPositions, {
      targets: Array.from(elementsRef.current.values()),
      duration: 2_000,
      easing: 'cubic-bezier(0.83, 0, 0.17, 1)',
      stagger: -5,
    })

    setAnimating(false)
  })

  const [selectedCard, setSelectedCard] = useState<string | null>(null)

  const onSelectCard = useMemoizedFn(async (e: React.MouseEvent, i: string) => {
    if (getAnimating()) return

    setAnimating(true)

    await document.startViewTransition({
      update: () => {
        flushSync(() => {
          setSelectedCard(i)
        })
      },
      types: [styles['draw-card']],
    }).finished

    setAnimating(false)
  })

  return (
    <>
      <Activity mode={state ? 'visible' : 'hidden'}>
        <div className="grid size-full place-content-center place-items-center gap-4">
          <motion.div
            onClick={handleClick}
            className="max-w-[min(600px,100%)]"
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
                className={clsx('aspect-1/2 w-[100px]', styles.card)}
                style={{
                  zIndex: 1,
                  '--index': i,
                  '--total': CARDS.length,
                  viewTransitionName: CSS.escape(`card-${path}`),
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
                  className="absolute inset-0 z-2 m-auto size-1 snap-center"
                  ref={hideOnBush}
                />

                {CARDS.filter((p) => p !== selectedCard).map((v, i) => (
                  <div
                    key={v}
                    className={clsx(
                      'group/card z-1 w-fit',
                      !animating &&
                        'transition-transform duration-300 ease-out hover:-translate-x-6 hover:preceding:-translate-x-6 hover:following:translate-x-6',
                    )}
                  >
                    <div
                      className={clsx(
                        'aspect-1/2 w-[200px] cursor-pointer rounded-lg border border-light-gray-900 bg-[#2c3036]',
                        styles.card,
                        !animating &&
                          'transition-transform group-hover/card:-translate-y-10',
                      )}
                      ref={(el) => {
                        if (el) elementsRef.current.set(v, el)
                        else elementsRef.current.delete(v)
                      }}
                      style={{
                        // viewTransitionName: CSS.escape(`card-${v}`),
                        '--index': i,
                        '--total': CARDS.length,
                      }}
                      onClick={(e) => {
                        e.currentTarget.style.viewTransitionName = CSS.escape(
                          `card-${v}`,
                        )
                        onSelectCard(e, v)
                      }}
                    />
                  </div>
                ))}
              </div>
            </ScrollMask>
          </div>

          {selectedCard !== null && (
            <div
              className="fixed z-1"
              onClick={async () => {
                setAnimating(true)

                await document.startViewTransition({
                  update: () => {
                    flushSync(() => {
                      setSelectedCard(null)
                    })
                  },
                  types: [styles['draw-card']],
                }).finished

                setAnimating(false)
              }}
            >
              <div
                className={clsx(
                  'fixed inset-0 bg-light-gray-50/20 opacity-100 backdrop-blur-[10px] transition-opacity starting:opacity-0',
                )}
              />

              <HoverCard src={selectedCard} />
            </div>
          )}
        </div>
      </Activity>
    </>
  )
}

// 参考 https://codepen.io/jh3y/pen/EaVNNxa
function HoverCard({ src }: { src: string }) {
  const { xRotate, yRotate } = useControls({
    xRotate: {
      value: 8,
      min: 0,
      max: 45,
      step: 1,
      label: 'X (deg)',
    },
    yRotate: {
      value: 10,
      min: 0,
      max: 45,
      step: 1,
      label: 'Y (deg)',
    },
  })

  return (
    <div
      onPointerMove={(e) => {
        const { x, y } = e.nativeEvent
        const rect = e.currentTarget.getBoundingClientRect()

        const ratioX = ((x - rect.x) / rect.width - 0.5) * 2
        const ratioY = ((y - rect.y) / rect.height - 0.5) * 2

        //     │
        //     │    x
        // ────┼────►
        //     │
        //     ▼ y
        e.currentTarget.style.setProperty('--number-1', ratioX.toFixed(2))
        e.currentTarget.style.setProperty('--number-2', ratioY.toFixed(2))
      }}
      className={clsx('group fixed inset-0 m-auto size-fit', styles.card)}
      style={{
        '--number-1': '0',
        '--number-2': '0',
        viewTransitionName: CSS.escape(`card-${src}`),
      }}
    >
      <div
        className="relative isolate z-1 origin-center overflow-hidden rounded-[20px] transition-transform duration-500 backface-hidden transform-3d group-hover:transform-(--transform) group-hover:animate-[set-translate-xy_0.5s_backwards] group-hover:duration-0"
        style={{
          '--number-1': 'inherit',
          '--number-2': 'inherit',
          '--transform':
            'perspective(1300px) ' +
            `rotateX(calc(var(--number-2) * -${xRotate}deg)) ` +
            `rotateY(calc(var(--number-1) * ${yRotate}deg))`,
          willChange: 'transform',
        }}
      >
        <img
          src={src}
          className="aspect-[1/2_auto] w-[400px] align-middle"
          alt="Prex Card"
        />

        {/* light */}
        <div
          className="absolute inset-0 m-auto size-60 rounded-full bg-white opacity-0 blur-3xl transition-opacity group-hover:opacity-20"
          style={{
            '--number-1': 'inherit',
            '--number-2': 'inherit',
            mixBlendMode: 'overlay',
            transform:
              'translateX(calc(var(--number-1) * 180px)) ' +
              'translateY(calc(var(--number-2) * 360px))',
          }}
        />
      </div>
    </div>
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
        className="scrollbar-none grid size-full snap-x snap-mandatory items-end justify-center-safe overflow-x-auto px-10 transition-[--color-1,--color-2] duration-500"
        style={{
          '--color-1': isAtStart ? '#000' : 'transparent',
          '--color-2': isAtEnd ? '#000' : 'transparent',
          maskImage: `linear-gradient(to right,var(--color-1),#000 30%,#000 70%,var(--color-2))`,
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
