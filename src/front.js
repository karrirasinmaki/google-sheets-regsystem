function doGet(e) {
  if (e.parameter.page === "registration") {
    return doGetRegistration(e);
  }
  return renderPage(`
<a href="http://www.helswingi.fi" target="_blank">www.helswingi.fi</a>
  `);
}

function doGetRegistration(e) {
  const reg = getReg(e.parameter.regid);
  if (!reg) {
    return renderPage('No registration found. Please check the link is correct.');
  }
  const confirmation = findConfirmationById(reg.token)||{}
  const due_date = confirmation.timestamp ? (
    new Date(new Date(confirmation.timestamp).setDate(confirmation.timestamp.getDate()+14))
  ) : null
  return renderPage(include('front', {
    reg: reg,
    confirmation: confirmation,
    due_date: due_date,
    receipt: paymentReceipt(reg),
    reg_details: tobrs(regDetails(reg)),
    payment_link: getPaymentLink(reg),
  }));
}

function renderPage(content) {
  return HtmlService
  //.createTemplateFromFile('front-template')
  //.createHtmlOutput(content)
  //.evaluate()
    .createHtmlOutput(getEmail({
      head: include('front-css'),
      subject: 'Registration details',
      content: content,
      contentbrs: false,
    }).html)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
}

function include(filename, data) {
  let template = HtmlService.createTemplateFromFile(filename)
  template.data = data
  return template.evaluate().getContent()
}

global.doGet = doGet
global.include = include
