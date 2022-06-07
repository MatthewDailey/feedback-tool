import * as React from 'react'
import { useParams } from 'react-router-dom'

import { useFirebase } from "react-redux-firebase"
import { ContactCheckbox } from "../components/contact_checkbox"
import { FeedbackSessionRequest } from "../lib/models"
import { useFeedbackSessionRequest } from "../lib/data"
import { Spacer } from "../components/spacer"
import { Button } from "../components/ctas"
import { Wrapper } from "../components/wrapper"
import { ContactListItem } from "../components/contact_listitem"
import { TextInput } from "../components/text_input"
import { filterParticipants } from "../lib/contacts"

const Finalized = (props: { request: FeedbackSessionRequest}) => {
  const request = props.request
  return (
    <>
      <p>The pairings for this feedback session have been finalized. The next step is for each person in a pair to schedule a 30 minute meeting to deliver feedback (2 meetings per pair).</p>
      <Spacer multiple={1} direction="y" />
      <p>You should schedule two separate meetings so that each meeting can be focussed on helping one individual grow. It's important to separate the meetings because hearing and giving feedback can both be emotionally taxing. We'd like to space out that burden to make it easier for everyone.</p>
      <Spacer multiple={1} direction="y" />
      <p>
        {`You (${props.request.requesteeEmail}) were invited by ${request.sessionOwnerName} (${request.sessionOwnerEmail}) on ${new Date(request.sessionCreatedAt).toDateString()}.`}
        {request.finalizedAt && ` Pairings finalized on ${new Date(request.finalizedAt).toDateString()}.`}
      </p>
      <Spacer multiple={3} direction="y" />
      <h3>Some feedback tips</h3>
      <Spacer multiple={1} direction="y" />
      <p>1. Feedback is a conversation and when you're giving feedback you only have one side of the story. Be humble and be open to being wrong.</p>
      <Spacer multiple={1} direction="y" />
      <p>2. Be specific! The more specific you are, the more helpful you will be.</p>
      <Spacer multiple={1} direction="y" />
      <p>3. Feedback can be hard and scary for both the giver and the receiver! You're having these conversations even though it's hard because you care about your working relationship and want to help each other grow.</p>
      <Spacer multiple={3} direction="y" />
      {
        request.finalizedPairs ?
          <>
            <h2>Schedule 30 minutes to deliver feedback to these people</h2>
            <Spacer multiple={1} direction="y" />
            {
              request.finalizedPairs.map((contact) => (
                <div key={contact.email}>
                  <ContactListItem contact={contact} />
                  <Spacer multiple={1} direction="y" />
                </ div>
              ))
            }
          </>
          :
          <p>The feedback pairs for this session have been finalized and you have no pairings.</p>
      }
    </>
  )
}

const Requested = (props: { request: FeedbackSessionRequest }) => {
  const [emailToChecked, setEmailToChecked] = React.useState({})
  const firebase = useFirebase()
  const { feedbackSessionRequestId }  = useParams()
  const [filterString, setFilterString] = React.useState('')

  const setEmailCheckedProvider = (email: string) => (checked: boolean) => {
    setEmailToChecked({...emailToChecked, [email]: checked})
  }

  const setResponseEmails = () => {
    const requestedPairs = props.request.participants
      .filter(contact => emailToChecked[contact.email])

    firebase.update(`feedbackSessionRequests/${feedbackSessionRequestId}`, { requestedPairs, requested: true })
  }

  const requestedPairs = props.request.requestedPairs || []

  let visibleParticipants = filterParticipants(props.request.participants, filterString)
  return (
    <>
      <p>Please choose any number of people below that you would like to have direct feedback conversations with and if they choose you as well, you'll be paired. Only the session organizer ({props.request.sessionOwnerName}) can see your selection so please don't feel any pressure to have conversations that might be too time consuming or uncomfortable!</p>
      <Spacer multiple={1} direction="y" />
      <p>Once you're paired, you'll schedule a 30 minute meeting with each person you're paired with to deliver your positive and critical feedback. They'll do the same so for each person you pair with you're committing to two 30 minute feedback meetings.</p>
      <Spacer multiple={1} direction="y" />
      <p>{`You (${props.request.requesteeEmail}) were invited by ${props.request.sessionOwnerName} (${props.request.sessionOwnerEmail}) on ${new Date(props.request.sessionCreatedAt).toDateString()}.`}</p>
      <Spacer multiple={3} direction="y" />
      <h2>Who would you like to have feedback conversations with?</h2>
      <Spacer multiple={2} direction="y" />
      <h3>Filter participants</h3>
      <Spacer multiple={1} direction="y" />
      <TextInput
        value={filterString}
        onChange={setFilterString}
        size="small"
        hint='eg. "growth"'
      />
      <Spacer multiple={2} direction="y" />
      <h3>Participants ({props.request.participants.filter(c => emailToChecked[c.email]).length} feedback conversation selected)</h3>
      <Spacer multiple={1} direction="y" />
      {
        visibleParticipants.length > 0 ?
          visibleParticipants.map((contact) => contact.email !== props.request.requesteeEmail && (
            <div key={contact.email}>
              <ContactCheckbox
                isChecked={
                  emailToChecked[contact.email]
                  || requestedPairs.some(requestedPair => requestedPair.email === contact.email)}
                contact={contact}
                onChanged={setEmailCheckedProvider(contact.email)}
              />
              <Spacer multiple={1} direction="y" />
            </ div>
          ))
          : <p>No participants match search filter "{filterString}".</p>
      }

      <Spacer multiple={2} direction="y" />
      {
        props.request.requested ? <p>Your requested pairs have been submitted. You'll be notified when {props.request.sessionOwnerName} finalizes the pairings.</p>
          : <Button buttonSize="large" onClick={setResponseEmails}>Submit</Button>
      }
    </>
  )
}

export const Participant = () => {
  const { feedbackSessionRequestId }  = useParams()
  const feedbackSessionRequest = useFeedbackSessionRequest(feedbackSessionRequestId)

  if (!feedbackSessionRequest.loaded || feedbackSessionRequest.value === null) {
    return null
  }
  const request = feedbackSessionRequest.value

  return (
    <Wrapper>
      <Spacer multiple={2} direction="y" />
      <h1>{request.sessionName}</h1>
      <Spacer multiple={1} direction="y" />
      { request.finalizedAt ? <Finalized request={request} /> : <Requested request={request} /> }
    </Wrapper>
  )
}