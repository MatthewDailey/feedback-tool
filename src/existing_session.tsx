import * as React from 'react'
import { useParams } from 'react-router-dom'
import { ExtendedFirebaseInstance, useFirebase } from "react-redux-firebase"
import { FeedbackSession, FeedbackSessionRequest } from "./models"
import { Contact } from "./auth"
import { useFeedbackSessionRequest, useSession } from "./data"


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