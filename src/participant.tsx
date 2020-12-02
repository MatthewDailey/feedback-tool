import * as React from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { isEmpty, isLoaded, useFirebaseConnect } from "react-redux-firebase"
import { Contact } from "./auth"
import { ContactCheckbox } from "./contact_checkbox"

type FeedbackSessionRequest = {
  sessionId: string,
  sessionName: string,
  sessionOwnerName: string,
  sessionOwnerEmail: string,
  requesteeName: string,
  requesteeEmail: string,
  participants: Contact[],
  responseEmails: string[],
}
type FeedbackSessionRequestLoad = { loaded: false } | { loaded: true, request: null|FeedbackSessionRequest}

const useFeedbackSessionRequest = (id: string) : FeedbackSessionRequestLoad => {
  useFirebaseConnect([
    { path: `feedbackSessionRequests/${id}` }
  ])
  const feedbackSessionRequests = useSelector(state => state.firebase.data.feedbackSessionRequests)
  if (!isLoaded(feedbackSessionRequests)) {
    return { loaded: false }
  }
  if (isEmpty(feedbackSessionRequests[id])) {
    return { loaded: true, request: null }
  }
  return { loaded: true, request: feedbackSessionRequests[id]}
}

export const Participant = () => {
  const [emailToChecked, setEmailToChecked] = React.useState({})
  const { feedbackSessionRequestId }  = useParams()
  const feedbackSessionRequest = useFeedbackSessionRequest(feedbackSessionRequestId)

  if (!feedbackSessionRequest.loaded || feedbackSessionRequest.request === null) {
    return null
  }

  const setEmailCheckedProvider = (email: string) => (checked: boolean) => {
    setEmailToChecked({...emailToChecked, email: checked})
  }

  return (
    <div>
      <div>{"request id: " + JSON.stringify(feedbackSessionRequest)}</div>
      <div>
        {
          feedbackSessionRequest.request.participants.map((contact) => (
            <ContactCheckbox
              key={contact.email}
              isChecked={emailToChecked[contact.email]}
              contact={contact}
              onChanged={setEmailCheckedProvider(contact.email)}
            />
          ))
        }
        <button>Submit</button>
      </div>
    </div>
  )
}