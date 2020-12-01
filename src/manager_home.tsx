import * as React from 'react'
import { useSelector } from 'react-redux'
import {
  Link
} from "react-router-dom";
import { isLoaded, useFirebase, useFirebaseConnect } from "react-redux-firebase"
import { useUser } from "./auth"


export const ManagerHome = () => {
  return (
    <div>
      <Link to="/new-session">Start a new Feedback Session 2</Link>
      <h2>Feedback Sessions</h2>
    </div>
  )
}



const AddContact = () => {
  const firebase = useFirebase()
  const user = useUser()
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')

  if (!user) { return null }

  const addContact = () => {
    if (name && email) {
      firebase.push(`users/${user.uid}/contacts`, { name, email })
        .then(() => {
          setName('')
          setEmail('')
        })
        .catch((e) => console.error('Failed to add contact', e))
    }
  }

  return (
    <div>
      <p>Add contact</p>
      <p>name</p>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)}/>
      <p>email</p>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
      <button onClick={addContact}>Add contact</button>
    </div>
  )
}

export const NewSession = () => {
  const user = useUser()

  if (!user) {
    return null
  }

  return (
    <div>
      <p>Session Name</p>
      <img src={user.avatarUrl} />
      <input type="text" />

      <p>Participants</p>
      <input type="checkbox"/>
      <input type="checkbox"/>

      <AddContact />

      <button>Create Session</button>
    </div>
  )
}
