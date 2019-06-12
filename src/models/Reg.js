import DataRow from './DataRow';

export default class Reg extends DataRow {
  constructor(sheet, row) {
    super(sheet, row)
  }
  _reload() {
    super._reload()
    let data = this._data
    this.action = data[0]
    this.token = data[29]
    this.firstName = data[3]
    this.lastName = data[4]
    this.email = data[5]
    this.tel = data[6]
    this.pass = data[9]
    this.pass_partner = data[18]
    this.pass_role = data[15]
    this.extrapass = data[10]
    this.extrapass_partner = data[11] || data[12]
    this.extrapass_role = data[13]
    this.score = data[26]
  }
}
