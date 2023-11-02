import type { Plugin } from '@nuxt/types'

interface ICookieHelpers {
  getToken(): string
  setToken(token: string, expires?: Date): void
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
    setToken: (token: string, expiresAt: Date) => {
      const expires = new Date(expiresAt)
      const currentDate = new Date()
      const maxAge = Math.floor((+expires - +currentDate) / 1000)

      app.$cookies.set(name, token, {
        path: '/',
        maxAge,
        sameSite: 'none',
        secure: true,
        expires,
      })
    },
    onLogout: () => app.$cookies.remove(name),
  }

  inject('cookieHelpers', $cookieHelpers)
}

export default cookies
