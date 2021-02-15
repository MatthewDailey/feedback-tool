import * as React from 'react'
import { useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import { useFirebase } from "react-redux-firebase"
import { ShowIfSignedIn, useLogin } from "../lib/auth"
import { Spacer } from "./spacer"
import { Link } from "./ctas"
import { styled } from './styled'
import { TooltipArrow, TooltipContent, TooltipRoot, TooltipTrigger } from "./tooltip"

const LoginButton = () => {
  const login = useLogin()
  return <Link onClick={login}>log in</Link>
}

const LogoutButton = () => {
  const firebase = useFirebase()
  return (
    <Link onClick={() => firebase.logout()}>sign out</Link>
  )
}

const AvatarImg = styled('img', {
  height: 24,
  width: 24,
  borderRadius: 24,
})

const Avatar = () => {
  const profile = useSelector(state => state.firebase.auth)
  const url = profile?.photoURL
  const profileStr = `${profile?.displayName} (${profile?.email})`
  return url && (
    <TooltipRoot>
      <TooltipTrigger>
        <AvatarImg src={url} alt={profileStr}/>
      </TooltipTrigger>
      <TooltipContent>
        {`Signed in as ${profileStr}`}
        <TooltipArrow />
      </TooltipContent>
    </TooltipRoot>
  )
}

const HeaderWrapper = styled('div', {
  marginTop: 40,
  marginLeft: 40,
  marginRight: 40,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  color: "$dark",
  height: 24,

  h1: {
    userSelect: 'none',
    fontWeight: "$heavy",
    fontSize: 12,
  },
  'h1:hover': {
    cursor: 'pointer',
  },

  span: {
    flex: 1,
  },
})

const HeaderLoggedOut = () => {
  const history = useHistory()
  return (
    <HeaderWrapper>
      <h1 onClick={() => history.push('/')}>Feedback.Gifts</h1>
      <span />
      <LoginButton />
    </HeaderWrapper>
  )
}

const HeaderLoggedIn = () => {
  const history = useHistory()
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  return (
    <HeaderWrapper>
      <h1 onClick={() => history.push('/')}>Feedback.Gifts</h1>
      <span />
      {
        isHomePage && (
          <>
            <Link onClick={() => history.push('/app')}>Go to app</Link>
            <Spacer direction='x' multiple={1} />
          </>
        )
      }
      <Avatar />
      <Spacer direction='x' multiple={1} />
      <LogoutButton />
    </HeaderWrapper>
  )
}

const LoadingHeader = () => {
  const history = useHistory()
  return (
    <HeaderWrapper>
      <h1 onClick={() => history.push('/')}>Feedback.Gifts</h1>
      <span />
    </HeaderWrapper>
  )
}


export const Header = () => {
  return <ShowIfSignedIn signedIn={<HeaderLoggedIn />} signedOut={<HeaderLoggedOut />} loading={<LoadingHeader />} />
}