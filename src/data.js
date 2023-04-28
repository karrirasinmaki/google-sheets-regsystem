import Reg from './models/Reg';
import SentLog from './models/SentLog';
import Payment from './models/Payment';
// import Confirmation from './models/Confirmation';

function findSentLogByTokenAndType(token, type) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_SENT);
  const rows = sheet.getRange("B1:C").getValues();
  for (var i = 0, l = rows.length; i < l; ++i) {
    const row = rows[i];
    if (row[0] === type && row[1] === token) {
      return new SentLog(sheet, i + 1);
    }
  }
  return null
}

function findRegById(id) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_REGS);
  const rows = sheet.getRange("A1:A").getValues();
  for (var i = 0, l = rows.length; i < l; ++i) {
    const row = rows[i];
    if (row[0] === id) {
      return getReg(sheet, i + 1);
    }
  }
  return null
}

function findConfirmationById(id) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_CONFIRMATIONS);
  const rows = sheet.getRange("A1:A").getValues();
  for (var i = 0, l = rows.length; i < l; ++i) {
    const row = rows[i];
    if (row[0] === id) {
      return new Confirmation(sheet, i + 1);
    }
  }
  return null
}

function findPaymentByRegId(id) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_PAYMENTS);
  const rows = sheet.getRange("A1:A").getValues();
  for (var i = 0, l = rows.length; i < l; ++i) {
    const row = rows[i];
    if (row[0] === id) {
      return new Payment(sheet, i + 1);
    }
  }
  return null
}

/**
 * Registration
 * ---
 * id - (string) confirmation id
 *  OR
 * sheet - (SpreadSheet) spreadsheet instance
 * row - (number) row
 */
function getReg(idOrSheet, rowOrNone) {
  // Using sheet and row
  if (idOrSheet && rowOrNone) {
    return new Reg(idOrSheet, rowOrNone);
  }
  // Using id
  else {
    return findRegById(idOrSheet);
  }
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
function getEmail(params) {
  const { contentbrs=true } = params
  const html = HtmlService.createTemplateFromFile(
    "email-confirmation"
  ).evaluate();
  const tags = {
    HEAD: params.head||'',
    TITLE: params.subject,
    IMAGE_URL: EMAIL_IMAGE_URL,
    CONTENT: contentbrs ? tobrs(params.content) : params.content,
    FB_PAGE: FB_PAGE,
    IG_PAGE: IG_PAGE,
    WWW_PAGE: WWW_PAGE,
  };
  const content = parseTemplateTags(
    parseTemplateTags(html.getContent(), tags),
    tags
  );
  const plain = content.replace(/<[^>]+>/g, "");
  return {
    subject: params.subject,
    html: content,
    plain
  };
}

function getConfirmationEmail(reg) {
  return getEmail({
    subject: EVENT_NAME + " - Registration confirmed",
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
  `
  });
}

function getReceiptEmail(reg, receipt) {
  return getEmail({
    subject: EVENT_NAME + " - Payment receipt",
    content: `
Hello, ${reg.firstName} ${reg.lastName}!

${receipt}
  `
  });
}
