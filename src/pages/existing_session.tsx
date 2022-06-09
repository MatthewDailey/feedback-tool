import * as React from 'react'
import { useHistory } from 'react-router-dom'
import * as Dialog from '@radix-ui/react-dialog';
import { useParams } from 'react-router-dom'
import { ExtendedFirebaseInstance, useFirebase } from "react-redux-firebase"
import { Contact, FeedbackSession, FeedbackSessionRequest } from "../lib/models"
import { useFeedbackSessionRequest, useFeedbackSessionRequestList, useSession } from "../lib/data"
import { Spacer } from "../components/spacer"
import { Button, Link } from "../components/ctas"
import { Wrapper } from "../components/wrapper"
import { colors, styled } from "../components/styled"
import { Select, SelectItem } from "../components/select"

type FeedbackPairing = { [email:string]: Contact[]|undefined }
const computeEmailToPairing = (feedbackSessionRequests: FeedbackSessionRequest[]): FeedbackPairing => {
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
    const finalPairs: Contact[] = []
    inboundRequests.forEach(requestedPair => {
      if ((request.requestedPairs || []).some(contact => contact.email === requestedPair.email)) {
        finalPairs.push(requestedPair)
      }
    })
    emailToPairings[request.requesteeEmail] = finalPairs
  })

  return emailToPairings
}

const finalizeSession = async (firebase: ExtendedFirebaseInstance,
                               feedbackSession: FeedbackSession,
                               feedbackSessionRequests: FeedbackSessionRequest[]) => {
  const finalizedAt: number = Date.now()
  const emailToPairings = computeEmailToPairing(feedbackSessionRequests)
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
const RequestsList = (props: { requestIds: string[], filter: RequestFilter }) => {
  const requests = filterRequests(useFeedbackSessionRequestList(props.requestIds), props.filter)
  return (
    <div>
      {
        requests.map((request, i) => {
          return (
            <div key={request.requesteeEmail}>
              <span>
                <h3>{request.requesteeName} ({request.requesteeEmail})</h3>
                <Link href={`/participant/${request.id}`}>Participant link</Link>
              </span>
              <Spacer multiple={0.5} direction="y" />
              {request.requested ?
                (
                  <>
                    <p>Requested:</p>
                    <ContactList contacts={request.requestedPairs} />
                  </>
                ) : <p>Pairings not yet requested.</p>
              }
              <Spacer multiple={0.5} direction="y" />
              {request.finalizedPairs && (
                <>
                  <p>Finalized:</p>
                  <ContactList contacts={request.finalizedPairs} />
                </>
              )}
              {i + 1 !== requests.length && <Spacer multiple={2} direction="y" />}
            </div>
          )
        })
      }
    </div>
  )
}

const StyledOverlay = styled(Dialog.Overlay, {
  backgroundColor: 'rgba(0, 0, 0, .15)',
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
});
const StyledContent = styled(Dialog.Content, {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: 200,
  maxWidth: 'fit-content',
  maxHeight: '85vh',
  padding: 20,
  marginTop: '-5vh',
  backgroundColor: '$light',
  borderRadius: 6,
  '&:focus': {
    outline: 'none',
  },
});
const ButtonFooter = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
})

const DeleteSession = (props: { ownerId: string, sessionId: string }) => {
  const firebase = useFirebase()
  const history = useHistory()

  const deleteSession = () => {
    firebase.remove(`feedbackSessions/${props.sessionId}`)
    firebase.remove(`users/${props.ownerId}/feedbackSessions/${props.sessionId}`)
    history.push('/app')
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger as={Link}>Delete session</Dialog.Trigger>
      <StyledOverlay />
      <StyledContent>
        <h2>Delete session?</h2>
        <Spacer multiple={1} direction="y" />
        <p>This will permanently delete the feedback session. This action cannot be undone.</p>
        <Spacer multiple={1} direction="y" />
        <ButtonFooter>
          <Dialog.Close as={Link}>Cancel</Dialog.Close>
          <Spacer multiple={1} direction="x" />
          <Button buttonSize="small" onClick={deleteSession}>Delete session</Button>
        </ButtonFooter>
      </StyledContent>
    </Dialog.Root>
  );
}

type RequestFilter = { team?: string, role?: string }

