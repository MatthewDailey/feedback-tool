import * as React from 'react'
import { useHistory } from 'react-router-dom'
import { useUser } from "../lib/auth"
import { useSession } from "../lib/data"
import { Spacer } from "../components/spacer"
import { Button } from "../components/ctas"
import { Wrapper } from "../components/wrapper"
import { styled } from '../components/styled'


const SessionOverviewWrapper = styled('div', {
  padding: 14,
  border: '2px solid transparent',
  transform: 'translateX(-16px)',

  '&:hover': {
    border: '2px solid var(--color-peach)',
    borderRadius: 8,
    cursor: 'pointer',
  },
})

const FeedbackSessionOverview = (props: { key: string, sessionId: string }) => {
  const session = useSession(props.sessionId)
  const history = useHistory()

  if (!session.loaded || session.value === null) {
    return null
  }

  return (
    <SessionOverviewWrapper onClick={() => history.push(`/session/${props.sessionId}`)}>
      <h2>{session.value.name}</h2>
      <Spacer multiple={1} direction="y" />
      <p>{`${session.value.feedbackSessionRequests.length} participants`}</p>
      <Spacer multiple={1} direction="y" />
      <p>{`Created at: ${new Date(session.value.createdAt).toDateString()}`}</p>
      <Spacer multiple={1} direction="y" />
      <p>{`Finalized at: ${session.value.finalizedAt ? new Date(session.value.finalizedAt).toDateString() : 'Not yet.'}`}</p>
    </SessionOverviewWrapper>
  )
}

export const ManagerHome = () => {
  const history = useHistory()
  const user = useUser()

  let sessionIdsOrderedByCreatedAt: string[] = []
  if (user && user.feedbackSessions) {
    sessionIdsOrderedByCreatedAt = Object.keys(user.feedbackSessions)
    sessionIdsOrderedByCreatedAt.sort((a, b) => user.feedbackSessions[b] - user.feedbackSessions[a])
  }

  return (
    <Wrapper>
      <Spacer multiple={2} direction='y' />
      <h1>Feedback Sessions</h1>
      <Spacer multiple={2} direction='y' />
      <Button buttonSize="large" onClick={() => history.push("/new-session")}>Start a new Feedback Session</Button>
      <Spacer multiple={2} direction='y' />
      <div className="sessionOverviewsHolder">
        {sessionIdsOrderedByCreatedAt.map(id => <FeedbackSessionOverview sessionId={id} key={id} />)}
      </div>
    </Wrapper>
  )
}
