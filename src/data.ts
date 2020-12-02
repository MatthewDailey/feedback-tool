import { FeedbackSessionRequest, Load } from "./models"
import { isEmpty, isLoaded, useFirebaseConnect } from "react-redux-firebase"
import { useSelector } from 'react-redux'

export const useFeedbackSessionRequest = (id: string) : Load<FeedbackSessionRequest> => {
  useFirebaseConnect([
    { path: `feedbackSessionRequests/${id}` }
  ])
  const feedbackSessionRequests = useSelector(state => state.firebase.data.feedbackSessionRequests)
  if (!isLoaded(feedbackSessionRequests)) {
    return { loaded: false }
  }
  if (isEmpty(feedbackSessionRequests[id])) {
    return { loaded: true, value: null }
  }
  return { loaded: true, value: feedbackSessionRequests[id]}
}