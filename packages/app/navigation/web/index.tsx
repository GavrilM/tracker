import { XStack, YStack } from "tamagui"
import { Grid, Edit3, BookOpen, LogOut, RefreshCw } from "@tamagui/lucide-icons"
import { Link } from "solito/link"
import { Button, FormButton, H1, SizableText, ZStack } from "@my/ui"
import { useRealmApp } from "app/provider/realm"
import { useApolloClient } from "@apollo/client"
import { useNavTitle } from "app/provider/context/NavTitleContext"
import { NavActions } from "./NavActions"
import { useNavAction } from "app/provider/context/NavActionContext"
import { AddSheet } from "app/features/wizard/AddSheet"
import { useEffect, useState } from "react"
import { SignUpSheet } from "app/components/sheets/SignUpSheet"
import { NewUserExperience } from "app/features/nux/nux"

const width = 60
const headerHeight = 100
const borderWidth = 2
const borderColor = 'rgba(255,255,255,.15)'
const padding = 16
const bodyHeight = `calc(100% - ${headerHeight}px)`

export enum routes {
  landing = '/',
  home = '/dashboard',
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
  const { refresh } = useNavAction()
  const { currentUser } = useRealmApp()

  const client  = useApolloClient()
  const handleLogOut = () => {
    client.resetStore()
    logOut()
  }

  const [addCellOpen, setAddCellOpen] = useState(false)
  const [signUpOpen, setSignUpOpen] = useState(false)
  const [isNewUser, setNewUser] = useState(false)
  const [showNux, setShowNux] = useState(false)

  useEffect(() => {
    let isNew = currentUser != null && currentUser?.profile.email == null
    if(isNew) {
      setShowNux(true)
    }
    setNewUser(isNew)
  }, [currentUser])

  if (pathname === routes.login || pathname === routes.landing) {
    return <>{children}</>
  }

  return (
    <>
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
          <XStack>
            <H1>{getTitle(pathname, title)}</H1>
            {pathname === routes.home && 
              <Button p={12} ai="center" ml={16} mt={8} onPress={refresh}>
                <RefreshCw size="$1"/></Button>
            }
          </XStack>
          <NavActions pathname={pathname} onSheetOpen={() => setAddCellOpen(true)}/>
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
      {
        isNewUser && !showNux &&
        <YStack position="absolute" zIndex={100} p={16} bw={2} br={8} 
          bc='$gray3' boc='$red10' bottom={10} right={10}>
          <SizableText col='$red10' mb={10}>Your progress will not be saved.</SizableText>
          <FormButton type="primary" onPress={() => setSignUpOpen(true)}>Sign Up</FormButton>
        </YStack>
      }
    </YStack>
    
    <NewUserExperience open={showNux} onComplete={() => setShowNux(false)}/>
    <AddSheet isOpen={addCellOpen} onClose={() => setAddCellOpen(false)}/>
    <SignUpSheet isOpen={signUpOpen} onClose={() => setSignUpOpen(false)}/>
    </>
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