const filterRequests = (requests: FeedbackSessionRequest[], filter: RequestFilter) => {
  return requests.filter(r =>
    (!filter.role || filter.role === r.requesteeRole)
    && (!filter.team || filter.team === r.requesteeTeam))
}
const percentComplete = (requests: FeedbackSessionRequest[],
                         filter: RequestFilter = {}) => {
  const includedRequests = filterRequests(requests, filter)
  const completedRequestsCount = includedRequests.filter(r => r.requested).length
  return (completedRequestsCount / includedRequests.length) * 100
}
const percentRequestingWithoutMatch = (requests: FeedbackSessionRequest[],
                                       pairings: FeedbackPairing,
                                       filter: RequestFilter = {}) => {
  const includedRequestsThatAreCompleted = filterRequests(requests, filter)
    .filter(r => r.requested)
  const completedWithoutMatchCount = includedRequestsThatAreCompleted
    .filter(r => !pairings[r.requesteeEmail]?.length)
    .length
  return (completedWithoutMatchCount / includedRequestsThatAreCompleted.length) * 100
}

const OverallStats = (props: {requestIds: string[], filter: RequestFilter}) => {
  const requests = useFeedbackSessionRequestList(props.requestIds)
  const pairings = computeEmailToPairing(requests)
  return (
    <>
      <p>Complete: {percentComplete(requests, props.filter).toFixed(0)}%</p>
      <p>Requested pairing but no match found: {
        requests.some(r => r.requested) ?
          `${percentRequestingWithoutMatch(requests, pairings, props.filter).toFixed(0)}%`
          : "No pairings requested yet."
      }
      </p>
    </>
  )
}

const FilterWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
})
const StyledSelect = styled('select', {
  minWidth: 150
})

const FilterSelectors = (props: {requestIds: string[], filterTeam?: string, setFilterTeam, filterRole?: string, setFilterRole}) => {
  const requests = useFeedbackSessionRequestList(props.requestIds)
  const allRoles = [...new Set(requests.map(r => r.requesteeRole))]
  const allTeams = [...new Set(requests.map(r => r.requesteeTeam))]

  const teamDefault = "No team filter."
  const roleDefault = "No role filter."
  return (
    <FilterWrapper>
      <StyledSelect defaultValue={teamDefault} onChange={(e) => props.setFilterTeam(e.target.value)}>
        <option key={teamDefault} value={""}>{teamDefault}</option>
        {
          allTeams.map(team => (
            team && <option key={team} value={team}>{team}</option>
          ))
        }
      </StyledSelect>
      <Spacer multiple={1} direction="x" />
      <StyledSelect defaultValue={roleDefault} onChange={(e) => props.setFilterRole(e.target.value)}>
        <option key={roleDefault} value={""}>{roleDefault}</option>
        {
          allRoles.map(role => (
            role && <option key={role} value={role}>{role}</option>
          ))
        }
      </StyledSelect>
    </FilterWrapper>
  )
}

// TODO (mjd):
// overall stats:
// - % complete overall, by team, by role
// - % requesting without match
// tools:
// - % complete of visible
// - % with at least one match
// - filter to requested and with no match
// - filter to team
// - filter to role
// - text filter
export const ExistingSession = () => {
  const { sessionId }  = useParams()
  const session = useSession(sessionId)
  const [filterTeam, setFilterTeam] = React.useState<string>("")
  const [filterRole, setFilterRole] = React.useState<string>("")

  if (!session.loaded || session.value === null) {
    return null
  }

  const requestIds = session.value?.feedbackSessionRequests || []
  const filter: RequestFilter = {role: filterRole, team: filterTeam}

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
      <Spacer multiple={2} direction="y" />
      <h2>Participants</h2>
      <Spacer multiple={1} direction="y" />
      <OverallStats requestIds={requestIds} filter={filter} />
      <Spacer multiple={1} direction="y" />
      <FilterSelectors
        requestIds={requestIds}
        setFilterTeam={setFilterTeam}
        setFilterRole={setFilterRole}
        filterTeam={filterTeam}
        filterRole={filterRole}
      />
      <Spacer multiple={4} direction="y" />
      <RequestsList requestIds={requestIds} filter={filter} />
      <Spacer multiple={4} direction="y" />
      {!session.value.finalizedAt && <>
        <FinalizeButton sessionId={session.value.id} requestIds={requestIds} />
        <Spacer multiple={2} direction="y" />
      </>}
      <DeleteSession ownerId={session.value.ownerId} sessionId={session.value.id} />
      <Spacer multiple={2} direction="y" />
    </Wrapper>
  )
}