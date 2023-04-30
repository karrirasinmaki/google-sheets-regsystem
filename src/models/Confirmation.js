import DataRow from './DataRow';
import { findConfirmationById } from '../data';

export default class Confirmation extends DataRow {
  static append(sheet, { token, status, message = '' }) {
    if (findConfirmationById(token)) {
      throw `Row ${token} already exists.`
    }
    const rownum = DataRow._append(sheet, [token, status, message, new Date()])
    return new Confirmation(sheet, rownum)
  }

  constructor(sheet, row) {
    super(sheet, row)
  }

  _reload() {
    super._reload()
    const data = this._data
    this.token = data[0]
    this.status = data[1]
    this.message = data[2]
    this.timestamp = data[3]
  }
}
