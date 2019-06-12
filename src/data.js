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
  var data;
  var sheet;
  var row;
  // Using sheet and row
  if (idOrSheet && rowOrNone) {
    sheet = idOrSheet;
    row = rowOrNone;
    data = sheet.getRange(`A${row}:AD${row}`).getValues()[0];
    console.log(row);
    console.log(data);
  }
  // Using id
  else {
    return findRegById(idOrSheet);
  }
  if (!data) return null;
  const headers = sheet.getRange("A1:AD1").getValues()[0];
  const get = function(key) {
    let out = null;
    headers.forEach(function(h, index) {
      if (h === key) {
        out = data[index];
        return true;
      }
    });
  };
  const reload = function() {
    return getReg(sheet, row);
  };
  return {
    _sheet: sheet,
    _row: row,
    _headers: headers,
    _reload: reload,
    _data: data,
    get,
    action: data[0],
    token: data[29],
    firstName: data[3],
    lastName: data[4],
    email: data[5],
    tel: data[6],
    pass: data[9],
    pass_partner: data[18],
    pass_role: data[15],
    extrapass: data[10],
    extrapass_partner: data[11] || data[12],
    extrapass_role: data[13],
    score: data[26]
  };
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
    // IMAGE_URL: course.img,
    CONTENT: tobrs(params.content)
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
