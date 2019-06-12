export default class DataRow {
  constructor(sheet, row) {
    this._sheet = sheet
    this._row = row
    this._reload()
  }
  _reload() {
    this._lastColumn = this._sheet.getLastColumn()
    this._headers = this._sheet.getRange(1, 1, 1, this._lastColumn).getValues()[0]
    this._data = this._sheet.getRange(this._row, 1, 1, this._lastColumn).getValues()[0];
  }
  get(key) {
    headers.forEach(function(h, index) {
      if (h === key) {
        return this._data[index]
      }
    })
  }
}
