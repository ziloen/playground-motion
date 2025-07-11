export default function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      <NavLink to="/">← Home</NavLink>
      <div>Not Found</div>
    </motion.div>
  )
}
