import Vue from "vue";
import { ValidationObserver, ValidationProvider, extend, localize, configure, setInteractionMode } from 'vee-validate'
import { required, email, min, max, regex, confirmed, is, is_not, oneOf } from 'vee-validate/dist/rules'
import de from 'vee-validate/dist/locale/de.json'
import en from 'vee-validate/dist/locale/en.json'
import fr from 'vee-validate/dist/locale/fr.json'
import it from 'vee-validate/dist/locale/it.json'
import {regexRules} from "~/utilities/validators";

/* We are using V3 for now, later we can move to V4 when nuxt 3 is ready
* https://vee-validate.logaretm.com/v3/ */

setInteractionMode('eager')

export const lookUpLocale = (k) => ({
  de: de,
  en: en,
  fr: fr,
  it: it,
})[k];

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
      'new-password': 'Password'
    },
    fields: {
      'new-password': {
        oneNumber: 'a number',
        oneUpperCase: 'an uppercase letter',
        oneLowerCase: 'a lowercase letter',
        oneSpecialChar: 'a special character',
      },
    }
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
      'new-password': 'Password'
    },
    fields: {
      'new-password': {
        oneNumber: 'un numero',
        oneUpperCase: 'una lettera maiuscola',
        oneLowerCase: 'una lettera minuscola',
        oneSpecialChar: 'un carattere speciale',
      },
    }
  }
});

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
  validate: (val) => new RegExp(regexRules('oneNumber')).test(val),
})

extend('oneUpperCase', {
  validate: (val) => new RegExp(regexRules('oneUpperCase')).test(val),
})

extend('oneLowerCase', {
  validate: (val) => new RegExp(regexRules('oneLowerCase')).test(val),
})

extend('oneSpecialChar', {
  validate: (val) => new RegExp(regexRules('oneSpecialChar')).test(val),
})

Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)


