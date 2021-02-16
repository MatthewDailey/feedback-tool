import * as React from 'react'
import { useParams } from 'react-router-dom'
import { ExtendedFirebaseInstance, useFirebase } from "react-redux-firebase"
import { Contact, FeedbackSession, FeedbackSessionRequest } from "../lib/models"
import { useFeedbackSessionRequest, useSession } from "../lib/data"
import { Spacer } from "../components/spacer"
import { Button } from "../components/ctas"
import { Wrapper } from "../components/wrapper"
import { colors } from "../components/styled"


const finalizeSession = async (firebase: ExtendedFirebaseInstance,
                               feedbackSession: FeedbackSession,
                               feedbackSessionRequests: FeedbackSessionRequest[]) => {
  const emailToPairings: { [email:string]: Contact[]|undefined } = {}
  const finalizedAt: number = Date.now()

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
    const finalPairs: Contact[] = []
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
        finalizedAt
      })))

  await firebase.update(`feedbackSessions/${feedbackSession.id}`, { status: 'finalized', finalizedAt })
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
  return <Button buttonSize="large" onClick={() => finalizeSession(firebase, session.value!, requestValues)}>Finalize Session</Button>
}

const contactList = (contacts?: Contact[]) => {
  if (!contacts) {
    return "None."
  }
  return contacts.map((contact, index) => `${contact.name} (${contact.email})${index === contacts.length - 1 ? '' : ','}`)
}

const RightArrowSvg = () => (
  <svg width="17" height="9" viewBox="0 0 17 9" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.3536 4.85355C16.5488 4.65829 16.5488 4.34171 16.3536 4.14645L13.1716 0.964466C12.9763 0.769204 12.6597 0.769204 12.4645 0.964466C12.2692 1.15973 12.2692 1.47631 12.4645 1.67157L15.2929 4.5L12.4645 7.32843C12.2692 7.52369 12.2692 7.84027 12.4645 8.03553C12.6597 8.2308 12.9763 8.2308 13.1716 8.03553L16.3536 4.85355ZM0 5L16 5V4L0 4L0 5Z" fill={colors.$dark}/>
  </svg>
)

const ContactList = (props: { contacts?: Contact[]}) => {
  if (!props.contacts) {
    return <p>None.</p>
  }
  return (
    <>
      {props.contacts.map(contact => (
          <div key={contact.email}>
            <RightArrowSvg /> {contact.name} ({contact.email})
          </div>
        ))
      }
    </>
  )
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
              <h3>{request.value.requesteeName} ({request.value.requesteeEmail})</h3>
              <Spacer multiple={0.5} direction="y" />
              <p>Requested:</p>
              <ContactList contacts={request.value.requestedPairs} />
              <Spacer multiple={0.5} direction="y" />
              {request.value.finalizedPairs && (
                <>
                  <p>Finalized:</p>
                  <ContactList contacts={request.value.finalizedPairs} />
                </>
              )}
              <Spacer multiple={2} direction="y" />
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

  const requestIds = session.value.feedbackSessionRequests || []

  return (
    <Wrapper>
      <Spacer multiple={2} direction='y' />
      <h1>{session.value.name}</h1>
      <Spacer multiple={1} direction="y" />
      <p>{requestIds.length} participants.</p>
      <Spacer multiple={1} direction="y" />
      <p>Created at: {new Date(session.value.createdAt).toDateString()}</p>
      <Spacer multiple={1} direction="y" />
      <p>Finalized at: {session.value.finalizedAt ? new Date(session.value.finalizedAt).toDateString() : "Not yet."}</p>
      <Spacer multiple={3} direction="y" />
      <h2>Participants</h2>
      <Spacer multiple={1} direction="y" />
      <RequestsList requestIds={requestIds} feedbackSession={session.value} />
      <Spacer multiple={2} direction="y" />
      {!session.value.finalizedAt && <FinalizeButton sessionId={session.value.id} requestIds={requestIds} />}
    </Wrapper>
  )
}