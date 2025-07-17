import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-oxc'
import browserslistToEsbuild from 'browserslist-to-esbuild'
import { Features } from 'lightningcss'
import { resolve as r } from 'node:path'
import AutoImport from 'unplugin-auto-import/vite'
import Icons from 'unplugin-icons/vite'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd())

  let base = env.VITE_BASE_URL

  // https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/store-information-in-variables#default-environment-variables
  if (process.env.GITHUB_REPOSITORY) {
    const slashIndex = process.env.GITHUB_REPOSITORY.indexOf('/')
    base = process.env.GITHUB_REPOSITORY.slice(slashIndex)
    base.endsWith('/') || (base += '/')
  }

  const target = '> 0.5%, last 2 versions, Firefox ESR, not dead'

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

      // https://github.com/antfu/unplugin-auto-import
      AutoImport({
        imports: [
          {
            react: [
              'Fragment',
              'Suspense',
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
            'react-router': [
              'NavLink',
              'useNavigate',
              'useParams',
              'useRoutes',
            ],
            'motion/react': [
              'AnimatePresence',
              'motion',
              'useMotionValue',
              'useSpring',
            ],
          },
        ],
        dts: 'src/types/auto-imports.d.ts',
      }),

      tailwindcss(),
    ],

    build: {
      // disable inline base64
      assetsInlineLimit: 0,
      cssMinify: 'lightningcss',
      target: browserslistToEsbuild(target),
    },

    css: {
      transformer: 'lightningcss',
      lightningcss: {
        // https://lightningcss.dev/transpilation.html#feature-flags
        include: Features.Colors | Features.Nesting | Features.MediaRangeSyntax,
        exclude: Features.LogicalProperties,
      },
      devSourcemap: true,
      modules: {
        generateScopedName: '[hash:base64:8]',
      },
    },

    optimizeDeps: {
      include: ['clsx', 'motion'],
    },
  }
})
