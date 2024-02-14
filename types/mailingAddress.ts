export interface IMailingAddress {
  address1: string
  address2: string
  city: string
  company: string
  country: string
  countryCodeV2: string
  firstName: string
  formatted: string
  formattedArea: string
  id: string
  lastName: string
  latitude: string
  longitude: string
  name: string
  phone: string
  province: string
  provinceCode: string
  zip: string
}

export interface IBillingAddress {
  address1: string
  address2: string | null
  city: string
  company: string
  company_name: string
  country: string
  countryCodeV2: string
  first_name: string // Why? Why? Why? Why not keep the same structure? firstName 🫣
  formatted: string
  formattedArea: string
  id: string
  invoice: boolean
  invoice_type: 'Privato' | 'Azienda' | 'Associazione'
  last_name: string // Why? Why? Why? Why not keep the same structure? lastName 🫣
  latitude: string
  longitude: string
  name: string
  pec_sdi?: string
  phone: string
  province: string
  provinceCode: string
  tax_code: string
  vat?: string
  zip: string
}
