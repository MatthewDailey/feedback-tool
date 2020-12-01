import * as React from 'react'
import { useSelector } from 'react-redux'
import { useFirebase } from "react-redux-firebase"
import { ShowIfSignedIn } from "./auth"

const LoginButton = () => {
  const firebase = useFirebase()
  return <button onClick={() => firebase.login({ provider: 'google', type: 'popup' })}>Log In</button>
}

const LogoutButton = () => {
  const firebase = useFirebase()
  const profile = useSelector(state => state.firebase.auth)

  return (
    <div>
      <p>{`${profile.displayName}`}</p>
      <button onClick={() => firebase.logout()}>Log out</button>
    </div>
  )
}

export const Header = () => {
  return <ShowIfSignedIn signedIn={<LogoutButton />} signedOut={<LoginButton />} />
}