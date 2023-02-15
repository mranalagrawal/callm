<script>
import { storeToRefs } from 'pinia'
import { nextTick, onMounted, onUnmounted, ref } from '@nuxtjs/composition-api'
import debounce from 'lodash.debounce'
import { useCustomer } from '~/store/customer'

export default {
  layout(context) {
    return context.$config.STORE
  },
  middleware: ['auth', 'splash'],
  profileNavigation: [
    {
      to: '/profile/my-orders',
      label: 'navbar.user.myOrders',
    },
    {
      to: '/profile/buy-again',
      label: 'navbar.user.buyAgain',
    },
    {
      to: '/profile/wishlist',
      label: 'navbar.user.favorites',
    },
    {
      to: '/profile/addresses',
      label: 'navbar.user.addresses',
    },
    {
      to: '/profile/access-data',
      label: 'navbar.user.accessData',
    },
  ],
  setup() {
    const customerStore = useCustomer()
    const { customer } = storeToRefs(customerStore)
    const { logout } = customerStore

    const isDesktop = ref(false)
    const resizeListener = debounce(() => {
      isDesktop.value = window.innerWidth > 991
    }, 400)

    onMounted(() => {
      // Todo: Move this to a global composable when we implement VueUse
      window.addEventListener('resize', resizeListener)
      nextTick(() => {
        resizeListener()
      })
    })

    onUnmounted(() => {
      window.removeEventListener('resize', resizeListener)
    })

    return { isDesktop, customer, logout }
  },
}
</script>

<template>
  <div class="cmw-max-w-screen-xl cmw-mx-auto cmw-py-4">
    <nav class="cmw-flex cmw-items-center cmw-gap-2 cmw-text-sm cmw-pt-1.875rem cmw-mt-2 cmw-mb-6 cmw-px-4">
      <NuxtLink
        class="cmw-text-primary-400"
        :to="localePath('/')"
      >
        {{ $t('home') }}
      </NuxtLink>
      <VueSvgIcon
        :data="require(`@/assets/svg/chevron-right.svg`)"
        width="12"
        height="12"
      />
      <span class="cmw-text-gray-dark">{{ $t("profile.myAccount") }}</span>
    </nav>
    <div class="cmw-flex cmw-justify-between cmw-px-4">
      <h1 v-text="$t('profile.greeting', { name: customer && customer.firstName })" />
      <button
        class="group cmw-flex cmw-items-center cmw-gap-2 cmw-text-primary-400 cmw-uppercase"
        @click="logout"
      >
        <span>{{ $t("profile.logout") }}</span>
        <VueSvgIcon
          class="group-hover:cmw-animate-bounce-right"
          :data="require(`@/assets/svg/arrow-right.svg`)"
          width="24"
          height="24"
        />
      </button>
    </div>
    <div class="cmw-bg-white/50 cmw-backdrop-filter cmw-backdrop-blur cmw-sticky cmw-z-content cmw-top-$cmw-header-height cmw-pb-1 cmw-pt-4 cmw-pl-4 md:cmw-px-4">
      <nav
        class="
        c-navigationTab cmw-font-sans cmw-justify-between cmw-w-full cmw-flex cmw-no-wrap cmw-overflow-x-auto
        cmw-border-b cmw-border-b-gray-dark cmw-mb-3 md:(cmw-mt-9 cmw-max-w-10/12)
"
      >
        <NuxtLink
          v-for="({ to, label }) in $options.profileNavigation"
          :key="to"
          :to="localePath(to)"
          class="cmw-relative cmw-py-2 cmw-flex-shrink-0 cmw-font-light cmw-text-sm
                hover:(cmw-no-underline)
                hover:after:(cmw-bg-primary cmw-text-primary cmw-w-full)
                after:(cmw-content-DEFAULT cmw-transform cmw-absolute cmw-bottom-0 cmw-left-1/2 cmw-h-1 cmw-transition-progress-bar cmw-translate-x-[-50%])"
          :class="$route.path.includes(to) ? 'after:(cmw-bg-primary cmw-text-primary cmw-w-full)' : 'after:(cmw-w-0 cmw-bg-primary-400)'"
        >
          <span
            class="cmw-w-max cmw-px-4 hover:cmw-text-primary"
            :class="$route.path.includes(to) ? 'cmw-text-primary' : 'cmw-text-gray-dark'"
          >{{ $t(label) }}</span>
        </NuxtLink>
      </nav>
    </div>
    <NuxtChild :is-desktop="isDesktop" />
  </div>
</template>

<style scoped>
.c-navigationTab::-webkit-scrollbar {
  height: 0;
}

.c-navigationTab::-webkit-scrollbar-track {
  background-color: transparent;
}

.c-navigationTab::-webkit-scrollbar-thumb {
  background-color: transparent;
}
</style>
