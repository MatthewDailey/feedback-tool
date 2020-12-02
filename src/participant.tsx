import * as React from 'react'
import { useParams } from 'react-router-dom'

import { isEmpty, isLoaded, useFirebase, useFirebaseConnect } from "react-redux-firebase"
import { Contact } from "./auth"
import { ContactCheckbox } from "./contact_checkbox"
import { Load } from "./models"
import { useFeedbackSessionRequest } from "./data"



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

  return (
    <div>
      <div>{"request id: " + JSON.stringify(feedbackSessionRequest)}</div>
      <div>
        {
          feedbackSessionRequest.value.participants.map((contact) => (
            <ContactCheckbox
              key={contact.email}
              isChecked={emailToChecked[contact.email]}
              contact={contact}
              onChanged={setEmailCheckedProvider(contact.email)}
            />
          ))
        }
        <button onClick={setResponseEmails}>Submit</button>
      </div>
    </div>
  )
}