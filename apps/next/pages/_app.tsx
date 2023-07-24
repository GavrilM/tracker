import '@tamagui/core/reset.css'
import '../styles/global.css'
import 'raf/polyfill'

import { NextThemeProvider, useRootTheme } from '@tamagui/next-theme'
import { Provider } from 'app/provider'
import Head from 'next/head'
import React, { startTransition } from 'react'
import type { SolitoAppProps } from 'solito'
import { usePathname } from 'next/navigation'
import { WebNavigation } from 'app/navigation/web'

function MyApp({ Component, pageProps }: SolitoAppProps) {
  return (
    <>
      <Head>
        <title>LifeLog | Comprehensive life tracking</title>
        <meta name="description" content="The most flexible life tracking tool" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThemeProvider>
        <WebNavigation pathname={usePathname()}>
          <Component {...pageProps} />
        </WebNavigation>
      </ThemeProvider>
    </>
  )
}

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useRootTheme()

  return (
    <NextThemeProvider
      onChangeTheme={(next) => {
        startTransition(() => {
          setTheme(next)
        })
      }}
    >
      <Provider disableRootThemeClass defaultTheme={theme}>
        {children}
      </Provider>
    </NextThemeProvider>
  )
}

export default MyApp
