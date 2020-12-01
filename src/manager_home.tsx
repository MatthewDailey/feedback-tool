import * as React from 'react'
import { useSelector } from 'react-redux'
import {
  Link
} from "react-router-dom";
import { isLoaded, useFirebaseConnect } from "react-redux-firebase"


export const ManagerHome = () => {
  return (
    <div>
      <Link to="/new-session">Start a new Feedback Session 2</Link>
      <h2>Feedback Sessions</h2>
    </div>
  )
}

export const NewSession = () => {
  const profile = useSelector(state => state.firebase.auth)
  useFirebaseConnect([
    { path: `users/${profile.uid}` }
  ])
  const users = useSelector(state => state.firebase.data.users)
  if (!isLoaded(users)) {
    return null
  }
  const user = users[profile.uid]

  return (
    <div>
      <p>Session Name</p>
      <img src={user.avatarUrl} />
      <input type="text" />

      <p>Participants</p>
      <input type="checkbox"/>
      <input type="checkbox"/>

      <p>Add contact</p>
      <p>name</p>
      <input type="text" />
      <p>email</p>
      <input type="email" />
      <button>Add contact</button>

      <button>Create Session</button>
    </div>
  )
}
