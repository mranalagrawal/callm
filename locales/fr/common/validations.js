import validation from 'vee-validate/dist/locale/fr.json'

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
      effectiveness: 'Efficacité du mot de passe',
      min: 'au moins 8 caractères',
      oneLowerCase: 'une lettre minuscule',
      oneNumber: 'un nombre',
      oneSpecialChar: 'un caractère spécial',
      oneUpperCase: 'une lettre majuscule',
      title: 'Le mot de passe doit contenir:',
    },
    fields: {
      'checkout_billing_address_address1': 'Adresse et numéro de maison',
      'checkout_billing_address_city': 'Ville',
      'checkout_billing_address_company': 'Entreprise (facultatif)',
      'checkout_billing_address_country': 'Pays',
      'checkout_billing_address_first_name': 'Prénom',
      'checkout_billing_address_invoice_type': 'Type de facture',
      'checkout_billing_address_last_name': 'Nom de famille',
      'checkout_billing_address_province': 'Province',
      'checkout_billing_address_zip': 'Code postal',
      'checkout_invoice_company_name': 'Nom de l\'entreprise',
      'checkout_invoice_company_pec': 'PEC',
      'checkout_invoice_company_vat': 'TVA',
      'checkout_invoice_private_taxcode': 'Code fiscal',
      'contact-first-name': 'Nom',
      'contact-last-name': 'Nom de famille',
      'contact-user-email': 'Email',
      'customer-edit-email': 'E-mail',
      'customer-edit-firstname': 'Prénom',
      'customer-edit-lastname': 'Nom de famille',
      'customer-edit-password': 'Mot de passe',
      'customer-edit-phone': 'Téléphone',
      'message': 'Message',
      'new-password': 'Mot de passed',
      'newsletter-checkbox': 'newsletter',
      'notify-me-user-email': 'E-mail',
      'privacy': 'privacy',
      'register-user-email': 'E-E-mail',
      'register-user-firstname': 'Prénom',
      'register-user-lastname': 'Nom de famille',
      'user-email': 'E-mail',
      'user-email-navbar': 'E-mail',
      'user-email-newsletter': 'Email',
      'user-password': 'Mot de passe',
      'user-password-navbar': 'Mot de passe',
    },
  },
}