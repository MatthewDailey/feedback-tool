import * as React from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useFirebase } from "react-redux-firebase"
import { ShowIfSignedIn } from "../lib/auth"
import { Spacer } from "./spacer"
import { Link } from "./ctas"
import { styled } from './styled'

const LoginButton = () => {
  const firebase = useFirebase()
  return <Link onClick={() => firebase.login({ provider: 'google', type: 'popup' })}>log in</Link>
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
  return url && <AvatarImg src={url} alt={`${profile?.displayName} (${profile?.email})`}/>
}

const HeaderWrapper = styled('div', {
  marginTop: 40,
  marginLeft: 40,
  marginRight: 40,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  color: "$dark",

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
  return (
    <HeaderWrapper>
      <h1 onClick={() => history.push('/')}>Feedback.Gifts</h1>
      <span />
      <Avatar />
      <Spacer direction='x' multiple={1} />
      <LogoutButton />
    </HeaderWrapper>
  )
}


export const Header = () => {
  return <ShowIfSignedIn signedIn={<HeaderLoggedIn />} signedOut={<HeaderLoggedOut />} />
}