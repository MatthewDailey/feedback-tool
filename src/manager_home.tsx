import * as React from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { ExtendedFirebaseInstance, isEmpty, isLoaded, useFirebase, useFirebaseConnect } from "react-redux-firebase"
import { Contact, User, useUser } from "./auth"
import { FeedbackSession, FeedbackSessionRequest, Load } from "./models"
import { useFeedbackSessionRequest, useSession } from "./data"
import { Spacer } from "./spacer"


const FeedbackSessionOverview = (props: { key: string, sessionId: string }) => {
  const session = useSession(props.sessionId)
  const history = useHistory()

  if (!session.loaded || session.value === null) {
    return null
  }

  return (
    <div className="sessionOverview" onClick={() => history.push(`/session/${props.sessionId}`)}>
      <h2>{session.value.name}</h2>
      <Spacer multiple={1} direction="y" />
      <h3>{`${session.value.feedbackSessionRequests.length} participants`}</h3>
      <Spacer multiple={1} direction="y" />
      <h3>{`Created at: ${new Date(session.value.createdAt).toDateString()}`}</h3>
      <Spacer multiple={1} direction="y" />
      <h3>{`Finalized at: ${session.value.finalizedAt ? new Date(session.value.finalizedAt).toDateString() : 'Not yet.'}`}</h3>
    </div>
  )
}

export const ManagerHome = () => {
  const history = useHistory()
  const user = useUser()

  let sessionIdsOrderedByCreatedAt = []
  if (user && user.feedbackSessions) {
    sessionIdsOrderedByCreatedAt = Object.keys(user.feedbackSessions)
    sessionIdsOrderedByCreatedAt.sort((a, b) => user.feedbackSessions[b] - user.feedbackSessions[a])
  }

  return (
    <div className="manager_home wrapper">
      <Spacer multiple={2} direction='y' />
      <h1>Feedback Sessions</h1>
      <Spacer multiple={2} direction='y' />
      <button className="large" onClick={() => history.push("/new-session")}>Start a new Feedback Session</button>
      <Spacer multiple={2} direction='y' />
      <div className="sessionOverviewsHolder">
        {sessionIdsOrderedByCreatedAt.map(id => <FeedbackSessionOverview sessionId={id} key={id} />)}
      </div>
    </div>
  )
}
