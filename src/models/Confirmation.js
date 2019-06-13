import DataRow from './DataRow';

export default class Confirmation extends DataRow {
  constructor(sheet, row) {
    super(sheet, row)
  }
  _reload() {
    super._reload()
    let data = this._data
    this.token = data[0]
    this.status = data[1]
    this.message = data[2]
    this.timestamp = data[3]
  }
}
