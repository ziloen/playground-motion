import { MotionConfig } from 'motion/react'
import './styles/main.css'
import './styles/tailwind.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router'

const queryClient = new QueryClient()

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <MotionConfig transition={{ type: 'tween' }}>
        <Suspense>
          <html lang="en">
            <head>
              <meta charSet="UTF-8" />
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
              />
              <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
              <title>Playground - Framer Motion</title>
              <meta
                name="description"
                content="Opinionated Vite Starter Template"
              />
              <meta name="google" content="notranslate" />
              <meta name="color-scheme" content="dark light" />

              {/* https://github.com/rafgraph/spa-github-pages/blob/gh-pages/index.html */}
              <script
                type="text/javascript"
                dangerouslySetInnerHTML={{
                  __html: `(((l) => {
      if (l.search[1] === '/') {
        var decoded = l.search.slice(1).split('&').map((s) => s.replace(/~and~/g, '&')).join('?')
        window.history.replaceState(null, null,
          l.pathname.slice(0, -1) + decoded + l.hash
        )
      }
    })(window.location))`,
                }}
              />
              <Meta />
              <Links />
            </head>
            <body>
              <AnimatePresence mode="wait" initial={false}>
                {children}
              </AnimatePresence>

              <ScrollRestoration />
              <Scripts />
            </body>
          </html>
        </Suspense>
      </MotionConfig>
    </QueryClientProvider>
  )
}

export default function App() {
  return <Outlet />
}

export function HydrateFallback() {
  return <p>Loading...</p>
}
