<script lang="ts">
import { storeToRefs } from 'pinia'
import type { Ref } from '@nuxtjs/composition-api'
import { computed, defineComponent, inject, useContext } from '@nuxtjs/composition-api'
import chevronRightIcon from 'assets/svg/chevron-right.svg'
import arrowRightIcon from 'assets/svg/arrow-right.svg'
import { useCustomer } from '~/store/customer'

export default defineComponent({
  middleware: ['auth', 'splash'],
  setup() {
    const { customer } = storeToRefs(useCustomer())
    const { logout } = useCustomer()
    const { i18n, $cmwStore } = useContext()
    const isDesktop = inject('isDesktop') as Ref<boolean>

    const profileNavigation = [
      {
        to: '/profile/my-orders',
        label: i18n.t('navbar.user.myOrders'),
        show: true,
      },
      {
        to: '/profile/buy-again',
        label: i18n.t('navbar.user.buyAgain'),
        show: true,
      },
      {
        to: '/profile/wishlist',
        label: i18n.t('navbar.user.favorites'),
        show: true,
      },
      {
        to: '/profile/addresses',
        label: i18n.t('navbar.user.addresses'),
        show: true,
      },
      {
        to: '/profile/access-data',
        label: i18n.t('navbar.user.accessData'),
        show: true,
      },
      {
        to: '/profile/billing',
        label: i18n.t('navbar.user.billing'),
        show: !$cmwStore.isUk,
      },
    ]

    const filteredNavigation = computed(() => profileNavigation.filter(nav => nav.show))
    return {
      arrowRightIcon,
      chevronRightIcon,
      customer,
      filteredNavigation,
      isDesktop,
      logout,
      profileNavigation,
    }
  },
})
</script>

<template>
  <div class="max-w-screen-xl mx-auto pb-4">
    <nav class="print:hidden flex items-center gap-2 text-sm pt-1.875rem mt-2 mb-6 px-4">
      <NuxtLink
        class="text-primary-400"
        :to="localePath('/')"
      >
        {{ $t('home') }}
      </NuxtLink>
      <VueSvgIcon
        :data="chevronRightIcon"
        width="12"
        height="12"
      />
      <span class="text-gray-dark">{{ $t("profile.myAccount") }}</span>
    </nav>
    <div class="print:hidden flex justify-between px-4">
      <h1 v-text="$t('profile.greeting', { name: customer && customer.firstName })" />
      <button
        class="group flex items-center gap-2 text-primary-400 uppercase"
        @click="logout"
      >
        <span>{{ $t("profile.logout") }}</span>
        <VueSvgIcon
          class="group-hover:animate-bounce-right"
          :data="arrowRightIcon"
          width="24"
          height="24"
        />
      </button>
    </div>
    <div class="print:hidden bg-white/50 backdrop-filter backdrop-blur sticky z-content top-$cmw-header-height pb-1 pt-4 pl-4 md:px-4">
      <nav
        class="
        c-navigationTab font-sans justify-between w-full flex no-wrap overflow-x-auto
        border-b border-b-gray-dark mb-3 md:(mt-9 max-w-10/12)
"
      >
        <!-- Note: exact-active-class is not recognizing pseudo after -->
        <NuxtLink
          v-for="({ to, label }) in filteredNavigation"
          :key="to"
          :to="localePath(to)"
          exact-active-class="maybeACustomClass"
          class="relative py-2 flex-shrink-0 cmw-font-light text-sm
                hover:after:(bg-primary text-primary w-full)
                after:(content-DEFAULT transform absolute bottom-0 left-1/2 h-1 transition-progress-bar -translate-x-1/2)"
          :class="$route.path.includes(to) ? 'after:(bg-primary text-primary w-full)' : 'after:(w-0 bg-primary-400)'"
        >
          <span
            class="w-max px-4 hover:text-primary"
            :class="$route.path.includes(to) ? 'text-primary' : 'text-gray-dark'"
            v-text="label"
          />
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
