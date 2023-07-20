import '@tamagui/core/reset.css'
import '@tamagui/font-inter/css/400.css'
import '@tamagui/font-inter/css/700.css'
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
        <link href="https://fonts.cdnfonts.com/css/satoshi" rel="stylesheet" />
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
