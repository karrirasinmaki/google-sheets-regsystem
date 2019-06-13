import Reg from './models/Reg';
// import Confirmation from './models/Confirmation';

function findRegById(id) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_REGS);
  const rows = sheet.getRange("AC1:AC").getValues();
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
    subject: "Helswingi 2019 - Registration confirmed",
    content: `
Hello, ${reg.firstName} ${reg.lastName}!

We are happy to inform you, that your registration for Helswingi 2019 is confirmed. Please make your payment within 14 days from today.

Order summary:
${regSummary(reg)}

Payment link:
${getPaymentLink(reg)}

Your registration details:
https://www.helswingi.fi/registration-details?regid=${reg.token}

We regularly update our website, Facebook event page and Instagram with the latest news about the festival. If you have any questions, please contact us via e-mail at info@helswingi.fi.

Welcome to Helswingi!

https://www.helswingi.fi/
https://www.facebook.com/events/357214858208526/
https://www.instagram.com/helswingi/


Ps. You can also make your payment using a wire transfer. Transfer details:

Amount: ${reg.score}€
Beneficiary name: Coop Swing Collective
Address: Mäkelänrinne 5 A 81, 00550 Helsinki, Finland
IBAN: FI82 7997 7996 5259 81
BIC: HOLVFIHH
Message: Helswingi 2019 - ${reg.token}
  `
  });
}
