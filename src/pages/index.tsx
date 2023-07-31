import { NavLink, RouteObject } from 'react-router-dom'
import routes from '~react-pages'

export default function Index() {
  // const routes = useRoutes()

  const flattenedRoutes = useMemo(() => {
    return routes
      .reduce<RouteObject[]>((acc, route) => {
        if (route.children) {
          acc.push(...route.children)
        } else {
          acc.push(route)
        }
        return acc
      }, [])
      .map(route => route.path!)
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold">Routes</h1>
      <div className="flex flex-col items-start">
        {flattenedRoutes.map(route =>
          <NavLink key={route} to={route}>{route}</NavLink>
        )}
      </div>
    </div>
  )
}
