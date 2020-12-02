import { Contact } from "./auth"


export type Load<T> = { loaded: false } | { loaded: true, value: null|T }

export type FeedbackSessionRequest = {
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