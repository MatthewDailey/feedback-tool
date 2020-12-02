import * as functions from 'firebase-functions'
import * as SendGrid from '@sendgrid/mail'

SendGrid.setApiKey('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')

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});

  const msg = {
    to: 'matthew.j.dailey@gmail.com', // Change to your recipient
    from: 'santa@feedback.gifts', // Change to your verified sender
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  }
  SendGrid.send(msg)
    .then(() => functions.logger.info('Sent email!'))
    .catch(e => functions.logger.error('Error sending email', e))

  response.send("Hello from Firebase!");
});
