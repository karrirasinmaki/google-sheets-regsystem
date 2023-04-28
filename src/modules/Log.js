export function sentlog(type, token, details='') {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    SHEET_SENT
  );
  sheet.appendRow([new Date(), type, token, details]);
}

