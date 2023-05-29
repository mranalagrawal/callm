import type { Plugin } from '@nuxt/types'

interface ICookieHelpers {
  getToken(): string
  setToken(token: string): void
  onLogout(pageType: string, data?: Record<string, any>): void
}
declare module 'vue/types/vue' {
  interface Vue {
    $cookieHelpers: ICookieHelpers
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $cookieHelpers: ICookieHelpers
  }
  // nuxtContext.$cmw
  interface Context {
    $cookieHelpers: ICookieHelpers
  }
}

declare module 'vuex/types/index' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,unused-imports/no-unused-vars
  interface Store<S> {
    $cookieHelpers: ICookieHelpers
  }
}

const cookies: Plugin = ({ app }, inject) => {
  const name = '__session'

  const $cookieHelpers: ICookieHelpers = {
    getToken: () => app.$cookies.get(name),
    setToken: (token: string) => app.$cookies.set(name, token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      // expires // Note: we could use customerAccessToken.expiresAt return by Shopify,
    }),
    onLogout: () => app.$cookies.remove(name),
  }

  inject('cookieHelpers', $cookieHelpers)
}

export default cookies
