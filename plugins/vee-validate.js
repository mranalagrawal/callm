import Vue from 'vue'
import { ValidationObserver, ValidationProvider, configure, extend, localize, setInteractionMode } from 'vee-validate'
import { confirmed, email, is, is_not, max, min, oneOf, regex, required } from 'vee-validate/dist/rules'
import de from 'vee-validate/dist/locale/de.json'
import en from 'vee-validate/dist/locale/en.json'
import fr from 'vee-validate/dist/locale/fr.json'
import it from 'vee-validate/dist/locale/it.json'
import { regexRules } from '~/utilities/validators'

/* We are using V3 for now, later we can move to V4 when nuxt 3 is ready
* https://vee-validate.logaretm.com/v3/ */

setInteractionMode('eager')

export const lookUpLocale = k => ({
  de,
  en,
  fr,
  it,
})[k]

localize({
  en: {
    names: {
      'user-email': 'Email',
      'user-password': 'Password',
      'user-email-navbar': 'Email',
      'user-password-navbar': 'Password',
      'register-user-firstname': 'Name',
      'register-user-lastname': 'Lastname',
      'register-user-email': 'E-mail',
      'new-password': 'Password',
      'customer-edit-email': 'Email',
      'customer-edit-password': 'Password',
      'customer-edit-firstname': 'First name',
      'customer-edit-lastname': 'Last name',
      'customer-edit-phone': 'Telephone',
      'message': 'Message',
    },
    fields: {
      'new-password': {
        oneNumber: 'a number',
        oneUpperCase: 'an uppercase letter',
        oneLowerCase: 'a lowercase letter',
        oneSpecialChar: 'a special character',
      },
      'message': {
        min: 'the {_field_} must have at least {length} character',
      },
    },
  },
  it: {
    names: {
      'user-email': 'Email',
      'user-password': 'Password',
      'user-email-navbar': 'Email',
      'user-password-navbar': 'Password',
      'register-user-firstname': 'Nome',
      'register-user-lastname': 'Cognome',
      'register-user-email': 'E-mail',
      'new-password': 'Password',
      'customer-edit-email': 'Email',
      'customer-edit-password': 'Password',
      'customer-edit-firstname': 'Nome',
      'customer-edit-lastname': 'Cognome',
      'customer-edit-phone': 'Telefono',
      'message': 'Messaggio',
    },
    fields: {
      'new-password': {
        oneNumber: 'un numero',
        oneUpperCase: 'una lettera maiuscola',
        oneLowerCase: 'una lettera minuscola',
        oneSpecialChar: 'un carattere speciale',
      },
      'message': {
        min: 'il {_field_} deve avere almeno {length} carattere',
      },
    },
  },
  fr: {
    names: {
      'user-email': 'E-mail',
      'user-password': 'Mot de passe',
      'user-email-navbar': 'E-mail',
      'user-password-navbar': 'Mot de passe',
      'register-user-firstname': 'Nom',
      'register-user-lastname': 'Nom de famille',
      'register-user-email': 'E-E-mail',
      'new-password': 'Mot de passed',
      'customer-edit-email': 'E-mail',
      'customer-edit-password': 'Mot de passe',
      'customer-edit-firstname': 'Prénom',
      'customer-edit-lastname': 'Nom',
      'customer-edit-phone': 'Téléphone',
      'message': 'Message',
    },
    fields: {
      'new-password': {
        oneNumber: 'un numéro',
        oneUpperCase: 'une lettre majuscule',
        oneLowerCase: 'une lettre minuscule',
        oneSpecialChar: 'un caractère spécial',
      },
      'message': {
        min: 'le {_field_} doit avoir au moins {length} caractère',
      },
    },
  },
  de: {
    names: {
      'user-email': 'Email',
      'user-password': 'Passwort',
      'user-email-navbar': 'Email',
      'user-password-navbar': 'Passwort',
      'register-user-firstname': 'Name',
      'register-user-lastname': 'Familienname, Nachname',
      'register-user-email': 'EEmail',
      'new-password': 'Passwortd',
      'customer-edit-email': 'Email',
      'customer-edit-password': 'Passwort',
      'customer-edit-firstname': 'Vorname',
      'customer-edit-lastname': 'Familienname, Nachname',
      'customer-edit-phone': 'Telefon',
      'message': 'Nachricht',
    },
    fields: {
      'new-password': {
        oneNumber: 'eine Zahl',
        oneUpperCase: 'ein Großbuchstabe',
        oneLowerCase: 'ein Kleinbuchstabe',
        oneSpecialChar: 'ein besonderer Charakter',
      },
      'message': {
        min: 'das {_field_} muss mindestens {length} Zeichen haben',
      },
    },
  },
})

configure({
  classes: {
    valid: 'is-valid',
    invalid: 'is-invalid',
  },
})

extend('required', required)
extend('email', email)
extend('min', min)
extend('max', max)
extend('regex', regex)
extend('confirmed', confirmed)
extend('is', is)
extend('is_not', is_not)
extend('oneOf', oneOf)

extend('oneNumber', {
  validate: val => new RegExp(regexRules('oneNumber')).test(val),
})

extend('oneUpperCase', {
  validate: val => new RegExp(regexRules('oneUpperCase')).test(val),
})

extend('oneLowerCase', {
  validate: val => new RegExp(regexRules('oneLowerCase')).test(val),
})

extend('oneSpecialChar', {
  validate: val => new RegExp(regexRules('oneSpecialChar')).test(val),
})

Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)
