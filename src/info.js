import { findPaymentByRegId, findRegById } from './data';

export function regDetails(reg) {
  let out = [];
  reg._headers.forEach((header, index) => {
    let data = reg._data[index]
    if (header[0] === '_') return
    if (data === true) data = 'Yes'
    if (data === false) data = 'No'
    if (!!data || data.length > 0) {
      out.push([header, data])
    }
  })
  return out.map(e => e.join(':\n')).join('\n\n')
}

export function regSummary(reg) {
  const listfn = (...items) => items.filter(item => (''+item).length > 0).join(', ')
  let summ = []
  // Pass
  let pass_partner = reg.pass_partner ? 'partner ' + reg.pass_partner : ''
  summ.push(`- ${reg.pass} (${listfn(reg.pass_track, reg.pass_role, pass_partner)})`)
  // Extra pass
  if (reg.has_extrapass) {
    let extrapass_partner = reg.extrapass_partner ? 'partner ' + reg.extrapass_partner : ''
    summ.push(`- Extra track, ${reg.extrapass} (${listfn(reg.extrapass_role, extrapass_partner)})`)
  }
  // T-Shirt
  if (reg.has_tshirt) {
    summ.push(`- T-Shirt, ${reg.tshirt} (${reg.thsirt_size})`)
  }
  summ.push(`- Total: ${reg.score}€`)
  return summ.join('\n')
}

export function paymentReceipt(reg, payment) {
  if (!payment) payment = findPaymentByRegId(reg.token)
  if (!reg) reg = findRegById(payment.reg_id)
  return `
This is a receipt for your payment.

____________
|
${!payment ? '' :
`${payment.message}

Payment date: ${new Date(payment.date).toJSON()}`}
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

Merchant:
${ORG_NAME_LEGAL}
${ORG_VATNUM} (VAT number)
${ORG_ADDRESS}
${ORG_EMAIL}
|____________
  `
}

export function legalInfo(reg, payment) {
  return `
${ORG_NAME_LEGAL}
${ORG_VATNUM} (VAT number)
${ORG_ADDRESS}
${ORG_EMAIL}
  `
}
