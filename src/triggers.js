function triggerSendConfirmation(e) {
  if (!e || !e.range) {
    return;
  }
  const { range } = e;
  if (range.getSheet().getName() !== SHEET_REGS) {
    return;
  }
  const row = range.getRow();
  const sheet = range.getSheet();

  const sendlist = [];
  for (let i = 0, l = range.getNumRows(); i < l; ++i) {
    const confirmation = getReg(sheet, row + i);
    if (confirmation.action === "confirm") {
      sendlist.push(confirmation);
    }
  }

  timedTriggerRows(
    10,
    sendlist.map(e => ({
      sheet: e._sheet,
      row: e._row,
      col_trigger: "A",
      col_message: "B",
      callback() {
        return triggerSendConfirmationEmail(e._reload());
      }
    }))
  );
}

function triggerSendConfirmationEmail(confirmation) {
  if (!isNaN(confirmation.confirmationdate)) {
    // Todo: Check if email already sent
    throw "Sending cancelled: email already sent.";
  }
  try {
    sendConfirmationEmail(confirmation);
    sentlog("confirmed", confirmation.token);
    return "Confirmation sent.";
  } catch (exp) {
    throw `Error: ${JSON.stringify(exp)}`;
  }
}
