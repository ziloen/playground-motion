import { Dialog } from '@base-ui-components/react/dialog'
import clsx from 'clsx'

// https://x.com/jh3yy/status/1940806147784823184
// https://codepen.io/jh3y/pen/yyNWGNG

export default function PopoverPage() {
  return (
    <div className="flex-center size-full">
      <Dialog.Root>
        <Dialog.Trigger render={<Button>Open popover</Button>}></Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 bg-black/20" />

          <AnimatePresence>
            <Dialog.Popup className="fixed inset-0 m-auto flex size-fit max-w-[500px] flex-col gap-3">
              <motion.div
                className="grid grid-flow-col"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="z-1 min-h-[100px] w-[8px] border border-white/20"
                  initial={{ backgroundColor: '#111' }}
                  animate={{
                    backgroundColor: '#fff',
                    transition: { duration: 0.4, ease: 'easeOut' },
                  }}
                />

                <div className="overflow-clip">
                  <motion.div
                    className="backdrop-blur-lg"
                    initial={{ x: '-100%', opacity: 0 }}
                    animate={{
                      x: 0,
                      opacity: 1,
                      transition: {
                        delay: 0.2,
                        type: 'spring',
                        visualDuration: 0.3,
                        bounce: 0,
                      },
                    }}
                    // TODO: exit animation
                    // exit={{ x: '-100%' }}
                    transition={{
                      opacity: { duration: 0.1 },
                      x: { duration: 0.2 },
                    }}
                    style={{
                      ...getBorderStyle(14, 'white', 'transparent'),
                    }}
                  >
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Magni vitae animi autem id minus eius dignissimos quia
                    accusantium nobis saepe delectus sint consectetur sapiente,
                    quaerat corrupti consequatur cupiditate vero placeat.
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  transition: {
                    delay: 0.7,
                    type: 'spring',
                    bounce: 0,
                    duration: 0.3,
                  },
                }}
                className="flex gap-3 self-end"
              >
                <Dialog.Close render={<Button>Close</Button>} />
                <Dialog.Close render={<Button>OK</Button>} />
              </motion.div>
            </Dialog.Popup>
          </AnimatePresence>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}

function Button({
  children,
  className,
  ref,
  ...rest
}: {
  children: React.ReactNode
  className?: string
  ref?: React.Ref<HTMLButtonElement>
}) {
  return (
    <button
      className={clsx('flex-center w-fit cursor-pointer', className)}
      style={{
        ...getBorderStyle(),
      }}
      ref={ref}
      type="button"
      {...rest}
    >
      <span className="leading-trim-both leading-none">{children}</span>
    </button>
  )
}

function getBorderStyle(
  size = 14,
  stroke = 'white',
  fill = '#333',
): React.CSSProperties {
  return {
    borderImageSource: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-0.5 -0.5 101 101' width='101' height='101'%3E%3Cpolygon points='0,0 100,0 100,${100 - size} ${100 - size},100 0,100' fill='${encodeURIComponent(fill)}' stroke='${encodeURIComponent(stroke)}' stroke-width='1'%3E%3C/polygon%3E%3C/svg%3E")`,
    borderColor: 'transparent',
    borderImageRepeat: 'repeat',
    borderImageSlice: `${size + 1} fill`,
    borderWidth: `${size + 1}px`,
    borderStyle: 'solid',
  }
}
