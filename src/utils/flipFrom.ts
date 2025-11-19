import { asType } from '@wai-ri/core'

type FlipFromOptions = {
  easing?: string
  duration?: number
  stagger?: number
  toggleClass?: string
}

/**
 * Web Animations API 实现 FLIP 动画
 *
 * 参考 GSAP Flip.from()：https://gsap.com/docs/v3/Plugins/Flip/
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
): Promise<void | void[]> {
  const {
    targets,
    stagger = 0,
    duration = 300,
    easing = 'ease-in-out',
    toggleClass,
  } = options

  if (Array.isArray(prev) || Array.isArray(targets)) {
    asType<any[]>(prev)
    asType<any[]>(targets)

    return Promise.all(
      targets
        // 分离读写操作
        .map((target, i) => {
          const rect = target.getBoundingClientRect()
          const transform = getFlipTransform(prev[i]!, rect)

          return { target, transform }
        })
        .map(({ target, transform }, i, arr) => {
          target.style.willChange = 'transform'
          target.style.transformOrigin = 'top left'

          let addedClass = false
          if (toggleClass && !target.classList.contains(toggleClass)) {
            target.classList.add(toggleClass)
            addedClass = true
          }

          return target
            .animate(
              { transform, offset: 0 },
              {
                duration,
                easing,
                fill: 'backwards',
                delay:
                  stagger > 0 ? i * stagger : (arr.length - 1 - i) * -stagger!,
              },
            )
            .finished.then(() => {
              target.style.transformOrigin = ''
              target.style.willChange = ''

              if (addedClass) {
                target.classList.remove(toggleClass!)
              }
            })
        }),
    )
  } else {
    const target = targets
    const rect = target.getBoundingClientRect()
    const transform = getFlipTransform(prev, rect)

    target.style.willChange = 'transform'
    target.style.transformOrigin = 'top left'

    let addedClass = false
    if (toggleClass && !target.classList.contains(toggleClass)) {
      target.classList.add(toggleClass)
      addedClass = true
    }

    return target
      .animate(
        { transform, offset: 0 },
        {
          duration: duration,
          easing: easing,
          fill: 'backwards',
        },
      )
      .finished.then(() => {
        target.style.transformOrigin = ''
        target.style.willChange = ''
        if (addedClass) {
          target.classList.remove(toggleClass!)
        }
      })
  }
}

function getFlipTransform(prev: DOMRect, current: DOMRect) {
  const deltaX = prev.left - current.left
  const deltaY = prev.top - current.top
  const scaleX = prev.width / current.width
  const scaleY = prev.height / current.height
  return `translate(${deltaX}px, ${deltaY}px) scale(${scaleX}, ${scaleY})`
}
