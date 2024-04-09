import type { NuxtHTTPInstance } from '@nuxt/http'
import type { Plugin } from '@nuxt/types'

import type { TSalesChannel, TStores } from '~/config/themeConfig'
import { SweetAlertToast } from '~/utilities/Swal'
import themeConfig from '~/config/themeConfig'

interface ICallLogParams {
  msg: any
  context?:
  | 'error'
  | 'info'
  | 'log'
  | 'table'
  | 'warn'
}

declare module 'vue/types/vue' {
  // this.$cmw inside Vue components
  interface Vue {
    $cmw: NuxtHTTPInstance
    $elastic: NuxtHTTPInstance
    $handleApiErrors(err: string): void
    $callLog({ msg, context }: ICallLogParams): void
  }
}

declare module '@nuxt/types' {
  // nuxtContext.app.$cmw inside asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $cmw: NuxtHTTPInstance
    $elastic: NuxtHTTPInstance
    $handleApiErrors(err: string): void
  }
  // nuxtContext.$cmw
  interface Context {
    $elastic: NuxtHTTPInstance
    $cmw: NuxtHTTPInstance
    $handleApiErrors(err: string): void
    $callLog({ msg, context }: ICallLogParams): void
  }
}

declare module 'vuex/types/index' {
  // this.$cmw inside Vuex stores
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,unused-imports/no-unused-vars
  interface Store<S> {
    $cmw: NuxtHTTPInstance
    $elastic: NuxtHTTPInstance
    $handleApiErrors(err: string): void
    $callLog({ msg, context }: ICallLogParams): void
  }
}

const cmwApi: Plugin = ({ $http, i18n, $config, $sentry }, inject) => {
  // See https://github.com/sindresorhus/ky#options
  const $cmw = $http.create({})
  const $elastic = $http.create({})
  const $callLog = ({ msg, context = 'log' }: ICallLogParams) => {
    if ($config.DEPLOY_ENV !== 'prod') {
      // eslint-disable-next-line no-console
      console[context](msg)
    }
  }

  const store: TStores = $config.STORE || 'CMW_UK'
  const sale_channel: TSalesChannel = themeConfig[store]?.salesChannel || 'cmw_uk_b2c'

  $cmw.setBaseURL($config.CMW_API)
  $cmw.setHeader('x-api-key', $config.CMW_API_KEY)
  $cmw.setHeader('X-Cmw-Store', $config.STORE)
  $cmw.setHeader('X-Cmw-Sales-Channel', sale_channel)
  $cmw.setHeader('X-Cmw-Locale', i18n.locale)
  $cmw.setHeader('Accept', 'application/json')
  $cmw.setHeader('Content-Type', 'application/json')
  $cmw.onError((err) => {
    $sentry.captureException(new Error(`$cmw catch ${err}`))
  })

  $elastic.setBaseURL($config.ELASTIC_URL)
  $elastic.setHeader('X-Cmw-Store', $config.STORE)
  $elastic.setHeader('X-Cmw-Sales-Channel', sale_channel)
  $elastic.setHeader('X-Cmw-Locale', i18n.locale)
  $elastic.setHeader('Accept', 'application/json')
  $elastic.setHeader('Content-Type', 'application/json')
  $elastic.onError((err) => {
    $sentry.captureException(new Error(`$elastic catch ${err}`))
  })

  inject('cmw', $cmw)
  inject('elastic', $elastic)
  inject('callLog', $callLog)

  inject('handleApiErrors', (err: string) => {
    $callLog({ msg: err, context: 'warn' })
    SweetAlertToast.fire({
      icon: 'error',
      text: i18n.t('common.feedback.KO.unknown'),
    })
    $sentry.captureException(new Error(err))
  })
}

export default cmwApi
