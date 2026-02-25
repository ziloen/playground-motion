type FlipFromOptions = {
  easing?: string
  duration?: number
  stagger?: number
  toggleClass?: string
}

/**
 * Web Animations API 简易 FLIP 动画
 *
 * 参考 GSAP {@link https://gsap.com/docs/v3/Plugins/Flip/static.from() Flip.from()}
 */
export function flipFrom(
  prev: DOMRect,
  options: {
    targets: HTMLElement
  } & FlipFromOptions,
): Promise<void>
export function flipFrom(
  prev: DOMRect[],
  options: {
    targets: HTMLElement[]
  } & FlipFromOptions,
): Promise<void[]>
export function flipFrom(
  prev: DOMRect | DOMRect[],
  options: {
    targets: HTMLElement | HTMLElement[]
  } & FlipFromOptions,
): Promise<void | unknown[]> {
  const {
    stagger = 0,
    duration = 300,
    easing = 'ease-in-out',
    toggleClass,
  } = options

  const targets = Array.isArray(options.targets)
    ? options.targets
    : [options.targets]
  const prevRects = Array.isArray(prev) ? prev : [prev]

  // 分离读写操作
  const currentData = targets.map((target, i) => {
    if (!prevRects[i]) {
      return null
    }

    const transform = getFlipTransform(
      prevRects[i],
      target.getBoundingClientRect(),
    )

    return { target, transform }
  })

  const animations = currentData.map((data, i, arr) => {
    if (!data) {
      return Promise.resolve()
    }

    const { target, transform } = data

    target.style.willChange = 'transform'
    target.style.transformOrigin = '0 0'

    let addedClass: string | false = false
    if (toggleClass && !target.classList.contains(toggleClass)) {
      target.classList.add(toggleClass)
      addedClass = toggleClass
    }

    const delay =
      stagger >= 0 ? i * stagger : (arr.length - 1 - i) * Math.abs(stagger)

    const animation = target.animate(
      { transform, offset: 0 },
      {
        duration,
        easing,
        fill: 'backwards',
        delay,
      },
    )

    return animation.finished.finally(() => {
      target.style.transformOrigin = ''
      target.style.willChange = ''

      if (addedClass) {
        target.classList.remove(addedClass)
      }
    })
  })

  return Promise.all(animations)
}

function getFlipTransform(prev: DOMRect, current: DOMRect) {
  const deltaX = prev.left - current.left
  const deltaY = prev.top - current.top
  const scaleX = current.width > 0 ? prev.width / current.width : 1
  const scaleY = current.height > 0 ? prev.height / current.height : 1
  return `translate(${deltaX}px, ${deltaY}px) scale(${scaleX}, ${scaleY})`
}
