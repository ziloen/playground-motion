import { stagger } from 'framer-motion'
import { NavLink, RouteObject } from 'react-router-dom'
import routes from '~react-pages'

export default function Index() {
  const flattenedRoutes = useMemo(() => {
    return routes
      .reduce<RouteObject[]>((acc, route) => {
        acc.push(route)
        return acc
      }, [])
      .map(route => route.path!)
      .filter(route => !['*', '/'].includes(route))
  }, [])

  return (
    <div className='px-20px pt-40px'>
      <h1 className="text-2xl font-bold">Routes</h1>
      <div className="flex flex-col items-start gap-4px mt-12px">
        {flattenedRoutes.map((route, i) =>
          <motion.div
            key={route}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * .08 }}
          >
            <NavLink key={route} to={route}>{route}</NavLink>
          </motion.div>
        )}
      </div>
    </div>
  )
}
