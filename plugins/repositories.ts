import type { Plugin } from '@nuxt/types'
import createRepository from '~/repositories'

declare module 'vue/types/vue' {
  // this.$cmw inside Vue components
  interface Vue {
    $cmwRepo: any
  }
}

declare module '@nuxt/types' {
  // nuxtContext.app.$cmw inside asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $cmwRepo: any
  }
  // nuxtContext.$cmw
  interface Context {
    $cmwRepo: any
  }
}

declare module 'vuex/types/index' {
  // this.$cmw inside Vuex stores
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,unused-imports/no-unused-vars
  interface Store<S> {
    $cmwRepo: any
  }
}

const cmw: Plugin = (ctx, inject) => {
  inject('cmwRepo', createRepository(ctx))
}

export default cmw
