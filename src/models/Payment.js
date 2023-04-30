import DataRow from './DataRow';

export default class Confirmation extends DataRow {
  constructor(sheet, row) {
    super(sheet, row)
  }

  _reload() {
    super._reload()
    this.reg_id = this.get('Token')
    this.paid = this.get('Paid')
    this.date = this.get('Date')
    this.message = this.get('Message')
    this.score = this.get('Score')
    this.balance = this.get('Balance')
  }
}
