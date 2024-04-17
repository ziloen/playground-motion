
export default function TextEffext() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      <NavLink to="/">← Home</NavLink>
      <div>WIP</div>

      {/* Show up  */}
      {/* <div></div> */}

      {/* Typewriter */}
      {/* <div></div> */}

      {/* Text Scramble */}
      {/* <div></div> */}

      {/* Text Reveal */}
      <Text />

      {/* Text follow Svg path animation  */}
    </motion.div>
  )
}

const t1 = 'Hello'.split('').map(l => ({
  id: crypto.randomUUID(),
  letter: l,
}))

const t2 = 'World'.split('').map(l => ({
  id: crypto.randomUUID(),
  letter: l,
}))

function Text() {
  const textArr1 = 'Hello'.split('')
  const textArr2 = 'World'.split('')

  const [show, setShow] = useState(false)

  function onClick() {
    setShow(!show)
  }

  return (
    <div onClick={onClick} className="relative">
      <AnimatePresence mode="popLayout">
        {show &&
          t1.map(({ id, letter }, index) => (
            <motion.span
              key={id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              {letter}
            </motion.span>
          ))}
        {!show &&
          t2.map(({ id, letter }, index) => (
            <motion.span
              key={id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              {letter}
            </motion.span>
          ))}
      </AnimatePresence>
    </div>
  )
}
