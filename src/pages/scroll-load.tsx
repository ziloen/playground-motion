import { switchLatest } from '@wai-ri/core'
import { isAxiosError } from 'axios'
import clsx from 'clsx'
import type { Variants } from 'motion/react'
import { stagger } from 'motion/react'
import type { RefCallback } from 'react'
import type { Post } from '~/api/post'
import { getPostListApi } from '~/api/post'
import { useGetState, useMemoizedFn } from '~/hooks'
import CarbonReset from '~icons/carbon/reset'
import LineMdLoadingTwotoneLoop from '~icons/line-md/loading-twotone-loop'

const getPostListLatest = switchLatest(getPostListApi)

const containerVariants: Variants = {
  animate: {
    transition: {
      delayChildren: /* #__PURE__ */ stagger(0.12),
    },
  },
}

const itemVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
}

export default function ScrollLoad() {
  // #region useState, useHookState
  const [list, setList] = useState<Post[]>([])
  const [isLoading, setIsLoading, getIsLoading] = useGetState(false)
  const [userId, setUserId, getUserId] = useGetState<number | undefined>(
    undefined,
  )
  const [searchText, setSearchText, getSearchText] = useGetState('')
  const [hasMore, setHasMore, getHasMore] = useGetState(true)
  const [page, setPage, getPage] = useGetState(1)
  const [errorText, setErrorText, getErrorText] = useGetState<string | null>(
    null,
  )
  // #endregion

  // #region useRef

  // #endregion

  // #region useMemo
  // #endregion

  // #region functions, useImperativeHandle
  const loadMore = useMemoizedFn(async () => {
    if (getIsLoading() || !getHasMore()) {
      return
    }

    const pageSize = 7

    setIsLoading(true)
    setErrorText(null)
    getPostListLatest({
      page: getPage(),
      pageSize,
      query: getSearchText(),
      userId: getUserId(),
    })
      .then((res) => {
        if (res.posts.length < pageSize) {
          setHasMore(false)
        } else {
          setPage(getPage() + 1)
        }

        setList((list) => {
          return [...list, ...res.posts]
        })
      })
      .catch((e: unknown) => {
        if (isAxiosError(e)) {
          setErrorText(e.message)
        } else if (Error.isError(e)) {
          setErrorText(e.message)
        } else if (typeof e === 'string') {
          setErrorText(e)
        } else {
          setErrorText('Unknown error')
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  })

  const resetAndLoad = useMemoizedFn(() => {
    setPage(1)
    setHasMore(true)
    setList([])
    setErrorText(null)
    setIsLoading(false)
    loadMore()
  })
  // #endregion

  // #region useHookEffect, useEffect

  // initial load
  useLayoutEffect(() => {
    loadMore()
  }, [])

  const trackIntersection = useMemoizedFn<RefCallback<Element>>((el) => {
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (getErrorText() === null) {
            loadMore()
          }
        }
      },
      {
        root: null,
        rootMargin: '10px',
        threshold: 1,
      },
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
    }
  })
  // #endregion

  return (
    <div className="flex max-h-full flex-col">
      <div className="">
        <select
          value={userId}
          onChange={(e) => {
            setUserId(
              e.currentTarget.value === ''
                ? undefined
                : Number(e.currentTarget.value),
            )
            resetAndLoad()
          }}
        >
          <option value="">All Users</option>
          <option value="1">User 1</option>
          <option value="2">User 2</option>
          <option value="3">User 3</option>
          <option value="100">User 100</option>
        </select>

        <input
          type="text"
          className="bg-[field]"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.currentTarget.value)
            resetAndLoad()
          }}
        />
      </div>

      <div className="overflow-y-auto pt-4">
        {!isLoading && errorText === null && list.length === 0 && (
          <div>No posts available.</div>
        )}

        {list.length > 0 && (
          <motion.div
            className="flex flex-col gap-6 px-4"
            variants={containerVariants}
            initial="initial"
            animate="animate"
          >
            {list.map((post) => (
              <motion.div
                key={post.id}
                className="flex flex-col gap-1.5 px-2 py-1"
                variants={itemVariants}
                transition={{
                  opacity: {
                    type: 'tween',
                    duration: 0.5,
                    ease: 'easeIn',
                  },
                }}
              >
                <div className="text-2xl leading-tight">{post.title}</div>
                <div className="text-neutral-tertiary">{post.body}</div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {!isLoading && <div ref={trackIntersection} />}

        <div className="flex-center py-2">
          {hasMore ? (
            errorText === null ? (
              <LineMdLoadingTwotoneLoop
                width={40}
                height={40}
                className={clsx(!isLoading && 'invisible opacity-0')}
              />
            ) : (
              <div className="flex-center min-h-10 gap-2 text-red-400">
                <span>{errorText}</span>
                <CarbonReset
                  className="cursor-pointer"
                  onClick={() => {
                    loadMore()
                  }}
                />
              </div>
            )
          ) : (
            <div className="min-h-10">{'Showing all posts.'}</div>
          )}
        </div>
      </div>
    </div>
  )
}
