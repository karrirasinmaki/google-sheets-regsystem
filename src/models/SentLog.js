import DataRow from './DataRow';

export default class SentLog extends DataRow {
  constructor(sheet, row) {
    super(sheet, row)
  }
  _reload() {
    super._reload()
    let data = this._data
    this.timestamp = data[0]
    this.type = data[1]
    this.token = data[2]
    this.details = data[3]
  }
}
