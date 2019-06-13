function doGet(e) {
  if (e.parameter.page === "registration") {
    return doGetRegistration(e);
  }
  return renderPage("loo" + JSON.stringify(e));
}

function doGetRegistration(e) {
  const requireEmail = false
  const reg = getReg(e.parameter.regid);
  if (requireEmail && e.parameter.email.toLowerCase() !== reg.email.toLowerCase()) {
    return renderPage('No registration found. Please give correct reg id and email.');
  }
  if (!reg) {
    return renderPage('No registration found. Please check you used the correct link.');
  }
  return renderPage(include('front', {
    reg: reg,
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
