export default function DND() {
  return (
    <motion.div
      drag
      dragMomentum={false}
      // dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
      dragElastic={1}
      className="size-[100px] rounded-full bg-green-700"
    ></motion.div>
  )
}
