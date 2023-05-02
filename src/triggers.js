import Reg from './models/Reg';
import Confirmation from './models/Confirmation';
import Payment from './models/Payment';
import { sendEmail } from './modules/PostOffice';
import { sentlog } from './modules/Log'

import { getReceiptEmail, findRegById, getReceivedEmail, getConfirmationEmail, getReg, findSentLogByTokenAndType, findConfirmationById, createConfirmation } from './data';
import { timedTriggerRows } from './utils';
import { paymentReceipt } from './info';

/** ENTRY POINTS **/

function triggerOnEdit(e) {
  if (!e || !e.range) {
    return;
  }
  console.log("Trigger: onEdit")
  console.log(JSON.stringify(e))

  triggerRegAction(e)
  triggerChangeConfirmationStatus(e)
  // triggerNewPayment(e)
}
global.triggerOnEdit = triggerOnEdit

function triggerOnChange(e) {
  if (!e || !e.source) {
    return;
  }
  console.log("Trigger: onChange")
  console.log(JSON.stringify(e))

  triggerCheckNewRegistrations(e)
}
global.triggerOnChange = triggerOnChange


/** CALLABLE TRIGGERS **/

function triggerRegAction(e) {
  if (!e || !e.range) {
    return;
  }
  const { range } = e;
  if (range.getSheet().getName() !== SHEET_REGS) {
    return;
  }

  const row = range.getRow();
  const sheet = range.getSheet();
  for (let i = 0, l = range.getNumRows(); i < l; ++i) {
    const reg = new Reg(sheet, row + i)
    if (reg && reg.action === 'confirm') {
      const confirmation = findConfirmationById(reg.token)
      if (confirmation) {
        confirmation.status = 'Confirmed'
        confirmation.message = ''
        confirmation.timestamp = new Date()
        if (!findSentLogByTokenAndType(reg.token, 'Confirmed')) {
          confirmation.message = triggerSendConfirmationEmail(confirmation)
        }
        else {
          confirmation.message = 'Already confirmed before.'
        }
        confirmation.store()
        reg.storeCol('action', '')
      }
    }
  }
}

function triggerChangeConfirmationStatus(e) {
  if (!e || !e.range) {
    return;
  }
  const { range } = e;
  if (range.getSheet().getName() !== SHEET_CONFIRMATIONS) {
    return;
  }

  const row = range.getRow();
  const sheet = range.getSheet();
  const sendlist = [];
  for (let i = 0, l = range.getNumRows(); i < l; ++i) {
    const confirmation = new Confirmation(sheet, row + i)
    if (!!confirmation.timestamp || !!confirmation.message) {
      continue;
    }
    if (confirmation.status === 'Confirmed') {
      sendlist.push(confirmation);
    }
  }

  timedTriggerRows(
    10,
    sendlist.map(e => ({
      sheet: e._sheet,
      row: e._row,
      col_trigger: 'B',
      col_message: 'C',
      clearTrigger: false,
      callback() {
        e._reload()
        return triggerSendConfirmationEmail(e);
      },
    })),
  );
}

/**
 * Check new registrations
 */
function triggerCheckNewRegistrations() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_REGS);
  const range = sheet.getRange("A2:C");

  const row = range.getRow();
  const values = range.getValues();
  // const sheet = range.getSheet();
  const sendlist = [];
  for (let i = 0, l = range.getNumRows(); i < l; ++i) {
    if (!values[i][0]) continue;
    if (''+values[i][2] !== 'null') continue;

    const reg = new Reg(sheet, row + i)
    if (!!reg.token && reg.status == "null") {
      createConfirmation(reg, 'Pending')
      if (!findSentLogByTokenAndType(reg.token, 'Received')) {
        triggerSendReceivedEmail(reg)
      }
    }
  }
}

function triggerNewPayment(e) {
  if (!e || !e.range) {
    return;
  }
  const { range } = e;
  if (range.getSheet().getName() !== SHEET_PAYMENTS) {
    return;
  }

  const row = range.getRow();
  const sheet = range.getSheet();
  const sendlist = [];
  for (let i = 0, l = range.getNumRows(); i < l; ++i) {
    const payment = new Payment(sheet, row + i)
    if (!findSentLogByTokenAndType(payment.reg_id, 'Receipt')) {
      triggerSendReceiptEmail(payment)
    }
  }
}

function triggerSendConfirmationEmail(confirmation) {
  // if (!isNaN(confirmation.confirmationdate)) {
  //   // Todo: Check if email already sent
  //   throw "Sending cancelled: email already sent.";
  // }
  try {
    const reg = getReg(confirmation.token)
    const email = getConfirmationEmail(reg)
    sendEmail(reg.email, email)
    sentlog(confirmation.status, confirmation.token)
    confirmation.storeCol('Timestamp', new Date())
    return `Sent: ${new Date().toJSON()}`
  } catch (exp) {
    sentlog('error', confirmation.token, JSON.stringify(exp))
    throw exp
  }
}

function triggerSendReceivedEmail(reg) {
  // if (!isNaN(confirmation.confirmationdate)) {
  //   // Todo: Check if email already sent
  //   throw "Sending cancelled: email already sent.";
  // }
  try {
    // const reg = getReg(confirmation.token)
    const email = getReceivedEmail(reg)
    sendEmail(reg.email, email)
    sentlog('Received', reg.token)
    return `Sent: ${new Date().toJSON()}`
  } catch (exp) {
    sentlog('error', reg.token, JSON.stringify(exp))
    throw exp
  }
}

function triggerSendReceiptEmail(payment) {
  // if (!isNaN(confirmation.confirmationdate)) {
  //   // Todo: Check if email already sent
  //   throw "Sending cancelled: email already sent.";
  // }
  try {
    const reg = findRegById(payment.reg_id)
    sendEmail(reg.email, getReceiptEmail(reg, paymentReceipt(reg, payment)))
    sentlog('Receipt', payment.reg_id)
    return `Sent: ${new Date().toJSON()}`
  } catch (exp) {
    sentlog('error', payment.reg_id, JSON.stringify(exp))
    throw exp
  }
}
