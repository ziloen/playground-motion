import useMeasure from 'react-use-measure'

export default function LayoutWithoutScale() {
  const [show, setShow] = useState(false)
  const [ref, { height, width }] = useMeasure()

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className='isolate'
    >
      <NavLink to='/'>← Home</NavLink>
      <div
        className='resizable w-700px h-400px bg-neutral grid gap-12px'
        style={{ gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gridTemplateRows: 'minmax(0, 1fr)' }}
      >
        <AnimatePresence>
          {show && (
            <motion.div
              layout
              key="1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='bg-emerald z-1'
              style={{ gridColumn: '1 / 2', gridRow: '1/2' }}
            >
              <img src='https://images.unsplash.com/photo-1691250993170-4c9919194aa4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=794&q=80' className='w-full h-full object-contain object-center' />
            </motion.div>
          )}

          {/* Out container will be scaled cause layout change */}
          <motion.div
            layout
            key="2"
            layoutDependency={show}
            className='bg-blue z-2'
            style={{ gridColumn: show ? '2 / 3' : '1 / 3', gridRow: '1 / 2' }}
          >
            {/* Use layout="position" to revert scale from container */}
            <motion.div
              ref={ref}
              layout="position"
              layoutDependency={show}
              className='h-full w-full'
            >
              <motion.div
                initial={{ width: '100%', height: '100%' }}
                animate={{ width: width || '100%', height: height || '100%' }}
                transition={{ type: 'tween', duration: .3 }}
              >
                {/* This image will not be scaled during layout animation */}
                <img
                  src='https://images.unsplash.com/photo-1547628641-ec2098bb5812?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80'
                  className='h-full w-full object-contain object-center'
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
      <button className='btn' onClick={() => setShow(s => !s)}>Toggle</button>
    </motion.div>
  )
}