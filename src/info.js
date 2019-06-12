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

function ntobr(str) {
  return str.replace(/\n/g, '<br />')
}
