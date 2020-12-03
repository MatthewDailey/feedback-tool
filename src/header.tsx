import * as React from 'react'
import { useSelector } from 'react-redux'
import { useFirebase } from "react-redux-firebase"
import { ShowIfSignedIn } from "./auth"
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
  return url && <img className="avatar" src={url} />
}

const HeaderSpacing = (props: { children?: React.ReactNode, className?: string }) => (
  <div className={'header ' + (props.className ? props.className : '')}>
    {props.children}
  </div>
)

const HeaderLoggedOut = () => (
  <HeaderSpacing className="signed_out">
    <h1>Feedback.Gifts</h1>
    <Spacer direction='x' multiple={1} />
    <LoginButton />
  </HeaderSpacing>
)

const HeaderLoggedIn = () => (
  <HeaderSpacing className="signed_in">
    <h1>Feedback.Gifts</h1>
    <Spacer direction='x' multiple={1} />
    <Avatar />
    <Spacer direction='x' multiple={1} />
    <LogoutButton />
  </HeaderSpacing>
)


export const Header = () => {
  return <ShowIfSignedIn signedIn={<HeaderLoggedIn />} signedOut={<HeaderLoggedOut />} />
}