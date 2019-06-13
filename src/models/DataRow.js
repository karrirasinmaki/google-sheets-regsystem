export default class DataRow {
  constructor(sheet, row) {
    this._sheet = sheet
    this._row = row
    this._reload()
  }
  _reload() {
    this._lastColumn = this._sheet.getLastColumn()
    this._headers = this._sheet.getRange(1, 1, 1, this._lastColumn).getValues()[0]
    this._data = this._getDataRange().getValues()[0]
  }
  _getDataRange() {
    return this._data = this._sheet.getRange(this._row, 1, 1, this._lastColumn)
  }
  _getIndex(key) {
    return this._headers.indexOf(key)
  }
  // store = (data) => {
  //   if (data.length !== this._data.length) {
  //     throw `Given data array length should match original data array length. Now was ${data.length} and ${this._data.length}.`
  //   }
  //   this._getDataRange().setValues([data.map((item, index) => item === undefined ? this._data[index] : item)])
  // }
  storeCol(col, data) {
    if (typeof col === 'string') {
      col = this._getIndex(col) + 1
    }
    if (col <= 0) {
      throw 'Column index <= 0'
    }
    this._sheet.getRange(this._row, col).setValue(data)
  }
  get(key) {
    let index = this._getIndex(key)
    if (index === -1) return null
    return this._data[index]
  }
}
