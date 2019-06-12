function doGet(e) {
  if (e.parameter.page === "registration") {
    return doGetRegistration(e);
  }
  return HtmlService.createHtmlOutput("loo" + JSON.stringify(e));
}

function doGetRegistration(e) {
  const requireEmail = false
  const reg = getReg(e.parameter.regid);
  if (requireEmail && e.parameter.email.toLowerCase() !== reg.email.toLowerCase()) {
    return HtmlService.createHtmlOutput(
      "No registration found. Please give correct reg id and email."
    );
  }
  return HtmlService.createHtmlOutput(ntobr(regDetails(reg)));
}

global.doGet = doGet
