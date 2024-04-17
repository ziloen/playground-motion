import react from '@vitejs/plugin-react-swc'
import { resolve as r } from 'node:path'
import PostcssPresetEnv from 'postcss-preset-env'
import tailwindcss from 'tailwindcss'
import AutoImport from 'unplugin-auto-import/vite'
import Icons from 'unplugin-icons/vite'
import { defineConfig } from 'vite'
import Pages from 'vite-plugin-pages'

export default defineConfig(
  ({ command }) => (
    console.log(command),
    {
      base: '/playground-framer-motion/',
      resolve: {
        alias: {
          '~': r('src'),
        },
      },

      plugins: [
        react(),

        Icons({
          /* options */
          jsx: 'react',
          compiler: 'jsx',
          autoInstall: true
        }),

        // https://github.com/hannoeru/vite-plugin-pages
        Pages({
          dirs: 'src/pages',
        }),

        // https://github.com/antfu/unplugin-auto-import
        AutoImport({
          imports: [
            {
              react: [
                'useState',
                'useEffect',
                'useMemo',
                'useLayoutEffect',
                'useCallback',
                'useRef',
                'forwardRef',
                'useImperativeHandle',
                'Suspense',
              ],
              'react-router-dom': ['useNavigate', 'useParams', 'NavLink', 'useRoutes'],
              'framer-motion': ['motion', 'AnimatePresence'],
            },
          ],
          dts: 'src/types/auto-imports.d.ts',
        }),
      ],

      css: {
        postcss: {
          plugins: [PostcssPresetEnv({ stage: 0 }), tailwindcss()],
        },
      },

      optimizeDeps: {
        include: [
          'framer-motion',
          'ahooks',
          'ahooks/lib/utils/domTarget',
          'ahooks/lib/utils/useEffectWithTarget',
        ],
      },
    }
  )
)
