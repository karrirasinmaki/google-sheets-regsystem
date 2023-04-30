// stub
// will be transported to apps script as is

function test_triggerNewRegistration() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Regs");
  var range = sheet.getRange('A4:D4');
  triggerNewRegistration({range: range});
}
