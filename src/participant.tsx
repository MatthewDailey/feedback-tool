import * as React from 'react'
import { useParams } from 'react-router-dom'

import { isEmpty, isLoaded, useFirebase, useFirebaseConnect } from "react-redux-firebase"
import { Contact } from "./auth"
import { ContactCheckbox } from "./contact_checkbox"
import { Load } from "./models"
import { useFeedbackSessionRequest } from "./data"
import { Spacer } from "./spacer"



export const Participant = () => {
  const [emailToChecked, setEmailToChecked] = React.useState({})
  const { feedbackSessionRequestId }  = useParams()
  const firebase = useFirebase()
  const feedbackSessionRequest = useFeedbackSessionRequest(feedbackSessionRequestId)

  if (!feedbackSessionRequest.loaded || feedbackSessionRequest.value === null) {
    return null
  }

  const setEmailCheckedProvider = (email: string) => (checked: boolean) => {
    setEmailToChecked({...emailToChecked, [email]: checked})
  }

  const setResponseEmails = () => {
    const requestedPairs = feedbackSessionRequest.value.participants
      .filter(contact => emailToChecked[contact.email])

    firebase.update(`feedbackSessionRequests/${feedbackSessionRequestId}`, { requestedPairs, requested: true })
  }

  const request = feedbackSessionRequest.value

  return (
    <div className="participant">
      <Spacer multiple={2} direction="y" />
      <h1>{request.sessionName}</h1>
      <Spacer multiple={1} direction="y" />
      <p>{`Invited by ${request.sessionOwnerName} (${request.sessionOwnerEmail}) on ${new Date(request.sessionCreatedAt).toDateString()}.` }</p>
      <Spacer multiple={3} direction="y" />
      <h3>Who would you like to have 30 min feedback conversation with?</h3>
      <Spacer multiple={1} direction="y" />
      {
        feedbackSessionRequest.value.participants.map((contact) => contact.email !== request.requesteeEmail && (
          <div key={contact.email}>
            <ContactCheckbox
              isChecked={
                emailToChecked[contact.email]
                || request.requestedPairs.some(requestedPair => requestedPair.email === contact.email)}
              contact={contact}
              onChanged={setEmailCheckedProvider(contact.email)}
            />
            <Spacer multiple={1} direction="y" />
          </ div>
        ))
      }
      <Spacer multiple={2} direction="y" />
      {
        request.requested ? <p>Your requested pairs have been submitted. You'll be notified when {request.sessionOwnerName} finalizes the pairings.</p>
          : <button className="large" onClick={setResponseEmails}>Submit</button>
      }
    </div>
  )
}