import * as React from 'react'
import { useSelector } from 'react-redux'
import {
  Link
} from "react-router-dom";
import { isLoaded, useFirebase, useFirebaseConnect } from "react-redux-firebase"
import { Contact, useUser } from "./auth"


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

const Checkbox = (props: {key: string, isChecked: boolean, contact: Contact, onChanged: (checked: boolean) => void }) => {
  const label = `${props.contact.name} (${props.contact.email})`
  return (
    <div>
      <input type="checkbox" onChange={(e) => props.onChanged(e.target.value)}/>
      <span>{label}</span>
    </div>
  )
}

export const NewSession = () => {
  const user = useUser()
  const [contactKeyToChecked, setContactKeyToChecked] = React.useState({})

  if (!user) {
    return null
  }

  const contactIds = Object.keys(user.contacts)
    .sort((a, b) => user.contacts[a].name.localeCompare(user.contacts[b].name))

  const onCheckboxChangeProvider = (key: string) => (checked: boolean) => {
    setContactKeyToChecked({...contactKeyToChecked, key: checked})
  }

  return (
    <div>
      <p>Session Name</p>
      <input type="text" />

      <p>Participants</p>
      {contactIds.map(id => {
        return (
          <Checkbox
            key={id}
            isChecked={contactKeyToChecked[id]}
            contact={user.contacts[id]}
            onChanged={onCheckboxChangeProvider(id)}
          />
        )
      })}

      <AddContact />

      <button>Create Session</button>
    </div>
  )
}
