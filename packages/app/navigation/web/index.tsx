import { XStack, YStack, Text, styled, ColorTokens } from "tamagui"
import { Grid, Edit3, BookOpen, LogOut } from "@tamagui/lucide-icons"
import { Link, useLink } from "solito/link"
import { FormButton, H1 } from "@my/ui"
import { useRealmApp } from "app/provider/realm"
import { Pressable } from "react-native"

const width = 60
const headerHeight = 100
const borderWidth = 2
const borderColor = 'rgba(255,255,255,.15)'
const padding = 16

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

  const goalLink = useLink({href: routes.addgoal})
  const cellLink = useLink({href: routes.addcell})
  const collectLink = useLink({href: routes.collect})
  
  if (pathname === routes.login) {
    return <>{children}</>
  }

  return (
    <YStack f={1}>
      <XStack
        ai="center"
        jc="space-between"
        height={headerHeight}
        pl={width+padding}
        pr={padding*2}
        bbc={borderColor}
        bbw={borderWidth}>
        <H1>{getTitle(pathname)}</H1>
        <XStack space>
            <FormButton {...goalLink} type="primary">Add Goal</FormButton>
            <FormButton {...cellLink} type="primary">Add Cell</FormButton>
            <FormButton {...collectLink} type="save">Collect Data</FormButton>
        </XStack>
      </XStack>
      <XStack f={1}>
        {/* sidebar */}
        <YStack jc="space-between" ai="center" brw={borderWidth} brc={borderColor}> 
          <YStack 
            ai="center" 
            pt={width/4}
            w={width}>
              <NavLink href={routes.home}><Grid/></NavLink>
              <NavLink href={routes.edit}><Edit3/></NavLink>
              <NavLink href={routes.notebook}><BookOpen/></NavLink>
          </YStack>
          <Pressable onPress={logOut} style={{paddingBottom: 15}}><LogOut/></Pressable>
        </YStack>
        <XStack f={1} px={padding} pt={padding}>
          {children}
        </XStack>
      </XStack>
    </YStack>
  )
}

const getTitle = (pathname: string) => {
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