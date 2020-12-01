import * as React from 'react'
import { useSelector } from 'react-redux'

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