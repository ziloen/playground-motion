import react from '@vitejs/plugin-react-swc'
import { resolve as r } from 'node:path'
import PostcssPresetEnv from 'postcss-preset-env'
import tailwindcss from 'tailwindcss'
import AutoImport from 'unplugin-auto-import/vite'
import Icons from 'unplugin-icons/vite'
import { defineConfig, loadEnv } from 'vite'
import Pages from 'vite-plugin-pages'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd())

  let base = env.VITE_BASE_URL

  if (process.env.GITHUB_REPOSITORY) {
    const slashIndex = process.env.GITHUB_REPOSITORY.indexOf('/')
    base = process.env.GITHUB_REPOSITORY.slice(slashIndex)
  }

  return {
    base,
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
        autoInstall: true,
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
              'Fragment',
              'Suspense',
              'forwardRef',
              'useCallback',
              'useEffect',
              'useId',
              'useImperativeHandle',
              'useInsertionEffect',
              'useLayoutEffect',
              'useMemo',
              'useRef',
              'useState',
            ],
            'react-router-dom': [
              'useNavigate',
              'useParams',
              'NavLink',
              'useRoutes',
            ],
            'motion/react': ['motion', 'AnimatePresence'],
          },
        ],
        dts: 'src/types/auto-imports.d.ts',
      }),
    ],

    css: {
      postcss: {
        plugins: [
          PostcssPresetEnv({
            stage: 0,
            features: {
              // do not transform logical properties
              'float-clear-logical-values': false,
              'logical-overflow': false,
              'logical-overscroll-behavior': false,
              'logical-properties-and-values': false,
            },
          }),
          tailwindcss(),
        ],
      },
    },

    optimizeDeps: {
      include: [
        'ahooks',
        'ahooks/lib/utils/domTarget',
        'ahooks/lib/utils/useEffectWithTarget',
        'clsx',
        'motion',
      ],
    },
  }
})
