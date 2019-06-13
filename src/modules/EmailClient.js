export function sendInBlue(to, subject, content, options) {
  const data = {
    sender: {
      name: options.name,
      email: options.from
    },
    replyTo: {
      name: options.name,
      email: options.from
    },
    textContent: content,
    htmlContent: options.htmlBody,
    subject,
    to: [
      {
        email: to
      }
    ]
  };
  if (options.attachments) {
    data.attachment = options.attachments.map(function(a) {
      return {
        name: a.getName(),
        content: Utilities.base64Encode(a.getBlob().getBytes())
      };
    });
  }
  console.log(data);
  const response = UrlFetchApp.fetch("https://api.sendinblue.com/v3/smtp/email", {
    method: "post",
    contentType: "application/json",
    headers: {
      "api-key": SENDINBLUE_APIKEY
    },
    // Convert the JavaScript object to a JSON string.
    payload: JSON.stringify(data)
  });
  const reponseCode = response.getResponseCode()
  if (reponseCode >= 400) {
    throw response.getContentText()
  }
  return true
}
