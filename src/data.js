import SentLog from './models/SentLog';
import Payment from './models/Payment';
import Reg from './models/Reg';
import Confirmation from './models/Confirmation';

import { tobrs, parseTemplateTags, getPaymentLink } from './utils';
import { regSummary } from './info';

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

Payment link:
${getPaymentLink(reg)}

Your registration details:
https://www.helswingi.fi/registration/details?regid=${reg.token}

We regularly update our website, Facebook event page and Instagram with the latest news about the festival. If you have any questions, please contact us via e-mail at ${EVENT_EMAIL}.

Welcome to Helswingi!

${EVENT_WWW}
${EVENT_FACEBOOK}
${EVENT_INSTAGRAM}

Ps. You can also make your payment using a wire transfer. Transfer details:

Amount: ${reg.score}€
Beneficiary name: ${ORG_NAME_LEGAL}
Address: ${ORG_ADDRESS}
IBAN: ${ORG_IBAN}
BIC: ${ORG_BIC}
Message: ${EVENT_NAME} - ${reg.token}
  `,
  });
}

export function getReceivedEmail(reg) {
  return getEmail({
    subject: `${EVENT_NAME} - Registration received`,
    content: `
Hello, ${reg.firstName} ${reg.lastName}!

We have received your registration.

Here's a summary of your registration:

${regSummary(reg)}

Your registration details:
https://www.helswingi.fi/registration/details?regid=${reg.token}

We regularly update our website, Facebook event page and Instagram with the latest news about the festival. If you have any questions, please contact us via e-mail at ${EVENT_EMAIL}.

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
