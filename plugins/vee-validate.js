import Vue from "vue";
import { ValidationObserver, ValidationProvider, extend, localize, configure, setInteractionMode } from 'vee-validate'
import { required, email, min, max, regex, confirmed, is, is_not, oneOf } from 'vee-validate/dist/rules'
import it from 'vee-validate/dist/locale/it.json'
import en from 'vee-validate/dist/locale/en.json'

/* We are using V3 for now, later we can move to V4 when nuxt 3 is ready
* https://vee-validate.logaretm.com/v3/ */

setInteractionMode('eager')

localize({
  it,
  en
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

Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)


