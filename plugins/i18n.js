import { configure, localeChanged, localize } from 'vee-validate'

export default function ({ app }) {
  console.log('export default function: ')
  configure({
    defaultMessage: (field, values) => {
      values._field_ = app.i18n.t(`validations.fields.${field}`)
      return app.i18n.t(`validations.messages.${values._rule_}`, values)
    },
    classes: {
      valid: 'is-valid raw',
      invalid: 'is-invalid raw',
      dirty: ['is-dirty raw', 'is-dirty'], // multiple classes per flag!
    },
  })

  app.i18n.onLanguageSwitched = (_, newLocale) => {
    console.log('onLanguageSwitched: ', newLocale)
    localize(newLocale)
    localeChanged()
  }
}
