import * as React from 'react'
import { useParams } from 'react-router-dom'

import { useFirebase } from "react-redux-firebase"
import { ContactCheckbox } from "./contact_checkbox"
import { FeedbackSessionRequest } from "./models"
import { useFeedbackSessionRequest } from "./data"
import { Spacer } from "./spacer"

const Finalized = (props: { request: FeedbackSessionRequest}) => {
  const request = props.request
  return (
    <>
      <p>
        {`Invited by ${request.sessionOwnerName} (${request.sessionOwnerEmail}) on ${new Date(request.sessionCreatedAt).toDateString()}.`}
        {request.finalizedAt && ` Pairings finalized on ${new Date(request.finalizedAt).toDateString()}.`}
      </p>
      <Spacer multiple={3} direction="y" />
      {
        request.finalizedPairs ?
          <>
            <h3>You should schedule a 30 min feedback conversation to delivery feedback to these people:</h3>
            <Spacer multiple={1} direction="y" />
            {
              request.finalizedPairs.map((contact) => (
                <div key={contact.email}>
                  <p>{`${contact.name} (${contact.email})`}</p>
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

  const setEmailCheckedProvider = (email: string) => (checked: boolean) => {
    setEmailToChecked({...emailToChecked, [email]: checked})
  }

  const setResponseEmails = () => {
    const requestedPairs = props.request.participants
      .filter(contact => emailToChecked[contact.email])

    firebase.update(`feedbackSessionRequests/${feedbackSessionRequestId}`, { requestedPairs, requested: true })
  }

  const requestedPairs = props.request.requestedPairs || []

  return (
    <>
      <p>{`Invited by ${props.request.sessionOwnerName} (${props.request.sessionOwnerEmail}) on ${new Date(props.request.sessionCreatedAt).toDateString()}.`}</p>
      <Spacer multiple={3} direction="y" />
      <h3>Who would you like to have 30 min feedback conversation with?</h3>
      <Spacer multiple={1} direction="y" />
      {
        props.request.participants.map((contact) => contact.email !== props.request.requesteeEmail && (
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
      }
      <Spacer multiple={2} direction="y" />
      {
        props.request.requested ? <p>Your requested pairs have been submitted. You'll be notified when {props.request.sessionOwnerName} finalizes the pairings.</p>
          : <button className="large" onClick={setResponseEmails}>Submit</button>
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
    <div className="participant">
      <Spacer multiple={2} direction="y" />
      <h1>{request.sessionName}</h1>
      <Spacer multiple={1} direction="y" />
      { request.finalizedAt ? <Finalized request={request} /> : <Requested request={request} /> }
    </div>
  )
}