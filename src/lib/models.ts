export type Contact = {
  name: string,
  email: string,
  team?: string,
  role?: string
}

export type User = {
  uid: string
  displayName: string
  email: string
  contacts: { [key: string]: Contact },
  feedbackSessions: { [sessionId: string]: number }
}

export type Load<T> = { loaded: false } | { loaded: true, value: null | T }

export type FeedbackSession = {
  id: string,
  name: string,
  ownerId: string,
  status: 'opened' | 'finalized'
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
  requesteeRole?: string,
  requesteeTeam?: string,
  participants: Contact[],
  requestedPairs?: Contact[],
  finalizedPairs: Contact[] | undefined,
  finalizedAt?: number
}