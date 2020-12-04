import * as React from 'react'
import { useParams } from 'react-router-dom'
import { ExtendedFirebaseInstance, useFirebase } from "react-redux-firebase"
import { Contact, FeedbackSession, FeedbackSessionRequest } from "./models"
import { useFeedbackSessionRequest, useSession } from "./data"
import { Spacer } from "./spacer"


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
  return <button className="large" onClick={() => finalizeSession(firebase, session.value, requestValues)}>Finalize Session</button>
}

const contactList = (contacts?: Contact[]) => {
  if (!contacts) {
    return "None."
  }
  return contacts.map((contact, index) => `${contact.name} (${contact.email})${index === contacts.length - 1 ? '' : ','}`)
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
              <p>{request.value.requesteeName} ({request.value.requesteeEmail})</p>
              <p>Requested pairs: {contactList(request.value.requestedPairs)}</p>
              {request.value.finalizedPairs && <p>finalized pairs: {contactList(request.value.finalizedPairs)}</p>}
              <Spacer multiple={1} direction="y" />
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
    <div className="existingSession wrapper">
      <Spacer multiple={2} direction='y' />
      <h1>{session.value.name}</h1>
      <Spacer multiple={1} direction="y" />
      <p>{requestIds.length} participants.</p>
      <Spacer multiple={1} direction="y" />
      <p>Created at: {new Date(session.value.createdAt).toDateString()}</p>
      <Spacer multiple={1} direction="y" />
      <p>Finalized at: {session.value.finalizedAt ? new Date(session.value.finalizedAt).toDateString() : "Not yet."}</p>
      <Spacer multiple={3} direction="y" />
      <h3>Participants</h3>
      <Spacer multiple={1} direction="y" />
      <RequestsList requestIds={requestIds} feedbackSession={session.value} />
      <Spacer multiple={2} direction="y" />
      {!session.value.finalizedAt && <FinalizeButton sessionId={session.value.id} requestIds={requestIds} />}
    </div>
  )
}