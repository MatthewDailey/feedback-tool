import * as React from 'react'
import { useSelector } from 'react-redux'
import { isLoaded, useFirebaseConnect } from "react-redux-firebase"
import { User } from "./models"

export const useUser = (): User|null => {
  const profile = useSelector(state => state.firebase.auth)
  useFirebaseConnect([
    { path: `users/${profile.uid}` }
  ])
  const users = useSelector(state => state.firebase.data.users)
  if (!isLoaded(users)) {
    return null
  }
  return { uid: profile.uid, ...users[profile.uid] }
}

export const ShowIfSignedIn = (props: { signedIn: React.ReactElement|null, signedOut: React.ReactElement|null }) => {
  const profile = useSelector(state => state.firebase.auth)

  if (!profile.isLoaded) {
    return null
  }

  if (profile.isEmpty) {
    return props.signedOut
  }

  return props.signedIn
}
