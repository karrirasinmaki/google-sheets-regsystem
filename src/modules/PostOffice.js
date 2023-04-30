/** ***
 * Post office - email sending functions
 * */

import { sendInBlue } from './EmailClient'
import { sentlog } from './Log'

/**
 * Send email
 * to - string
 * email - (object) email object
 */
export function sendEmail(to, email) {
  if (DEBUG && to.search(/karri(\.|)rasinmaki\+.*@gmail\.com/) !== 0) {
    throw 'Not allowed sending emails to other addresses (DEBUG mode ON).';
  }
  if (!email) throw "Can't process email";
  const response = sendInBlue(to, email.subject, email.plain, {
    name: 'Helswingi',
    from: 'info@helswingi.fi',
    htmlBody: email.html,
    // attachments: attachments
  });
  const responseJson = JSON.parse(response.getContentText())
  sentlog('email', responseJson.messageId, (`${email.plain}`).trim())
}
