import { Contact } from "./auth"


export type Load<T> = { loaded: false } | { loaded: true, value: null|T }

export type FeedbackSession = {
  id: string,
  name: string,
  ownerId: string,
  status: 'opened'|'finalized'
  createdAt: number
  finalizedAt: number
  feedbackSessionRequests: string[]
}


export type FeedbackSessionRequest = {
  id: string
  sessionId: string,
  sessionName: string,
  sessionOwnerName: string,
  sessionOwnerEmail: string,
  sessionCreatedAt: number,
  requested?: boolean
  requesteeName: string,
  requesteeEmail: string,
  participants: Contact[],
  requestedPairs?: Contact[],
  finalizedPairs?: Contact[],
  finalizedAt?: number
}