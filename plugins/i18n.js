import { localeChanged, localize } from 'vee-validate'
import { lookUpLocale } from '~/plugins/vee-validate'

export default function ({ app }) {
  app.i18n.onLanguageSwitched = (_, newLocale) => {
    localize(newLocale, lookUpLocale(newLocale))
    localeChanged()
  }
}
