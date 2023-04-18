import { CustomToast } from '@my/ui'
import config from '../tamagui.config'
import { NavigationProvider } from './navigation'
import { TamaguiProvider, TamaguiProviderProps, ToastProvider, ToastViewport } from '@my/ui'
import { useColorScheme } from 'react-native'
import { RealmProvider } from './realm'

const APP_ID = process.env.NEXT_PUBLIC_APP_ID || (() => {throw new Error("No app id")})()

export function Provider({ children, ...rest }: Omit<TamaguiProviderProps, 'config'>) {
  const scheme = useColorScheme()
  return (
    <TamaguiProvider
      config={config}
      disableInjectCSS
      defaultTheme={scheme === 'dark' ? 'dark' : 'light'}
      {...rest}
    >
      <ToastProvider swipeDirection="horizontal" native="mobile">
        <RealmProvider appId={APP_ID}>
          <NavigationProvider>{children}</NavigationProvider>
        </RealmProvider>
        <CustomToast />
        <ToastViewport left={0} right={0} top={2} />
      </ToastProvider>
    </TamaguiProvider>
  )
}
