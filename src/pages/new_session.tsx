import * as React from 'react'
import { useHistory } from 'react-router-dom'
import { ExtendedFirebaseInstance, useFirebase } from "react-redux-firebase"
import { useUser } from "../lib/auth"
import { ContactCheckbox } from "../components/contact_checkbox"
import { TextInput } from "../components/text_input"
import { Spacer } from "../components/spacer"
import { Contact, User } from "../lib/models"
import { Button } from "../components/ctas"
import { Wrapper } from "../components/wrapper"
import { styled } from '../components/styled'
import { AddContact } from "../components/add_contact"


const createNewSession = async (firebase: ExtendedFirebaseInstance, owner: User, sessionName: string, participants: Contact[]) => {
  const createdAt: number = Date.now()
  // push feedbackSession
  const sessionPushResult = await firebase.push('feedbackSessions', { ownerId: owner.uid, name: sessionName, status: 'opened', createdAt })
  const sessionId = sessionPushResult.key

  await firebase.set(`users/${owner.uid}/feedbackSessions/${sessionId}`, createdAt)

  // push feedbackSessionRequests
  const feedbackSessionRequestsPromise = participants.map(contact =>
    firebase.push('feedbackSessionRequests', {
      sessionId,
      sessionName,
      sessionOwnerName: owner.displayName,
      sessionOwnerEmail: owner.email,
      sessionCreatedAt: createdAt,
      requesteeName: contact.name,
      requesteeEmail: contact.email,
      participants,
      responseEmails: []
    }))
  const requestPushResults = await Promise.all(feedbackSessionRequestsPromise)

  // Update session with list of requests
  const updateResults = await firebase.update(`feedbackSessions/${sessionId}`, { feedbackSessionRequests: requestPushResults.map(r => r.key)})

  return sessionId
}


export const NewSession = () => {
  const firebase = useFirebase()
  const history = useHistory()
  const user = useUser()
  const [contactIdToChecked, setContactIdToChecked] = React.useState({})
  const [sessionName, setSessionName] = React.useState('')
  const [isCreatingSession, setIsCreatingSession] = React.useState(false)

  if (!user) {
    return null
  }
  const contacts: {[key: string]: Contact} = user.contacts || {}

  const contactIds = Object.keys(contacts)
    .sort((a, b) => contacts[a].name.localeCompare(contacts[b].name))

  const participants: Contact[] = Object.keys(contacts)
    .filter(id => contactIdToChecked[id])
    .map(id => contacts[id])
  const validInputs = sessionName && participants.length > 1

  const createSession = () => {
    setIsCreatingSession(true)
    // TODO: introduce loading state while creating session

    createNewSession(firebase, user, sessionName, participants)
      .then(sessionId => history.push(`/session/${sessionId}`))
      .catch(e => console.error(`Failed to create new session ${e}`))
      .then(() => setIsCreatingSession(false))
  }

  return (
    <Wrapper>
      <Spacer multiple={2} direction="y" />
      <h1>New Feedback Session</h1>
      <Spacer multiple={2} direction="y" />
      <h3>Session Name</h3>
      <Spacer multiple={1} direction="y" />
      <TextInput size="large" value={sessionName} onChange={(e) => setSessionName(e)} hint="Q3 Perf Review"/>
      <Spacer multiple={2} direction="y" />
      <h3>Participants</h3>
      <Spacer multiple={1} direction="y" />
      {contactIds.map(id => {
        return contacts[id] && (
          <React.Fragment key={`frag-${id}`}>
            <ContactCheckbox
              isChecked={!!contactIdToChecked[id]}
              contact={contacts[id]}
              onChanged={(checked: boolean) => {
                setContactIdToChecked({...contactIdToChecked, [id]: checked})
              }}
              remove={() => firebase.remove(`users/${user.uid}/contacts/${id}`)}
            />
            <Spacer multiple={1} direction="y" />
          </React.Fragment>
        )
      })}
      <AddContact />
      <Spacer multiple={3} direction="y" />
      <Button buttonSize="large" onClick={createSession} disabled={isCreatingSession || !validInputs}>
        Create new feedback session and notify participants
      </Button>
      {!validInputs &&
        <>
          <Spacer multiple={1} direction="y" />
          <p>To create a new session, you must provide a name and select at least 2 participants.</p>
        </>
      }
    </Wrapper>
  )
}
