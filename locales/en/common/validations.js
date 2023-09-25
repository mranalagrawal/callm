import validation from 'vee-validate/dist/locale/en.json'

export default {
  validations: {
    code: validation.code,
    messages: {
      ...validation.messages,
      oneLowerCase: 'ein Kleinbuchstabe',
      oneNumber: 'eine Zahl',
      oneSpecialChar: 'ein besonderer Charakter',
      oneUpperCase: 'ein Großbuchstabe',
    },
    password: {
      effectiveness: 'Password Effectiveness',
      min: 'at least 8 characters',
      oneLowerCase: 'one lowercase letter',
      oneNumber: 'one number',
      oneSpecialChar: 'one special character',
      oneUpperCase: 'one uppercase letter',
      title: 'Password must contain:',
    },
    fields: {
      'checkout_billing_address_address1': 'Address and house number',
      'checkout_billing_address_city': 'City',
      'checkout_billing_address_company': 'Company (optional)',
      'checkout_billing_address_country': 'Country',
      'checkout_billing_address_first_name': 'Name',
      'checkout_billing_address_invoice_type': 'Invoice type',
      'checkout_billing_address_last_name': 'Lastname',
      'checkout_billing_address_province': 'Province',
      'checkout_billing_address_zip': 'Zip code',
      'checkout_invoice_company_name': 'Company Name',
      'checkout_invoice_company_pec': 'PEC',
      'checkout_invoice_company_vat': 'VAT',
      'checkout_invoice_private_taxcode': 'Tax code',
      'contact-first-name': 'Name',
      'contact-last-name': 'Lastname',
      'contact-user-email': 'Email',
      'customer-edit-email': 'Email',
      'customer-edit-firstname': 'First name',
      'customer-edit-lastname': 'Last name',
      'customer-edit-password': 'Password',
      'customer-edit-phone': 'Telephone',
      'message': 'Message',
      'new-password': 'Password',
      'newsletter-checkbox': 'newsletter',
      'notify-me-user-email': 'Email',
      'privacy': 'privacy',
      'register-user-email': 'E-mail',
      'register-user-firstname': 'Name',
      'register-user-lastname': 'Lastname',
      'user-email': 'Email',
      'user-email-navbar': 'Email',
      'user-email-newsletter': 'Email',
      'user-password': 'Password',
      'user-password-navbar': 'Password',
    },
  },
}
