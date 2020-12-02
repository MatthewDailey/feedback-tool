import * as React from 'react'
import { useParams, useHistory } from 'react-router-dom'
import {
  Link
} from "react-router-dom";
import { ExtendedFirebaseInstance, isEmpty, isLoaded, useFirebase, useFirebaseConnect } from "react-redux-firebase"
import { Contact, User, useUser } from "./auth"
import { ContactCheckbox } from "./contact_checkbox"
import { FeedbackSession, FeedbackSessionRequest, Load } from "./models"
import { useFeedbackSessionRequest, useSession } from "./data"


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

  return sessionId
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
  const firebase = useFirebase()
  const history = useHistory()
  const user = useUser()
  const [contactIdToChecked, setContactIdToChecked] = React.useState({})
  const [sessionName, setSessionName] = React.useState('')

  if (!user) {
    return null
  }
  const contacts: {[key: string]: Contact|undefined} = user.contacts || {}

  const contactIds = Object.keys(contacts)
    .sort((a, b) => contacts[a].name.localeCompare(contacts[b].name))
  const onCheckboxChangeProvider = (key: string) => (checked: boolean) => {
    setContactIdToChecked({...contactIdToChecked, [key]: checked})
  }

  const createSession = () => {
    // TODO: introduce loading state while creating session

    const participants = Object.keys(contacts)
      .filter(id => contactIdToChecked[id])
      .map(id => contacts[id])
    createNewSession(firebase, user, sessionName, participants)
      .then(sessionId => history.push(`/session/${sessionId}`))
      .catch(e => `Failed to create new session ${e}`)
  }

  return (
    <div>
      <p>Session Name</p>
      <input type="text" value={sessionName} onChange={(e) => setSessionName(e.target.value)} />

      <p>Participants</p>
      {contactIds.map(id => {
        return (
          <ContactCheckbox
            key={id}
            isChecked={contactIdToChecked[id]}
            contact={contacts[id]}
            onChanged={onCheckboxChangeProvider(id)}
          />
        )
      })}

      <AddContact />

      <button onClick={createSession}>Create Session</button>
    </div>
  )
}

const finalizeSession = async (firebase: ExtendedFirebaseInstance,
                               feedbackSession: FeedbackSession,
                               feedbackSessionRequests: FeedbackSessionRequest[]) => {
  const emailToPairings: { [email:string]: Contact[]|undefined } = {}

  // Add requested pairings from others
  feedbackSessionRequests.forEach(request => {
    (request.requestedPairs || []).forEach(possiblePair => {
      const pairList = emailToPairings[possiblePair.email] || []
      pairList.push({ email: request.requesteeEmail, name: request.requesteeName })
      emailToPairings[possiblePair.email] = pairList
    })
  })
  // Remove non-matched pairings with self
  feedbackSessionRequests.forEach(request => {
    const inboundRequests = emailToPairings[request.requesteeEmail] || []
    const finalPairs = []
    inboundRequests.forEach(requestedPair => {
      if ((request.requestedPairs || []).some(contact => contact.email === requestedPair.email)) {
        finalPairs.push(requestedPair)
      }
    })
    emailToPairings[request.requesteeEmail] = finalPairs
  })

  // update requests with finalize pairings
  await Promise.all(feedbackSessionRequests
    .map(request => firebase.update(`feedbackSessionRequests/${request.id}`,
      {
        finalizedPairs: emailToPairings[request.requesteeEmail],
        finalized: true,
      })))

  await firebase.update(`feedbackSessions/${feedbackSession.id}`, { status: 'finalized' })
}

const FinalizeButton = (props: { sessionId: string, requestIds: string[] }) => {
  const firebase = useFirebase()
  // const session = useSelector(state => state.firebase.data.feedbackSessions && state.firebase.data.feedbackSessions[props.sessionId])
  // const requests = props.requestIds.map(id => useSelector(state => state.firebase.data.feedbackSessionRequests && state.firebase.data.feedbackSessionRequests[id]))
  const session = useSession(props.sessionId)
  const requests = props.requestIds.map(id => useFeedbackSessionRequest(id))
  if (!session.loaded || session.value === null || requests.some(request => !request.loaded || request.value == null)) {
    return null
  }
  const requestValues: FeedbackSessionRequest[] = []
  for (let r of requests) {
    if (r.loaded && r.value !== null) {
      requestValues.push(r.value)
    }
  }
  return <button onClick={() => finalizeSession(firebase, session.value, requestValues)}>Finalize Session</button>
}

// Note: broke this out from ExistingSession to avoid additional hooks on render.
const RequestsList = (props: { feedbackSession: FeedbackSession, requestIds: string[] }) => {
  const requests = props.requestIds.map((id) => useFeedbackSessionRequest(id))
  return (
    <div>
      {
        requests.map(request => {
          if (!request.loaded || null === request.value) { return null }

          return (
            <div key={request.value.requesteeEmail}>
              <p>requester: {request.value.requesteeName}</p>
              <p>requested pairs: {JSON.stringify(request.value.requestedPairs)}</p>
              {request.value.finalizedPairs && <p>finalized pairs: {JSON.stringify(request.value.finalizedPairs)}</p>}
            </div>
          )
        })
      }
    </div>
  )
}

export const ExistingSession = () => {
  const { sessionId }  = useParams()
  const session = useSession(sessionId)

  if (!session.loaded || session.value === null) {
    return null
  }

  return (
    <div>
      <div>{JSON.stringify(session.value)}</div>
      <RequestsList requestIds={session.value.feedbackSessionRequests} feedbackSession={session.value} />
      <FinalizeButton sessionId={session.value.id} requestIds={session.value.feedbackSessionRequests} />
    </div>
  )
}
