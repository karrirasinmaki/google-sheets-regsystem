function tobrs(text) {
  return text.split("\n").join("<br/>");
}

function parseTemplateTags(content, tags) {
  let cont = '' + content
  Object.keys(tags).forEach(key => {
    cont = cont.replace("{{"+key+"}}", tags[key])
  })
  return cont
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

function getPaymentLink(reg) {
  const getNum = (str) => {
    let val = +(str.replace(/.*(?:\+|\s)(\d+)€/, '$1')||0)
    return isNaN(val) ? 0 : val
  }
  let regid = encodeURIComponent(reg.token)
  let email = encodeURIComponent(reg.email)
  let p = getNum(reg.pass)
  let e = getNum(reg.extrapass) + getNum(reg.tshirt)
  if (reg.score !== p+e) return 'Invalid payment url'
  return `https://blackpepperswing1.typeform.com/to/wwByrS?regid=${regid}&email=${email}&order=${reg.score}&p=${p}&e=${e}`
}
