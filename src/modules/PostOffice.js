/** ***
 * Post office - email sending functions
 * */

import { sendInBlue } from './EmailClient'
import { DEBUG } from '../globals'

/**
 * Send email
 * to - string
 * email - (object) email object
 */
export function sendEmail(to, email) {
  if (DEBUG && to.search(/karri(\.|)rasinmaki\+.*@gmail\.com/) !== 0) {
    throw "Not allowed sending emails to other addresses (DEBUG mode ON).";
  }
  if (!email) throw "Can't process email";
  let response = sendInBlue(to, email.subject, email.plain, {
    name: "Helswingi",
    from: "info@helswingi.fi",
    htmlBody: email.html
    // attachments: attachments
  });
  sentlog('email', response.getResponseCode(), JSON.stingify(response.getContentText()))
}

