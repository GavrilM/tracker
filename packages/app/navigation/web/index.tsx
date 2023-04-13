import { XStack, YStack, Text, styled, ColorTokens } from "tamagui"
import { Grid, Edit3, BookOpen } from "@tamagui/lucide-icons"
import { Link, useLink } from "solito/link"
import { Button, H1 } from "@my/ui"

const width = 60
const headerHeight = 100
const borderWidth = 2
const borderColor = 'rgba(0,0,0,.15)'
const sidePadding = 16

enum routes {
  home = '/',
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
  return (
    <YStack f={1}>
      <XStack 
        ai="center"
        jc="space-between"
        width={'100%'}
        height={headerHeight}
        pl={width+sidePadding}
        pr={sidePadding}>
        <H1>{getTitle(pathname)}</H1>
        <XStack space>
            <Button {...useLink({href: routes.addgoal})} color="lightblue">Add Goal</Button>
            <Button {...useLink({href: routes.addcell})} color="lightblue">Add Cell</Button>
            <Button {...useLink({href: routes.collect})} color="green">Collect Data</Button>
        </XStack>
      </XStack>
      <XStack f={1}>
        <YStack // sidebar
          ai="center" 
          pt={width/4}
          w={width}
          brw={borderWidth}
          brc={borderColor}>
            <NavLink href={routes.home}>
              <Grid/>
            </NavLink>
            <NavLink href={routes.edit}>
              <Edit3/>
            </NavLink>
            <NavLink href={routes.notebook}>
              <BookOpen/>
            </NavLink>
        </YStack>
        <XStack f={1} px={sidePadding}>
          {children}
        </XStack>
      </XStack>
    </YStack>
  )
}

const getTitle = (pathname: string) => {
  console.log('name',pathname)
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