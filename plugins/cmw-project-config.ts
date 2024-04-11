import type { Plugin } from '@nuxt/types'

import { prismicConfig } from '~/config/prismicConfig'
import ThemeConfig from '~/config/themeConfig'
import type { IStoreConfig, TStores } from '~/config/themeConfig'
import type { IPrismicConfig } from '~/types/prismic'

// Todo: add proper types :)
/* Note:
*    maybe we can organize this better... interface ICmwStore {
*   is: {
*     B2b: boolean
*     De: boolean
*     Fr: boolean
*     It: boolean
*     Uk: boolean
*   }
*   env: {
*    prod: boolean
*    stage: boolean
*    dev: boolean
*    }
*   prismic: IPrismicConfig
*   global: IStoreConfig
*/

/**
 * ICmwStore interface represents the configuration settings for the current store.
 * It includes information about the store's type and its Prismic settings.
 */
export interface ICmwStore {
  /**
   * Indicates if the current store is a B2B store.
   * @type boolean
   */
  isB2b: boolean

  /**
   * Indicates if the current store is a German store.
   * @type boolean
   */
  isDe: boolean

  /**
   * Indicates if the current store is a French store.
   * @type boolean
   */
  isFr: boolean

  /**
   * Indicates if the current store is an Italian store.
   * @type boolean
   */
  isIt: boolean

  /**
   * Indicates if the current environment is production.
   * @type boolean
   */
  isProd: boolean

  /**
   * Indicates if the current store is a UK store.
   * @type boolean
   */
  isUk: boolean

  /**
   * The Prismic settings for the current store.
   * @type IPrismicConfig
   */
  prismicSettings: IPrismicConfig

  /**
   * The configuration settings for the current store.
   * @type IStoreConfig
   */
  settings: IStoreConfig
}

declare module 'vue/types/vue' {
  // this.$cmwStore inside Vue components
  interface Vue {
    $cmwStore: ICmwStore
  }
}

declare module '@nuxt/types' {
  // nuxtContext.app.$cmwStore inside asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $cmwStore: ICmwStore
  }
  // nuxtContext.$cmwStore
  interface Context {
    $cmwStore: ICmwStore
  }
}

declare module 'vuex/types/index' {
  // this.$cmwStore inside Vuex stores
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,unused-imports/no-unused-vars
  interface Store<S> {
    $cmwStore: ICmwStore
  }
}

const cmwProjectConfig: Plugin = ({ $config }, inject) => {
  // When ThemeConfig turns into an array use something like this `<IStoreConfig>ThemeConfig.find(i => i.store === $config.STORE)`
  const settings: IStoreConfig = <IStoreConfig>ThemeConfig[$config.STORE as TStores]
  const prismicSettings: IPrismicConfig = prismicConfig.find(i => i.store === $config.STORE) as IPrismicConfig

  // Note: Shall we rename this to $cmwConfig?
  const $cmwStore: ICmwStore = {
    isB2b: settings?.store === 'B2B',
    isDe: settings?.store === 'CMW_DE',
    isFr: settings?.store === 'CMW_FR',
    isIt: settings?.store === 'CMW',
    isProd: $config.DEPLOY_ENV === 'prod',
    isUk: settings?.store === 'CMW_UK',
    prismicSettings,
    settings,
  }

  inject('cmwStore', $cmwStore)
}

export default cmwProjectConfig
