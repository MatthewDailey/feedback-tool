import { Contact } from "./auth"


export type Load<T> = { loaded: false } | { loaded: true, value: null|T }

export type FeedbackSession = {
  id: string,
  name: string,
  ownerId: string,
  status: 'opened'|'finalized'
  feedbackSessionRequests: string[]
}


export type FeedbackSessionRequest = {
  id: string
  sessionId: string,
  sessionName: string,
  sessionOwnerName: string,
  sessionOwnerEmail: string,
  requesteeName: string,
  requesteeEmail: string,
  participants: Contact[],
  requestedPairs?: Contact[],
  finalizedPairs?: Contact[],
}