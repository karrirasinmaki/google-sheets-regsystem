import SentLog from './models/SentLog';
import Payment from './models/Payment';
import Reg from './models/Reg';
import Confirmation from './models/Confirmation';

import { tobrs, parseTemplateTags, getPaymentLink } from './utils';
import { regSummary, paymentDetails, sepaTransferDetails } from './info';

export function findSentLogByTokenAndType(token, type) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_SENT);
  const rows = sheet.getRange('B1:C').getValues();
  for (let i = 0, l = rows.length; i < l; ++i) {
    const row = rows[i];
    if (row[0] === type && row[1] === token) {
      return new SentLog(sheet, i + 1);
    }
  }
  return null
}

export function findRegById(id) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_REGS);
  const rows = sheet.getRange('A1:A').getValues();
  for (let i = 0, l = rows.length; i < l; ++i) {
    const row = rows[i];
    if (row[0] === id) {
      return getReg(sheet, i + 1);
    }
  }
  return null
}

export function findConfirmationById(id) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_CONFIRMATIONS);
  const rows = sheet.getRange('A1:A').getValues();
  for (let i = 0, l = rows.length; i < l; ++i) {
    const row = rows[i];
    if (row[0] === id) {
      return new Confirmation(sheet, i + 1);
    }
  }
  return null
}

export function findPaymentByRegId(id) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_PAYMENTS);
  const rows = sheet.getRange('A1:A').getValues();
  for (let i = 0, l = rows.length; i < l; ++i) {
    const row = rows[i];
    if (row[0] === id) {
      return new Payment(sheet, i + 1);
    }
  }
  return null
}

export function createConfirmation(reg, status = 'Pending') {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_CONFIRMATIONS);
  return Confirmation.append(sheet, {
    token: reg.token,
    status,
  })
}

/**
 * Registration
 * ---
 * id - (string) confirmation id
 *  OR
 * sheet - (SpreadSheet) spreadsheet instance
 * row - (number) row
 */
export function getReg(idOrSheet, rowOrNone) {
  // Using sheet and row
  if (idOrSheet && rowOrNone) {
    return new Reg(idOrSheet, rowOrNone);
  }
  // Using id

  return findRegById(idOrSheet);
}

/**
 * Email
 * ---
 * params: {
 *   subject - (string) email subject
 *   content - (string) email content
 *   head - (optional|string) extra code to head block
 *   contentbrs - (optional|boolean) default=true, convert line breaks to br tags
 * }
 */
export function getEmail(params) {
  const { contentbrs = true, content = '' } = params
  const html = HtmlService.createTemplateFromFile(
    'email-confirmation',
  ).evaluate();
  const tags = {
    HEAD: params.head || '',
    TITLE: params.subject,
    IMAGE_URL: EMAIL_IMAGE_URL,
    CONTENT: contentbrs ? tobrs(content) : content,
    FB_PAGE,
    IG_PAGE,
    WWW_PAGE,
  };
  const htmlContent = parseTemplateTags(
    parseTemplateTags(html.getContent(), tags),
    tags,
  );
  const plain = parseTemplateTags(
    parseTemplateTags(content.replace(/<[^>]+>/g, ''), tags),
    tags,
  );
  return {
    subject: params.subject,
    html: htmlContent,
    plain,
  };
}

export function getConfirmationEmail(reg) {
  return getEmail({
    subject: `${EVENT_NAME} - Registration confirmed`,
    content: `
Hello, ${reg.firstName} ${reg.lastName}!

We are happy to inform you, that your registration for ${EVENT_NAME} is confirmed. Please make your payment within 14 days from today.

Order summary:
${regSummary(reg)}

SEPA bank transfer details:
${sepaTransferDetails(reg)}

You can also pay using Smartum / Edenred / ePassi vouchers. Refer to our <a href="${EVENT_WWW_FAQ}">FAQ page</a> for details.

For the full invoice and registration details, follow this link:
https://www.helswingi.fi/registration/details?regid=${reg.token}

If you have any questions, please visit our <a href="${EVENT_WWW_FAQ}">frequently asked questions page</a> or contact us by replying to this email. Visit our <a href="${EVENT_WWW}">website</a>, <a href="${EVENT_FB_EVENT}">Facebook event</a> or <a href="${EVENT_INSTAGRAM}">Instagram</a> for continuous event information updates.

Welcome to Helswingi!

${EVENT_EMAIL}
${EVENT_WWW}
${EVENT_FACEBOOK}
${EVENT_INSTAGRAM}
    `,
  });
}

export function getReceivedEmail(reg) {
  return getEmail({
    subject: `${EVENT_NAME} - Registration received`,
    content: `
Hello, ${reg.firstName} ${reg.lastName}!

Thank you very much for registering for Helswingi 2023.

We have received your registration and will start processing it shortly. We will get back to you within the next 10 days with your registration status (and payment details).

Here is a summary of your registration:
${regSummary(reg)}

Full registration details:
https://www.helswingi.fi/registration/details?regid=${reg.token}

If you have any questions, please visit our <a href="${EVENT_WWW_FAQ}">frequently asked questions page</a> or contact us by replying to this email. Visit our <a href="${EVENT_WWW}">website</a>, <a href="${EVENT_FB_EVENT}">Facebook event</a> or <a href="${EVENT_INSTAGRAM}">Instagram</a> for continuous event information updates.

Thank you,
Your Helswingi team

${EVENT_EMAIL}
${EVENT_WWW}
${EVENT_FACEBOOK}
${EVENT_INSTAGRAM}
  `,
  });
}

export function getReceiptEmail(reg, receipt) {
  return getEmail({
    subject: `${EVENT_NAME} - Payment receipt`,
    content: `
Hello, ${reg.firstName} ${reg.lastName}!

${receipt}
  `,
  });
}
