<script lang="ts">
import { defineComponent, inject, ref, useContext, useFetch, useRoute, useRouter, watch } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'
import type { RawLocation } from 'vue-router'
import { useCustomer } from '~/store/customer'
import { useShopifyCart } from '~/store/shopifyCart'
import chevronLeftIcon from '~/assets/svg/chevron-left.svg'
import logo from '~/assets/svg/logo-call-me-wine.svg'
import logoB2b from '~/assets/svg/logo-call-me-wine-b2b.svg'
import cartIcon from '~/assets/svg/cart.svg'
import closeIcon from '~/assets/svg/close.svg'
import menuIcon from '~/assets/svg/menu.svg'
import userIcon from '~/assets/svg/user.svg'

export default defineComponent({
  setup() {
    const { localeLocation } = useContext()
    const { customer } = storeToRefs(useCustomer())
    const { shopifyCart, cartTotal, cartTotalQuantity } = storeToRefs(useShopifyCart())
    const router = useRouter()
    const route = useRoute()
    const isDesktop = inject('isDesktop')
    const navbar = ref(null)
    const menuBarRef = ref<HTMLDivElement | null>(null)
    const menuData = ref<Record<string, any>[]>([])
    const showMobileButton = ref(true)
    const isMobileMenuOpen = ref(false)
    const isSidebarOpen = ref(false)
    const mobileLogin = ref(false)
    const sideBarTop = ref('')

    const handleShowMobileButton = (val: boolean) => {
      showMobileButton.value = val
    }

    const lockBody = () => {
      if (process.browser && document.body)
        document.body.classList.toggle('lock-scroll', isMobileMenuOpen.value)
    }

    const toggleMobileLogin = () => {
      mobileLogin.value = !mobileLogin.value
    }

    const toggleSidebar = () => {
      sideBarTop.value = `${menuBarRef.value?.getBoundingClientRect().bottom}px`
      isMobileMenuOpen.value = isSidebarOpen.value = !isSidebarOpen.value
      lockBody()
    }

    const handleGoToLogin = () => {
      mobileLogin.value = false
      router.push(localeLocation('/login') as RawLocation)
    }

    useFetch(async ({ $cmwRepo }) => {
      const megaMenu = await $cmwRepo.prismic.getSingle({ page: 'mega-menu-test' })

      menuData.value = megaMenu?.body?.length
        ? megaMenu.body.map((firstLevel) => {
          const secondLevels = firstLevel.items.map((el: { secondlevelname: any; second_level_position: any }) => {
            return {
              name: el.secondlevelname,
              position: el.second_level_position,
            // isSelection: !!el.selection,
            }
          })

          const secondLevelsSet = [
            ...new Set(secondLevels.map((el: any) => JSON.stringify(el))),
          ]
            .map(el => JSON.parse(el as string))
            .sort((a, b) => a.position - b.position)

          const items = secondLevelsSet.map((el) => {
            const temp = firstLevel.items
              .filter((x: { secondlevelname: any }) => x.secondlevelname === el.name)
              .sort((a: { third_level_position: number }, b: { third_level_position: number }) => a.third_level_position - b.third_level_position)
            return { ...el, items: temp }
          })

          return {
            name: firstLevel.primary.group_label,
            link: firstLevel.primary.first_level_link,
            position: firstLevel.primary.first_level_position,
            items,
          }
        })
          .sort((a, b) => a.position - b.position)
        : []
    })

    watch(() => route.value, () => {
      mobileLogin.value = false
      isSidebarOpen.value = false
      isMobileMenuOpen.value = false
      showMobileButton.value = true
      lockBody()
    }, { deep: true })

    return {
      cartIcon,
      cartTotal,
      cartTotalQuantity,
      chevronLeftIcon,
      closeIcon,
      customer,
      handleGoToLogin,
      handleShowMobileButton,
      isDesktop,
      isMobileMenuOpen,
      isSidebarOpen,
      logo,
      logoB2b,
      menuBarRef,
      menuData,
      menuIcon,
      mobileLogin,
      navbar,
      shopifyCart,
      showMobileButton,
      sideBarTop,
      toggleMobileLogin,
      toggleSidebar,
      userIcon,
    }
  },
})
</script>

<template>
  <div
    ref="navbar"
    class="fixed w-screen min-h-[135px] px-4 pb-4 top-0 bg-white z-tooltip print:hidden md:pb-0"
  >
    <div
      class="
    max-w-screen-xl mx-auto grid grid-cols-1 gap-3 min-h-100px items-center pt-4
    lg:grid-cols-[25%_40%_35%] 2xl:grid-cols-[25%_48%_32%]"
    >
      <div
        ref="menuBarRef"
        class="bg-white"
      >
        <div class="flex gap-2 items-center">
          <button
            v-show="showMobileButton"
            class="relative z-base md:hidden"
            @click="toggleSidebar"
          >
            <VueSvgIcon
              :data="isMobileMenuOpen ? closeIcon : menuIcon"
              width="32"
              height="32"
            />
          </button>

          <NuxtLink
            class="flex max-w-150px md:max-w-250px"
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
            <button
              class="p-3"
              @click="toggleMobileLogin"
            >
              <VueSvgIcon
                :data="userIcon"
                width="36"
                height="36"
              />
            </button>
            <NuxtLink
              :to="localePath('/cart')"
              class="relative p-3"
            >
              <VueSvgIcon
                :data="cartIcon"
                width="32px"
                height="32px"
              />
              <span class="totalItems">{{ cartTotalQuantity }} </span>
            </NuxtLink>
          </div>
        </div>
      </div>

      <SearchBar />

      <div v-if="isDesktop" class="md:(place-self-end self-center)">
        <UserActions />
      </div>
    </div>
    <div class="c-megaMenu fixed left-0 w-full bg-white <md:hidden">
      <div class="shadow-menu">
        <MegaMenu />
      </div>
    </div>

    <div v-if="!isDesktop && !!menuData.length" class="">
      <transition name="menu-mobile">
        <div v-show="isSidebarOpen" class="absolute left-0 w-full z-base" :style="{ top: sideBarTop }">
          <MenuMobile :menu="menuData" />
        </div>
      </transition>
    </div>
    <transition name="menu-mobile">
      <div v-if="mobileLogin" class="fixed w-screen top-0 left-0 h-screen bg-white z-amenadiel pt-$cmw-top-banner-height">
        <Button
          variant="text"
          class="gap-2 pl-2 pr-3 py-2 justify-between"
          :aria-label="$t('enums.accessibility.role.MODAL_CLOSE')"
          @click.native="toggleMobileLogin"
        >
          <VueSvgIcon :data="chevronLeftIcon" color="#E6362E" width="30" height="auto" />
          <span class="truncate max-w-100px">{{ customer.firstName ? customer.firstName : "Account" }}</span>
          <VueSvgIcon :data="closeIcon" color="#E6362E" width="30" height="auto" />
        </Button>
        <div v-if="!customer.id">
          <div class="h3 text-center mt-5">
            {{ $t("navbar.user.signIn") }}
          </div>
          <div class="px-2">
            <LoginForm />
          </div>
          <div class="bg-gray-lightest p-2 text-center flex items-center justify-center">
            {{ $t("navbar.user.notRegisteredYet") }}
            <Button
              variant="text"
              class="w-max uppercase text-primary-400"
              @click.native="handleGoToLogin"
            >
              {{ $t("navbar.user.register") }}
            </Button>
          </div>
        </div>
        <div
          v-else
          class="mt-5"
        >
          <UserMenu />
        </div>
      </div>
    </transition>
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
