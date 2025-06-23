// https://github.com/remorses/framer-motion-visualizer/blob/main/website/src/pages/home.tsx

export default function Docs() {
  return (
    <motion.div>
      {/* transiton types and draw timing function image */}
      <motion.div
        transition={{
          type: 'tween',
          ease: 'easeInOut',
        }}
      />

      <div
        className="grid gap-y-2"
        style={{
          gridTemplateColumns:
            '[title-start main-start] minmax(60px,max-content) [title-end input-start] 1fr [input-end main-end]',
        }}
      >
        <div className="col-[title]">type:</div>
        {['inertia', 'just', 'keyframes', 'spring', 'tween'].map((v) => (
          <span className="col-[input]" key={v}>
            {v}
          </span>
        ))}

        <div className="col-[title]">mode:</div>
        {['mass', 'duration'].map((v) => (
          <span className="col-[input]" key={v}>
            {v}
          </span>
        ))}

        <div className="col-[title]">ease:</div>

        <select className="col-[input] w-fit">
          {[
            'linear',
            'easeIn',
            'easeOut',
            'easeInOut',
            'circIn',
            'circOut',
            'circInOut',
            'backIn',
            'backOut',
            'backInOut',
            'anticipate',
          ].map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </div>
    </motion.div>
  )
}
