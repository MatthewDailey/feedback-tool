import * as React from 'react'
import { useHistory } from 'react-router-dom'
import { useUser } from "../lib/auth"
import { useSession } from "../lib/data"
import { Spacer } from "../components/spacer"
import { Button, Link } from "../components/ctas"
import { TextContainer, Wrapper } from "../components/wrapper"
import { colors, styled } from '../components/styled'


const SessionOverviewWrapper = styled('div', {
  padding: 14,
  border: '2px solid transparent',
  transform: 'translateX(-16px)',
  display: 'inline-block',

  '&:hover': {
    borderRadius: 8,
    cursor: 'pointer',
    textDecoration: 'underline'
  },
})

const FeedbackSessionOverview = (props: { key?: string, sessionId: string }) => {
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
      <p>{`Created: ${new Date(session.value.createdAt).toDateString()}`}</p>
      <Spacer multiple={1} direction="y" />
      <p style={{ color: session.value.finalizedAt ? undefined : colors.$teal}}>{`Finalized: ${session.value.finalizedAt ? new Date(session.value.finalizedAt).toDateString() : 'Not yet.'}`}</p>
    </SessionOverviewWrapper>
  )
}

const EmptyStateExplainer = () => (
  <TextContainer>
    <h3>What is a feedback session?</h3>
    <Spacer multiple={1} direction="y" />
    <p>A feedback session is an add-on to the entire 360 performance review process run by a teams manager. During a feedback session teammember may opt-in to having direct feedback conversations with each other based the 360 feedback they submitted as part of the standard performance cycle.</p>
    <Spacer multiple={1} direction="y" />
    <p>The purpose of this tool is to allow teammembers to opt-in to direct conversations without any pressure of knowing if the other person opted-in or not. </p>

    <Spacer multiple={2} direction="y" />

    <h3>What does this tool actually do?</h3>
    <Spacer multiple={1} direction="y" />
    <p>This is a super simple tool! All it does is automate the process of participants choosing who to they would like to have direct feedback conversations with and notifying them about matches.</p>
    <Spacer multiple={1} direction="y" />
    <p>As a manager, you could do this manually with a spreadsheet but it would be a bit tedious. It should be pretty much effortless with Feedback.Gifts.</p>

    <Spacer multiple={2} direction="y" />

    <h3>Should I talk to my team before setting up a feedback session?</h3>
    <Spacer multiple={1} direction="y" />
    <p>YES! When you create a feedback session, all participants will be emailed a link to choose which other participants they would like to have feedback conversations with. You should explain what this is before they get this email so they aren’t confused.</p>
    <Spacer multiple={1} direction="y" />
    <p>It’s also important why you, as a team leader, have chosen to run this process. Please explain to them that it’s important to practice giving feedback to each other directly and that this is a process for us to practice that as a team. Let them know you’re here to coach them on how to deliver feedback and answer any questions they might have.</p>

    <Spacer multiple={2} direction="y" />

    <h3>What are the steps to running a feedback session?</h3>
    <Spacer multiple={1} direction="y" />
    <p>1. The manager for the team creates a new feedback session and chooses teammates to invites.</p>
    <Spacer multiple={1} direction="y" />
    <p>2. The participants in the session are sent an email with a personal url that allows them to choose which other participants they would like to talk to.</p>
    <Spacer multiple={1} direction="y" />
    <p>3.  The manager finalizes the session and all participants are sent an email with their matches. They are instructed to set up a 30 min feedback conversation with each match.</p>
    <Spacer multiple={1} direction="y" />
    <p>For a more detailed and visual explanation, <Link href="https://www.figma.com/file/vJzJ1oVCzowAKAayQJx6Ug" target="_blank">view the explainer FigJam file.</Link></p>
  </TextContainer>
)

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
      <div>
        {sessionIdsOrderedByCreatedAt.map(id =>
          <div key={id}>
            <FeedbackSessionOverview sessionId={id} />
          </div>
        )}
      </div>
      {
        sessionIdsOrderedByCreatedAt.length === 0 &&
          <>
            <Spacer multiple={2} direction="y"/>
            <h2>No feedback sessions yet.</h2>
            <Spacer multiple={2} direction="y"/>
            <p>Once you start a feedback session, it will appear here.</p>
            <Spacer multiple={2} direction="y"/>
            <EmptyStateExplainer />
          </>
      }

    </Wrapper>
  )
}
