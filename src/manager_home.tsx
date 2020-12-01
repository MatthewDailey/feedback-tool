import * as React from 'react'
import { useSelector } from 'react-redux'
import {
  Link
} from "react-router-dom";
import { ExtendedFirebaseInstance, isLoaded, useFirebase, useFirebaseConnect } from "react-redux-firebase"
import { Contact, User, useUser } from "./auth"


export const ManagerHome = () => {
  return (
    <div>
      <Link to="/new-session">Start a new Feedback Session 2</Link>
      <h2>Feedback Sessions</h2>
    </div>
  )
}

const createNewSession = async (firebase: ExtendedFirebaseInstance, owner: User, sessionName: string, participants: Contact[]) => {
  // TODO validate fields

  // push feedbackSession
  const sessionPushResult = await firebase.push('feedbackSessions', { ownerId: owner.uid, name: sessionName, status: 'opened'})
  const sessionId = sessionPushResult.key
  console.log(sessionId)

  // push feedbackSessionRequests
  const feedbackSessionRequestsPromise = participants.map(contact =>
    firebase.push('feedbackSessionRequests', {
      sessionId,
      sessionName,
      sessionOwnerName: owner.displayName,
      sessionOwnerEmail: owner.email,
      requesteeName: contact.name,
      requesteeEmail: contact.email,
      participants,
      responseEmails: []
    }))
  const requestPushResults = await Promise.all(feedbackSessionRequestsPromise)

  // Update session with list of requests
  const updateResults = await firebase.update(`feedbackSessions/${sessionId}`, { feedbackSessionRequests: requestPushResults.map(r => r.key)})

  // go to session page
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
  const firebase = useFirebase()
  const user = useUser()
  const [contactIdToChecked, setContactIdToChecked] = React.useState({})
  const [sessionName, setSessionName] = React.useState('')

  if (!user) {
    return null
  }

  const contactIds = Object.keys(user.contacts)
    .sort((a, b) => user.contacts[a].name.localeCompare(user.contacts[b].name))
  const onCheckboxChangeProvider = (key: string) => (checked: boolean) => {
    setContactIdToChecked({...contactIdToChecked, [key]: checked})
  }

  const createSession = () => {
    // TODO: introduce loading state while creating session

    const participants = Object.keys(user.contacts)
      .filter(id => contactIdToChecked[id])
      .map(id => user.contacts[id])
    createNewSession(firebase, user, sessionName, participants)
      .catch(e => `Failed to create new session ${e}`)
  }

  return (
    <div>
      <p>Session Name</p>
      <input type="text" value={sessionName} onChange={(e) => setSessionName(e.target.value)} />

      <p>Participants</p>
      {contactIds.map(id => {
        return (
          <Checkbox
            key={id}
            isChecked={contactIdToChecked[id]}
            contact={user.contacts[id]}
            onChanged={onCheckboxChangeProvider(id)}
          />
        )
      })}

      <AddContact />

      <button onClick={createSession}>Create Session</button>
    </div>
  )
}
