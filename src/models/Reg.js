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

    this.country = this.get('Country')
    this.city = this.get('City')
    this.dance_experience = this.get('Please tell us how long you have been dancing swing dances.')

    this.pass = this.get('Pass type')
    this.pass_track = this.get('Full pass track')
    this.pass_role = this.get('Role')
    this.pass_partner = this.get('Partner name and email')

    this.extrapass = this.get('Extra track?')
    this.extrapass_role = this.get('Extra track - Role')
    this.extrapass_partner = this.get('Extra track - Partner name and email')
    this.has_extrapass = (this.extrapass && (`${this.extrapass}`).toLowerCase() !== 'no thanks')

    this.tshirt = this.get('I want to get a T-shirt')
    this.thsirt_type = this.get('T-shirt type')
    this.thsirt_size = this.get('T-shirt size')
    this.has_tshirt = (`${this.tshirt}`).toLowerCase() !== 'no'

    this.mixnmatch_role = this.get('Role for competition')
    this.has_mixnmatch = this.get('I want to take part in Mix & Match competition')
    this.has_volunteer = this.get('I would like to volunteer')

    this.score = this.get('score')
    this.score_settled = this.get('score_settled')
    this.score_open = this.get('score_open')

    this.confirmation_sent = this.get('Confirmation date')
    this.receipt_sent = this.get('Receipt date')
    this.is_receipt_sent = new Date(this.receipt_sent) > 0
  }
}
