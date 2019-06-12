/** ***
 * Post office - email sending functions
 * */

function sendConfirmationEmail(confirmation) {
  const to = confirmation.email;
  if (DEBUG && to.search(/karri(\.|)rasinmaki\+.*@gmail\.com/) !== 0) {
    throw "Not allowed sending emails to other addresses.";
  }

  const email = getEmail(
    "Helswingi 2019 - Registration confirmed",
    `

Payment link:
https://blackpepperswing1.typeform.com/to/wwByrS?regid=${confirmation.token}&email=${confirmation.email}&order=${confirmation.price}

  `
  );
  if (!email) throw "Can't process email";
  sendInBlue(to, email.subject, email.plain, {
    name: "Helswingi",
    from: "info@helswingi.fi",
    htmlBody: email.html
    // attachments: attachments
  });
}
