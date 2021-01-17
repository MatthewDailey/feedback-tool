import * as React from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useFirebase } from "react-redux-firebase"
import { ShowIfSignedIn } from "../lib/auth"
import { Spacer } from "./spacer"

const LoginButton = () => {
  const firebase = useFirebase()
  return <a onClick={() => firebase.login({ provider: 'google', type: 'popup' })}>log in</a>
}

const LogoutButton = () => {
  const firebase = useFirebase()
  return (
    <a onClick={() => firebase.logout()}>sign out</a>
  )
}

const Avatar = () => {
  const profile = useSelector(state => state.firebase.auth)
  const url = profile?.photoURL
  return url && <img className="avatar" src={url} alt={`${profile?.displayName} (${profile?.email})`}/>
}

const HeaderSpacing = (props: { children?: React.ReactNode, className?: string }) => (
  <div className={'header ' + (props.className ? props.className : '')}>
    {props.children}
  </div>
)

const HeaderLoggedOut = () => {
  const history = useHistory()
  return (
    <HeaderSpacing className="signed_out">
      <h1 onClick={() => history.push('/')}>Feedback.Gifts</h1>
      <Spacer direction='x' multiple={1} />
      <LoginButton />
    </HeaderSpacing>
  )
}

const HeaderLoggedIn = () => {
  const history = useHistory()
  return (
    <HeaderSpacing className="signed_in">
      <h1 onClick={() => history.push('/')}>Feedback.Gifts</h1>
      <Spacer direction='x' multiple={1} />
      <Avatar />
      <Spacer direction='x' multiple={1} />
      <LogoutButton />
    </HeaderSpacing>
  )
}


export const Header = () => {
  return <ShowIfSignedIn signedIn={<HeaderLoggedIn />} signedOut={<HeaderLoggedOut />} />
}