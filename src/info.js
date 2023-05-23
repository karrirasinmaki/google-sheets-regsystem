import { findPaymentByRegId, findPaymentsByRegId, findRegById } from './data';

export function regDetails(reg) {
  let out = [];
  let hide = [
    'price_extratrack', 'price_fullpass',
    'price_partypass', 'price_tshirt'
  ];
  reg._headers.forEach((header, index) => {
    let data = reg._data[index]
    if (header[0] === '_') return;
    if (hide.indexOf(header) !== -1) return;
    if (data === true) data = 'Yes'
    if (data === false) data = 'No'
    if (!!data || data.length > 0) {
      out.push([header, data])
    }
  })
  return out.map(e => e.join(':\n')).join('\n\n')
}

export function regSummary(reg) {
  const listfn = (...items) => {
    let res = '' + items.filter(item => (''+item).length > 0).join(', ')
    if (res.length > 0) {
      return `(${res})`
    }
    return ''
  }
  let summ = []

  // Pass
  let pass_partner = reg.pass_partner ? 'partner ' + reg.pass_partner : ''
  summ.push(`- Ticket: ${reg.pass} ${listfn(reg.pass_track, reg.pass_role, pass_partner)}`)
  // Extra pass
  if (reg.has_extrapass) {
    let extrapass_partner = reg.extrapass_partner ? 'partner ' + reg.extrapass_partner : ''
    summ.push(`- Extra track: ${reg.extrapass} ${listfn(reg.extrapass_role, extrapass_partner)}`)
  }
  // T-Shirt
  summ.push(`- T-Shirt, ${reg.tshirt} ${listfn(reg.thsirt_size, reg.thsirt_type)}`)
  // Total
  summ.push(`- Total: ${reg.score}€`)

  return summ.join('\n')
}

export function paymentDetailsSEPA(reg) {
  if (!reg) reg = findRegById(payment.reg_id)
  return `Amount: ${reg.score}€
Beneficiary name: ${ORG_NAME_LEGAL}
Address: ${ORG_ADDRESS}
IBAN: ${ORG_IBAN}
BIC: ${ORG_BIC}
Message: ${EVENT_NAME} - ${reg.email.replace('@', '-at-')}`
}


export function paymentDetails(reg) {
  if (!reg) reg = findRegById(payment.reg_id)
  return `
____________
|
| INVOICE
| ${EVENT_NAME}
| ${reg.firstName} ${reg.lastName}
________

SEPA bank transfer details

${paymentDetailsSEPA(reg)}
________

Order summary

Order id: ${reg.token}
Order details:
- ${reg.pass}
  incl. VAT 10%
${!reg.has_extrapass ? '' :
`- Extra pass, ${reg.extrapass}
  incl. VAT 10%`}
${!reg.has_tshirt ? '' :
`- T-Shirt, ${reg.tshirt}
  incl. VAT 24%`}
  ----------
  Total: ${reg.score}€
|__________________________
${ORG_NAME_LEGAL} (${ORG_VATNUM})

     T H A N K  Y O U !

  `
}

export function paymentReceipt(reg, payment) {
  if (!reg) reg = findRegById(payment.reg_id)

  let payments = []
  if (!payment) {
    payments = findPaymentsByRegId(reg.token)
  }
  else {
    payments = [payment]
  }

  return `
____________
|
| PAYMENT RECEIPT
|
${payments.map(payment => (`
${payment.paid}€ ${payment.message}
Payment date: ${payment.date}`))}

Order id: ${reg.token}
Order details:
- ${reg.pass}
  incl. VAT 10%
${!reg.has_extrapass ? '' :
`- Extra pass, ${reg.extrapass}
  incl. VAT 10%`}
${!reg.has_tshirt ? '' :
`- T-Shirt, ${reg.tshirt}
  incl. VAT 24%`}
  ----------
  Total: ${reg.score}€

________

${ORG_NAME_LEGAL} (${ORG_VATNUM})
${ORG_ADDRESS}
${ORG_EMAIL}
|____________
  `
}

export function legalInfo(reg, payment) {
  return `${ORG_NAME_LEGAL}
${ORG_VATNUM} (VAT number)
${ORG_ADDRESS}
${ORG_EMAIL}`
}
