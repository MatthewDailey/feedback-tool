import * as functions from 'firebase-functions'
import * as SendGrid from '@sendgrid/mail'
import { FeedbackSessionRequest } from "../../src/lib/models"

// Config set manually in firebase function via the cli
SendGrid.setApiKey(functions.config().sendgrid.api_key)
const linkDomain = functions.config().app.domain

const sendEmail = async (to: string, subject: string, text: string) => {
  const msg = {
    to,
    from: 'santa@feedback.gifts', // Change to your verified sender
    subject,
    text,
  }
  return SendGrid.send(msg)
    .then(() => functions.logger.info('Sent email!'))
    .catch(e => functions.logger.error('Error sending email', e))
}

export const notifyParticipantSessionOpened = functions.database.ref('/feedbackSessionRequests/{id}')
  .onCreate(((snapshot, context) => {
    const requestId = context.params.id
    const request: FeedbackSessionRequest = snapshot.val()
    functions.logger.debug("Create received.", request)
    return sendEmail(
      request.requesteeEmail,
      `Feedback session: ${request.sessionName} - You're invited!`,
      `You were invited to participate in feedback session ${request.sessionName} by ${request.sessionOwnerName}. To participate, visit ${linkDomain}/participant/${requestId}`
    )
  }))

export const notifyParticipantSessionFinalized = functions.database.ref('/feedbackSessionRequests/{id}')
  .onUpdate(((snapshot, context) => {
    functions.logger.debug("Update received.", snapshot.before.val(), snapshot.after.val())
    const before : FeedbackSessionRequest = snapshot.before.val()
    const after : FeedbackSessionRequest = snapshot.after.val()
    if (!before.finalizedAt && after.finalizedAt) {
      const requestId = context.params.id
      return sendEmail(
        after.requesteeEmail,
        `Feedback session: ${after.sessionName} - Pairs finalized`,
        `Your pairings for feedback session ${after.sessionName} have been finalized by ${after.sessionOwnerName}. To view them, visit ${linkDomain}/participant/${requestId}`
      )
    }
    return Promise.resolve()
  }))