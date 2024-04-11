<script lang="ts">
import { defineComponent, inject, ref, useRoute, watch } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'

import { useCart } from '~/store/cart'
import { useCustomer } from '~/store/customer'

import cartIcon from '~/assets/svg/cart.svg'
import chevronLeftIcon from '~/assets/svg/chevron-left.svg'
import closeIcon from '~/assets/svg/close.svg'
import logoB2b from '~/assets/svg/logo-call-me-wine-b2b.svg'
import logo from '~/assets/svg/logo-call-me-wine.svg'
import menuIcon from '~/assets/svg/menu.svg'
import userIcon from '~/assets/svg/user.svg'

import CustomerWishlist from '~/components/Header/CustomerWishlist.vue'
import UserActions from '~/components/Header/UserActions.vue'

export default defineComponent({
  components: { CustomerWishlist, UserActions },
  setup() {
    const { customer } = storeToRefs(useCustomer())
    const { cartTotalQuantity } = storeToRefs(useCart())
    const route = useRoute()
    const isDesktop = inject('isDesktop')
    const isMobile = inject('isMobile')
    const navbar = ref(null)
    const menuBarRef = ref<HTMLDivElement | null>(null)
    const showMobileButton = ref(true)
    const isMobileMenuOpen = ref(false)
    const isSidebarOpen = ref(false)
    const sideBarTop = ref('')

    const handleShowMobileButton = (val: boolean) => {
      showMobileButton.value = val
    }

    const lockBody = () => {
      if (process.browser && document.body) { document.body.classList.toggle('lock-scroll', isMobileMenuOpen.value) }
    }

    const toggleSidebar = () => {
      sideBarTop.value = `${menuBarRef.value?.getBoundingClientRect().bottom}px`
      isMobileMenuOpen.value = isSidebarOpen.value = !isSidebarOpen.value
      lockBody()
    }

    watch(() => route.value, () => {
      isSidebarOpen.value = false
      isMobileMenuOpen.value = false
      showMobileButton.value = true
      lockBody()
    }, { deep: true })

    return {
      cartIcon,
      cartTotalQuantity,
      chevronLeftIcon,
      closeIcon,
      customer,
      handleShowMobileButton,
      isDesktop,
      isMobile,
      isMobileMenuOpen,
      isSidebarOpen,
      logo,
      logoB2b,
      menuBarRef,
      menuIcon,
      navbar,
      showMobileButton,
      sideBarTop,
      toggleSidebar,
      userIcon,
    }
  },
})
</script>

<template>
  <div
    ref="navbar"
    class="fixed w-screen min-h-[135px] px-4 pb-2 top-0 bg-white z-tooltip print:hidden md:pb-0"
  >
    <div
      class="
    max-w-screen-xl mx-auto grid grid-cols-1 gap-0 min-h-100px items-center
    lg:(grid-cols-[25%_40%_35%] gap-3 pt-4) 2xl:grid-cols-[25%_48%_32%]"
    >
      <div
        ref="menuBarRef"
        class="bg-white"
      >
        <div class="flex gap-2 items-center">
          <button
            v-show="showMobileButton"
            class="relative z-base md:hidden"
            :aria-label="isMobileMenuOpen ? $t('enums.accessibility.role.MENU.CLOSE') : $t('enums.accessibility.role.MENU.OPEN')"
            @click="toggleSidebar"
          >
            <VueSvgIcon
              :data="isMobileMenuOpen ? closeIcon : menuIcon"
              width="32"
              height="32"
            />
          </button>

          <NuxtLink
            class="flex max-w-120px md:max-w-250px"
            :aria-label="$t('enums.accessibility.labels.GO_TO_HOME_PAGE')"
            :to="localePath('/')"
          >
            <VueSvgIcon
              :data="$config.STORE === 'B2B' ? logoB2b : logo"
              width="100%"
              height="auto"
              original
            />
          </NuxtLink>

          <div class="flex items-center ml-auto lg:hidden">
            <ClientOnly>
              <CustomerWishlist v-if="isMobile && customer.id" />
              <NuxtLink :to="localePath(customer.id ? '/profile/my-orders' : '/login')">
                <VueSvgIcon
                  :data="userIcon"
                  :width="28"
                  :height="28"
                />
              </NuxtLink>
              <NuxtLink
                :to="localePath('/cart')"
                :aria-label="$t('enums.accessibility.labels.GO_TO_CART_PAGE')"
                class="relative p-2 md:p-3"
              >
                <VueSvgIcon
                  :data="cartIcon"
                  :width="28"
                  :height="28"
                />
                <span class="totalItems">{{ cartTotalQuantity }} </span>
              </NuxtLink>
            </ClientOnly>
          </div>
        </div>
      </div>

      <SearchBar />

      <ClientOnly>
        <div v-if="isDesktop" class="md:(place-self-end self-center)">
          <UserActions />
        </div>
      </ClientOnly>
    </div>
    <div class="c-megaMenu fixed left-0 w-full bg-white <md:hidden">
      <div class="shadow-menu">
        <MegaMenu />
      </div>
    </div>

    <div v-if="isMobile" class="">
      <transition name="menu-mobile">
        <div v-show="isSidebarOpen" class="absolute left-0 w-full z-base" :style="{ top: sideBarTop }">
          <MenuMobile />
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.totalItems {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #d94965;
  color: white;
  position: absolute;
  top: 8px;
  right: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
}

@media screen and (max-width: 768px) {
  .totalItems {
    top: 2px;
    right: 0;
  }
}

.shadow-menu {
  box-shadow: 0 0.3rem 0.35rem rgb(0 0 0 / 15%) !important;
}
</style>
