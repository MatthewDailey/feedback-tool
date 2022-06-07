import * as React from 'react'
import { useHistory } from 'react-router-dom'
import { useFirebase } from "react-redux-firebase"
import { useUser } from "../lib/auth"
import { ContactCheckbox } from "../components/contact_checkbox"
import { TextInput } from "../components/text_input"
import { Spacer } from "../components/spacer"
import { Contact } from "../lib/models"
import { Button } from "../components/ctas"
import { Wrapper } from "../components/wrapper"
import { AddContact } from "../components/add_contact"
import { createNewSession } from "../lib/new_session"
import { CsvFileInput } from "../components/file_input"
import { ContactListItem } from "../components/contact_listitem"

export const NewSessionFromCsv = () => {
  const firebase = useFirebase()
  const history = useHistory()
  const user = useUser()
  const [contactIdToChecked, setContactIdToChecked] = React.useState({})
  const [sessionName, setSessionName] = React.useState('')
  const [isCreatingSession, setIsCreatingSession] = React.useState(false)
  const [participants, setParticipants] = React.useState<Contact[]>([])

  if (!user) {
    return null
  }

  const validInputs = sessionName && participants.length > 1

  const createSession = () => {
    setIsCreatingSession(true)
    // TODO: introduce loading state while creating session

    createNewSession(firebase, user, sessionName, participants)
      .then(sessionId => history.push(`/session/${sessionId}`))
      .catch(e => console.error(`Failed to create new session ${e}`))
      .then(() => setIsCreatingSession(false))
  }

  const setChecked = (contactId: string, checked: boolean) =>
    setContactIdToChecked({...contactIdToChecked, [contactId]: checked})

  const importContactListFromCsv = (contacts: Contact[]) => {
    setParticipants(contacts)
    const newContactIdToChecked = {}
    contacts.forEach(c => newContactIdToChecked[c.email] = true)
    setContactIdToChecked(newContactIdToChecked)
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

      <h3>Upload participant list</h3>
      <CsvFileInput<Contact> onChange={importContactListFromCsv} label="Upload CSV with participants with name, email, role, team" />
      <Spacer multiple={2} direction="y" />

      <h3>Participants</h3>
      <Spacer multiple={1} direction="y" />
      {participants.map(participant => {
        return (
          <React.Fragment key={`frag-${participant.email}`}>
            <ContactListItem contact={participant} />
            <Spacer multiple={1} direction="y" />
          </React.Fragment>
        )
      })}
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
