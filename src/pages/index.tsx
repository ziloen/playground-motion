import type { Variants } from 'motion/react'
import type { RouteObject } from 'react-router'
import { NavLink } from 'react-router'
import routes from '~react-pages'

const itemVariants: Variants = {
  initial: {
    opacity: 0,
    z: '-1em',
  },
  animate: {
    opacity: 1,
    z: 0,
  },
}

export default function Index() {
  const flattenedRoutes = useMemo(() => {
    return (
      flatRoutes(routes)
        .filter((route) => !['*', '/', ':'].includes(route[0]))
        // eslint-disable-next-line @typescript-eslint/unbound-method
        .toSorted(new Intl.Collator('en').compare)
    )
  }, [])

  return (
    <motion.div
      className="px-[20px] pt-[40px]"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
    >
      <h1 className="text-2xl font-bold">Routes</h1>
      <AnimatePresence initial>
        <motion.div
          className="mt-[12px] flex flex-col items-start gap-[4px]"
          style={{
            perspective: '1000px',
            perspectiveOrigin: 'center 50%',
          }}
          transition={{ staggerChildren: 0.05 }}
          initial="initial"
          animate="animate"
        >
          {flattenedRoutes.map((route) => (
            <motion.div
              key={route}
              variants={itemVariants}
              style={{ transformOrigin: 'center bottom' }}
              transition={{
                opacity: {
                  type: 'tween',
                  duration: 0.15,
                  ease: 'easeOut',
                },
                z: {
                  type: 'spring',
                  duration: 0.15,
                  damping: 10,
                },
              }}
            >
              <NavLink key={route} to={route} className="text-lg">
                {route}
              </NavLink>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}

function flatRoutes(routes: RouteObject[], parentPath: string = ''): string[] {
  return routes.flatMap((route) => {
    if (typeof route.path !== 'string') return []
    const path = parentPath ? `${parentPath}/${route.path}` : route.path

    return route.children ? flatRoutes(route.children, path) : path
  })
}
