import * as React from 'react'
import { useSelector } from 'react-redux'
import { isLoaded, useFirebaseConnect } from "react-redux-firebase"

export type Contact = { name: string, email: string }

export type User = {
  uid: string
  displayName: string
  email: string
  contacts: { [key: string]: Contact },
  feedbackSessions: { [sessionId: string]: number }
}

export const useUser = (): User => {
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

export const ShowIfSignedIn = (props: { signedIn: React.ReactNode, signedOut: React.ReactNode }) => {
  const profile = useSelector(state => state.firebase.auth)

  if (!profile.isLoaded) {
    return null
  }

  if (profile.isEmpty) {
    return props.signedOut
  }

  return props.signedIn
}

