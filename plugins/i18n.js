import { configure, localeChanged, localize } from 'vee-validate'
import { useVercelKv } from '~/store/vercelKv'

export default function ({ app }) {
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

  app.i18n.onLanguageSwitched = async (_, newLocale) => {
    const { loadMenu } = useVercelKv()
    const prismicLocale = app.$cmwStore.prismicSettings.isoCode[newLocale]

    localize(newLocale)
    localeChanged()

    await loadMenu(prismicLocale)
    await app.store.dispatch('loadFooter')
    await app.store.dispatch('loadPreFooter')
  }
}
