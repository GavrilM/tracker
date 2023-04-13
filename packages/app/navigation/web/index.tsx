import { XStack, YStack, Text, styled, ColorTokens } from "tamagui"
import { Grid, Edit3, BookOpen } from "@tamagui/lucide-icons"
import { Link } from "solito/link"
import { Button, config, H1 } from "@my/ui"

const width = 60
const headerHeight = 100
const borderWidth = 2
const borderColor = 'rgba(0,0,0,.15)'
const sidePadding = 16

const NavLink = ({ children, href }) => (
  <Link 
    href={href}
    viewProps={{ style: {height: width}}}>
    {children}
  </Link>
)

export const WebNavigation = ({ children }) => (
  <YStack f={1}>
    <XStack 
      ai="center"
      jc="space-between"
      width={'100%'}
      height={headerHeight}
      pl={width+sidePadding}
      pr={sidePadding}>
      <H1>Dashboard</H1>
      <XStack space>
        <Button color="lightblue">Add Goal</Button>
        <Button color="lightblue">Add Cell</Button>
        <Button color="green">Collect Data</Button>
      </XStack>
    </XStack>
    <XStack f={1}>
      <YStack // sidebar
        ai="center" 
        pt={width/4}
        w={width}
        brw={borderWidth}
        brc={borderColor}>
          <NavLink href='/'>
            <Grid/>
          </NavLink>
          <NavLink href='/edit'>
            <Edit3/>
          </NavLink>
          <NavLink href='/notes'>
            <BookOpen/>
          </NavLink>
      </YStack>
      {children}
    </XStack>
  </YStack>
)