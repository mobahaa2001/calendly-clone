import { SessionProvider } from 'next-auth/react'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Nav } from '@/components/layout/Nav'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <Nav />
      <div className="page-wrapper bg-gray-100" style={{ height: 'calc(100vh - 64px)' }}>
        <Component {...pageProps} session={pageProps.session} />
      </div>
    </SessionProvider>
  )
}
