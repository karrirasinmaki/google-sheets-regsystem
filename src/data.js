import Reg from './models/Reg';

function findRegById(id) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_REGS);
  const rows = sheet.getRange("AD1:AD").getValues();
  for (var i = 0, l = rows.length; i < l; ++i) {
    const row = rows[i];
    if (row[0] === id) {
      return getReg(sheet, i + 1);
    }
  }
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
 * }
 */
function getEmail(params) {
  const html = HtmlService.createTemplateFromFile(
    "email-confirmation"
  ).evaluate();
  const tags = {
    TITLE: params.subject,
    IMAGE_URL: EMAIL_IMAGE_URL,
    CONTENT: tobrs(params.content),
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

function getConfirmationEmail(confirmation) {
  return getEmail({
    subject: "Helswingi 2019 - Registration confirmed",
    content: `

Payment link:
https://blackpepperswing1.typeform.com/to/wwByrS?regid=${confirmation.token}&email=${confirmation.email}&order=${confirmation.price}

  `
  });
}
