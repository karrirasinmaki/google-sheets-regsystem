function regDetails(reg) {
  let out = [];
  reg._headers.forEach((header, index) => {
    let data = reg._data[index]
    if (data === true) data = 'Yes'
    if (data === false) data = 'No'
    if (data.length > 0) {
      out.push([header, data])
    }
  })
  return out.map(e => e.join(':\n')).join('\n\n')
}

function paymentReceipt(reg) {
  const payment = null
  return `
This is a receipt of your payment.

____________
|
${!payment ? '' : `Payment date: 2018-08-09 15:14:07`}
${!payment ? '' : `Payment card: **** **** **** 9999 (Karri Rasinmäki)`}
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
Coop Swing Collective / Osuuskunta Swing Kollektiivi
FI28578381 (VAT number)
Mäkelänrinne 5 A 81, 00550 Helsinki, Finland
info@blackpepperswing.com
|____________
  `
}
