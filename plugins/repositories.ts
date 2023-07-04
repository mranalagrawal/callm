import type { Plugin } from '@nuxt/types'
import createRepository from '~/repositories'
import type { IPrismicPageData } from '~/types/prismic'

interface ICmwRepo {
  shopifyPages: {
    getPageByHandle({ handle = '' }): Promise<Record<string, any>>
  }
  addresses: any
  countries: any
  customer: any
  orders: any
  prismic: {
    getSingle({ page = '' }): Promise<IPrismicPageData>
  }
  products: any
}

declare module 'vue/types/vue' {
  // this.cmwRepo inside Vue components
  interface Vue {
    $cmwRepo: ICmwRepo
  }
}

declare module '@nuxt/types' {
  // nuxtContext.app.$cmw inside asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $cmwRepo: ICmwRepo
  }
  // nuxtContext.cmwRepo
  interface Context {
    $cmwRepo: ICmwRepo
  }
}

declare module 'vuex/types/index' {
  // this.cmwRepo inside Vuex stores
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,unused-imports/no-unused-vars
  interface Store<S> {
    $cmwRepo: ICmwRepo
  }
}

const cmw: Plugin = (ctx, inject) => {
  inject('cmwRepo', createRepository(ctx))
}

export default cmw
