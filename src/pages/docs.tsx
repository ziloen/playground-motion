// https://github.com/remorses/framer-motion-visualizer/blob/main/website/src/pages/home.tsx

import { ConfigProvider, Segmented, Select, theme } from 'antd'

export default function Docs() {
  return (
    <motion.div>
      {/* transiton types and draw timing function image */}
      <motion.div
        transition={{
          type: 'tween',
          ease: '',
        }}
      ></motion.div>

      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          token: {
            motion: false,
          },
        }}
      >
        <div
          className="grid gap-y-2"
          style={{
            gridTemplateColumns:
              '[title-start main-start] minmax(60px,max-content) [title-end input-start] 1fr [input-end main-end]',
          }}
        >
          <div className="col-[title]">type:</div>
          <Segmented
            className="col-[input]"
            options={['inertia', 'just', 'keyframes', 'spring', 'tween']}
          />

          <div className="col-[title]">mode:</div>
          <Segmented className="col-[input]" options={['mass', 'duration']} />

          <div className="col-[title]">ease:</div>
          <Select
            options={[
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
            ].map(v => ({
              value: v,
              label: v,
            }))}
            popupMatchSelectWidth={100}
            className="col-[input] w-fit"
          />
        </div>
      </ConfigProvider>
    </motion.div>
  )
}
