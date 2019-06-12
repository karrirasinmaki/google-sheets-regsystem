function tobrs(text) {
  return text.split("\n").join("<br/>");
}

function parseTemplateTags(content, tags) {
  return content
    .replace("{{TITLE}}", tags.TITLE)
    .replace("{{IMAGE_URL}}", tags.IMAGE_URL)
    .replace("{{ROLE}}", tags.ROLE)
    .replace("{{CONTENT}}", tags.CONTENT);
}

function sentlog(type, token, details='') {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    SHEET_SENT
  );
  sheet.appendRow([new Date(), type, token, details]);
}

/**
 * seconds: number
 * row: {
 *   sheet: object,
 *   row: number,
 *   col_trigger: string,
 *   col_message: string,
 *   clearTrigger: boolean,
 *   callback: fn,
 * }
 */
function timedTriggerRows(seconds, rows) {
  for (var i = seconds, step = 2; i > 0; i -= step) {
    rows.forEach(function(row) {
      row.sheet
        .getRange(row.col_message + row.row)
        .setValue(`Sending in ${i} seconds...`);
    });
    SpreadsheetApp.flush();
    Utilities.sleep(step * 1000);
  }
  rows.forEach(function(row) {
    const triggerCell = row.sheet.getRange(row.col_trigger + row.row);
    const notifyCell = row.sheet.getRange(row.col_message + row.row);
    let message = null;
    try {
      if (triggerCell.getValue().length === 0) {
        throw "Cancelled";
      } else {
        message = row.callback();
      }
    } catch (e) {
      console.error(e);
      message = e.message || e;
    }
    notifyCell.setValue(message);
    if (row.clearTrigger) {
      triggerCell.setValue("");
    }
  });
}
