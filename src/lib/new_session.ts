import { ExtendedFirebaseInstance } from "react-redux-firebase"
import { Contact, User } from "./models"


export const createNewSession = async (firebase: ExtendedFirebaseInstance, owner: User, sessionName: string, participants: Contact[]) => {
  const createdAt: number = Date.now()
  // push feedbackSession
  const sessionPushResult = await firebase.push('feedbackSessions', {
    ownerId: owner.uid,
    ownerName: owner.displayName,
    ownerEmail: owner.email,
    name: sessionName,
    status: 'opened',
    createdAt
  })
  const sessionId = sessionPushResult.key

  await firebase.set(`users/${owner.uid}/feedbackSessions/${sessionId}`, createdAt)

  // TODO (mjd): roll back session create if anything fails!

  // push feedbackSessionRequests
  const feedbackSessionRequestsPromise = participants.map(contact =>
    firebase.push('feedbackSessionRequests', {
      sessionId,
      sessionName,
      sessionOwnerName: owner.displayName,
      sessionOwnerEmail: owner.email,
      sessionCreatedAt: createdAt,
      requesteeName: contact.name,
      requesteeEmail: contact.email,
      requesteeRole: contact.role,
      requesteeTeam: contact.team,
      participants,
      responseEmails: []
    }))
  const requestPushResults = await Promise.all(feedbackSessionRequestsPromise)

  // Update session with list of requests
  const updateResults = await firebase.update(`feedbackSessions/${sessionId}`, { feedbackSessionRequests: requestPushResults.map(r => r.key)})

  return sessionId
}
