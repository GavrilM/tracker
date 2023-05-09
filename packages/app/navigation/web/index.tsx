import { XStack, YStack } from "tamagui"
import { Grid, Edit3, BookOpen, LogOut } from "@tamagui/lucide-icons"
import { Link } from "solito/link"
import { H1, ZStack } from "@my/ui"
import { useRealmApp } from "app/provider/realm"
import { useApolloClient } from "@apollo/client"
import { useNavTitle } from "app/provider/context/NavTitleContext"
import { NavActions } from "./NavActions"

const width = 60
const headerHeight = 100
const borderWidth = 2
const borderColor = 'rgba(255,255,255,.15)'
const padding = 16
const bodyHeight = `calc(100% - ${headerHeight}px)`

export enum routes {
  home = '/',
  login = '/login',
  edit = '/edit',
  notebook = '/notebook',
  collect = '/collect',
  addcell = '/addcell',
  addgoal = '/addgoal'
}

const NavLink = ({ children, href }) => (
  <Link 
    href={href}
    viewProps={{ style: {height: width}}}>
    {children}
  </Link>
)

export const WebNavigation = ({ children, pathname }) => {
  const { logOut } = useRealmApp()
  const title = useNavTitle()

  const client  = useApolloClient()
  const handleLogOut = () => {
    client.resetStore()
    logOut()
  }
  
  if (pathname === routes.login) {
    return <>{children}</>
  }

  return (
    <YStack f={1} width="100vw" height="100vh">
      <ZStack f={1}>
        <XStack zIndex={2}
          ai="center"
          jc="space-between"
          height={headerHeight}
          pl={width+padding}
          pr={padding * 2}
          bbc={borderColor}
          bbw={borderWidth}>
          <H1>{getTitle(pathname, title)}</H1>
          <NavActions pathname={pathname}/>
        </XStack>
        {/* sidebar */}
        <YStack jc="space-between" ai="center" brw={borderWidth} brc={borderColor} mt={headerHeight}
          height={bodyHeight} width={width}> 
          <YStack 
            ai="center" 
            pt={width/4}
            w={width}>
              <NavLink href={routes.home}><Grid/></NavLink>
              <NavLink href={routes.edit}><Edit3/></NavLink>
              <NavLink href={routes.notebook}><BookOpen/></NavLink>
          </YStack>
          <XStack onPress={handleLogOut} style={{paddingBottom: 15}}><LogOut/></XStack>
        </YStack>
      </ZStack>
      <YStack mx={padding} mt={padding}
        position="absolute" 
        height={`calc(100% - ${headerHeight + 2 * padding}px)`} width={`calc(100% - ${width + 2 * padding}px)`}
        left={width} top={headerHeight}>
        {children}
      </YStack>
    </YStack>
  )
}

const getTitle = (pathname: string, title: string) => {
  if(pathname !== routes.edit && pathname?.includes(routes.edit))
    return `Edit: ${title}`

  switch(pathname) {
    case routes.home:
      return 'Dashboard';
    case routes.edit:
      return 'Edit Metrics'
    case routes.notebook:
      return 'Notebook'
    case routes.collect:
      return 'Collect Data'
    case routes.addcell:
      return 'Add Cell'
    case routes.addgoal:
      return 'Add Goal'
    default:
      return 'Page not found'
  }
}