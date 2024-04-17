import { LayoutNoScale } from '~/components'

export default function LayoutWithoutScale() {
  const [show, setShow] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="isolate h-full overflow-auto"
    >
      <NavLink to="/">← Home</NavLink>
      <div
        className="resizable bg-neutral grid h-[400px] w-[700px] gap-[12px]"
        style={{
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
          gridTemplateRows: 'minmax(0, 1fr)',
        }}
      >
        <AnimatePresence initial={false}>
          {show && (
            <motion.img
              layout
              key="1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-emerald z-1 h-full w-full object-contain object-center"
              src="https://images.unsplash.com/photo-1691250993170-4c9919194aa4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=794&q=80"
              style={{ gridColumn: '1 / 2', gridRow: '1/2' }}
            />
          )}

          {/* Out container will be scaled cause layout change */}
          <motion.div
            key="2"
            layout
            layoutDependency={show}
            className="bg-blue z-2 h-full w-full"
            style={{ gridColumn: show ? '2 / 3' : '1 / 3', gridRow: '1 / 2' }}
          >
            <LayoutNoScale layoutDependency={show}>
              {/* This image will not be scaled during layout animation */}
              <img
                src="https://images.unsplash.com/photo-1547628641-ec2098bb5812?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
                className="h-full w-full object-contain object-center"
              />
            </LayoutNoScale>
          </motion.div>
        </AnimatePresence>
      </div>

      <button className="btn" onClick={() => setShow(s => !s)}>
        Toggle
      </button>

      <div
        className="resizable bg-dark-gray-50 relative grid h-[400px] w-[700px] gap-[12px]"
        style={{
          gridTemplateColumns: 'minmax(0, 1fr)',
          gridTemplateRows: 'minmax(0, 1fr) minmax(0, 1fr)',
        }}
      >
        <AnimatePresence>
          {show && (
            <motion.div
              layout
              key="1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="z-1 bg-violet-700"
              style={{ gridColumn: '1/2', gridRow: '2/3' }}
            >
              <img
                src="https://images.unsplash.com/photo-1691250993170-4c9919194aa4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=794&q=80"
                className="h-full w-full object-contain object-center"
              />
            </motion.div>
          )}

          {/* Out container will be scaled cause layout change */}
          <motion.div
            layout
            key="2"
            layoutDependency={show}
            className="bg-blue-600 z-2 h-full w-full"
            style={{ gridRow: show ? '1 / 2' : '1 / 3', gridColumn: '1 / 2' }}
          >
            <LayoutNoScale layoutDependency={show}>
              {/* This image will not be scaled during layout animation */}
              <img
                src="https://images.unsplash.com/photo-1547628641-ec2098bb5812?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
                className="h-full w-full object-contain object-center"
              />
            </LayoutNoScale>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
