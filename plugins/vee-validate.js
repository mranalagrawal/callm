import Vue from 'vue'
import { extend, setInteractionMode, ValidationObserver, ValidationProvider } from 'vee-validate'
import { confirmed, email, is, is_not, max, min, oneOf, regex, required } from 'vee-validate/dist/rules'
import { regexRules } from '~/utilities/validators'

/* We are using V3 for now, later we can move to V4 when nuxt 3 is ready
* https://vee-validate.logaretm.com/v3/ */

setInteractionMode('eager')

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
