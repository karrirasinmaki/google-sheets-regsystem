import DataRow from './DataRow';

export default class Reg extends DataRow {
  constructor(sheet, row) {
    super(sheet, row)
  }

  _reload() {
    super._reload()
    const data = this._data
    this.action = this.get('action')
    this.status = this.get('status')
    this.paid = !!this.get('paid')
    this.token = this.get('token')
    this.firstName = this.get('First name')
    this.lastName = this.get('Last name')
    this.email = this.get('Email')
    this.tel = this.get('Phone number')
    this.pass = this.get('Pass type')
    this.pass_track = this.get('Full pass track')
    this.pass_partner = this.get('Partner')
    this.pass_role = this.get('Role')
    this.extrapass = this.get('Extra track?')
    this.extrapass_partner = this.get('Aerials - Partner name and email') || this.get('Slow Bal - Partner')
    this.extrapass_role = this.get('Slow Bal - Role')
    this.has_extrapass = (`${this.extrapass}`).toLowerCase() !== 'no thanks'
    this.tshirt = this.get('I want to get a T-shirt')
    this.thsirt_size = this.get('T-shirt type and size')
    this.has_tshirt = (`${this.tshirt}`).toLowerCase() !== 'no'
    this.score = this.get('Score')
    this.group = this.get('Group')
  }
}
