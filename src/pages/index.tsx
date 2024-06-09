import type { Variants } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import routes from '~react-pages'

const itemVariants: Variants = {
  initial: {
    opacity: 0,
    z: '-3em',
  },
  animate: {
    opacity: 1,
    z: 0,
  },
}

export default function Index() {
  const flattenedRoutes = useMemo(() => {
    return (
      routes
        .map(route => route.path!)
        .filter(route => !['*', '/', ':'].includes(route[0]))
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
          transition={{ staggerChildren: 0.1 }}
          initial="initial"
          animate="animate"
        >
          {flattenedRoutes.map((route, i) => (
            <motion.div
              key={route}
              variants={itemVariants}
              style={{ transformOrigin: 'center bottom' }}
              transition={{
                type: 'tween',
                ease: 'easeInOut',
                opacity: {
                  duration: 0.4,
                },
                z: {
                  duration: 0.5,
                },
              }}
            >
              <NavLink key={route} to={route}>
                {route}
              </NavLink>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
