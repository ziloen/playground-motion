import type { Variants } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import routes from '~react-pages'

const itemVariants: Variants = {
  initial: {
    opacity: 0,
    x: -20,
    filter: 'blur(5px) grayscale(1)',
  },
  animate: {
    opacity: 1,
    x: 0,
    filter: 'blur(0)',
  },
}

export default function Index() {
  const flattenedRoutes = useMemo(() => {
    return routes.map(route => route.path!).filter(route => !['*', '/', ':'].includes(route[0]))
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
          transition={{ staggerChildren: 0.06 }}
          initial="initial"
          animate="animate"
        >
          {flattenedRoutes.map((route, i) => (
            <motion.div
              key={route}
              variants={itemVariants}
              transition={{
                type: 'tween',
                ease: 'easeOut',
                duration: 0.15,
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
