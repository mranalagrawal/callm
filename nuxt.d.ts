import 'vue'

declare module "vue/types/vue" {
  // this.$gtm inside Vue components
  interface Vue {
    $gtm: {
      push(event: {event?: string, [p: string]: any}): void
    };
  }
}

declare module '@nuxt/types' {
  // nuxtContext.app.$gtm inside asyncData, fetch, plugins, middleware, nuxtServerInit
  interface Context {
    $gtm: {
      push(event: {event?: string, [p: string]: any}): void
    };
  }
}

declare module 'vuex/types/index' {
  // this.$gtm inside Vuex stores
// eslint-disable-next-line @typescript-eslint/no-unused-vars,unused-imports/no-unused-vars
  interface Store<S> {
    $gtm: {
      push(event: {event?: string, [p: string]: any}): void
    };
  }
}
