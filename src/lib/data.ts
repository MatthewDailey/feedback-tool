import { FeedbackSession, FeedbackSessionRequest, Load } from "./models"
import { isEmpty, isLoaded, useFirebaseConnect } from "react-redux-firebase"
import { useSelector } from 'react-redux'

export const useSession = (id: string): Load<FeedbackSession> => {
  useFirebaseConnect([
    { path: `feedbackSessions/${id}` }
  ])
  const sessions = useSelector(state => state.firebase.data.feedbackSessions)
  if (!isLoaded(sessions)) {
    return { loaded: false }
  }
  if (isEmpty(sessions[id])) {
    return { loaded: true, value: null }
  }
  return { loaded: true, value: { id, ...sessions[id] }}
}

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
  return { loaded: true, value: { id, ...feedbackSessionRequests[id] }}
}

export const useFeedbackSessionRequestList = (requestIds: string[]) : FeedbackSessionRequest[] => {
  const requestsLoads = requestIds.map((id) => useFeedbackSessionRequest(id))
  const requests: FeedbackSessionRequest[] = []
  requestsLoads.forEach(r => {
    if (r.loaded && r.value) {
      requests.push(r.value)
    }
  })
  return requests
}