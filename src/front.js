import { tobrs, getPaymentLink } from './utils';
import { regSummary, regDetails, paymentReceipt, legalInfo } from './info';
import { findConfirmationById, getEmail, getReg } from './data';

function doGet(e) {
  if (e.parameter.page === 'registration') {
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
  const confirmation = findConfirmationById(reg.token) || {}
  const due_date = confirmation.timestamp ? (
    new Date(new Date(confirmation.timestamp).setDate(confirmation.timestamp.getDate() + 14))
  ) : null
  return renderPage(include('front', {
    reg,
    confirmation,
    due_date,
    receipt: paymentReceipt(reg),
    reg_details: tobrs(regDetails(reg)),
    payment_link: getPaymentLink(reg),
    legal_info: tobrs(legalInfo()),
  }));
}

function renderPage(content) {
  return HtmlService
  // .createTemplateFromFile('front-template')
  // .createHtmlOutput(content)
  // .evaluate()
    .createHtmlOutput(getEmail({
      head: include('front-css'),
      subject: 'Registration details',
      content,
      contentbrs: false,
    }).html)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
}

function include(filename, data) {
  const template = HtmlService.createTemplateFromFile(filename)
  template.data = data
  return template.evaluate().getContent()
}

global.doGet = doGet
global.include = include
