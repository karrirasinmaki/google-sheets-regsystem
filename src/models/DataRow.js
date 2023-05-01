export default class DataRow {
  static _append(sheet, data) {
    return DataRow._transaction(() => {
      sheet.appendRow(data)
      return sheet.getLastRow()
    })
  }

  static _transaction(fn) {
    const lock = LockService.getScriptLock()
    try {
      lock.waitLock(10000)
    } catch (e) {
      Logger.log('Could not obtain lock after 10 seconds.')
    }
    const ret = fn()
    lock.releaseLock()
    return ret
  }

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

  _store() {
    // TODO
    this._getDataRange().setValues([this._data])
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
    const index = this._getIndex(key)
    if (index === -1) return null
    return this._data[index]
  }
}
