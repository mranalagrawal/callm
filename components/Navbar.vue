<script>
import { inject, ref } from '@nuxtjs/composition-api'
import { is } from 'vee-validate/dist/rules'
import { mapGetters } from 'vuex'
import chevronLeftIcon from 'assets/svg/chevron-left.svg'
import { useCustomer } from '~/store/customer'
import logo from '~/assets/svg/logo-call-me-wine.svg'
import logoB2b from '~/assets/svg/logo-call-me-wine-b2b.svg'
import cartIcon from '~/assets/svg/cart.svg'
import closeIcon from '~/assets/svg/close.svg'
import menuIcon from '~/assets/svg/menu.svg'
import userIcon from '~/assets/svg/user.svg'
import LoginForm from '@/components/LoginForm.vue'
import UserMenu from '@/components/UserMenu.vue'
import UserActions from '@/components/Header/UserActions.vue'

export default {
  components: { UserActions, LoginForm, UserMenu },
  setup() {
    const customer = useCustomer()
    const navbar = ref(null)
    const menuBarRef = ref(null)
    const showMobileButton = ref(true)
    const isDesktop = inject('isDesktop')

    const handleShowMobileButton = (val) => {
      showMobileButton.value = val
    }

    return {
      cartIcon,
      chevronLeftIcon,
      closeIcon,
      customer,
      handleShowMobileButton,
      isDesktop,
      logo,
      logoB2b,
      menuBarRef,
      menuIcon,
      navbar,
      showMobileButton,
      userIcon,
    }
  },
  data() {
    return {
      sideBarTop: 0,
      showUser: false,
      showCart: false,
      showSearchSuggestions: false,
      visible: false,
      data: [],
      isMobileMenuOpen: false,
      isSidebarOpen: false,
      mobileLogin: false,
    }
  },
  async fetch() {
    let lang = ''
    if (this.$i18n.locale === 'en')
      lang = 'en-gb'
    else
      lang = 'it-it'

    // TODO component access!
    const response = await this.$prismic.api.getSingle('mega-menu-test', {
      lang,
    })

    const data = response.data.body

    this.data = data
      .map((firstLevel) => {
        const secondLevels = firstLevel.items.map((el) => {
          return {
            name: el.secondlevelname,
            position: el.second_level_position,
            // isSelection: !!el.selection,
          }
        })

        const secondLevelsSet = [
          ...new Set(secondLevels.map(el => JSON.stringify(el))),
        ]
          .map(el => JSON.parse(el))
          .sort((a, b) => a.position - b.position)

        const items = secondLevelsSet.map((el) => {
          const temp = firstLevel.items
            .filter(x => x.secondlevelname === el.name)
            .sort((a, b) => a.third_level_position - b.third_level_position)
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
  },
  computed: {
    is() {
      return is
    },
    ...mapGetters({
      cartTotalAmount: 'userCart/getCartTotalAmount',
      cartTotalQuantity: 'userCart/cartTotalQuantity',
    }),
    user() {
      return this.$store.state.user.user
    },
  },
  watch: {
    $route() {
      this.showUser = false
      this.showCart = false
      this.search = null
      this.isSidebarOpen = false
      this.isMobileMenuOpen = false
      this.showMobileButton = true
      this.lockBody()
    },
    cartTotalAmount(total) {
      if (Number(total) > 50) {
        setTimeout(() => {
          this.flashMessage.show({
            status: '',
            message: 'Hai raggiunto la spedizione gratuita!',
            time: 1000,
            blockClass: 'free-shipping-notification',
          })
        }, 3000)
      }
    },
  },
  methods: {
    handleGoToLogin() {
      this.mobileLogin = false
      this.$router.push(this.localeLocation('/login'))
    },
    toggleMobileLogin() {
      this.mobileLogin = !this.mobileLogin
    },
    lockBody() {
      if (process.browser && document.body)
        document.body.classList.toggle('lock-scroll', this.isMobileMenuOpen)
    },
    toggleSidebar() {
      this.sideBarTop = `${this.$refs.menuBarRef.getBoundingClientRect().bottom}px`
      this.isMobileMenuOpen = this.isSidebarOpen = !this.isSidebarOpen
      this.lockBody()
    },
  },
}
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

          <div class="flex items-center ml-auto md:hidden">
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

    <div v-if="!isDesktop && !!data.length" class="">
      <transition name="menu-mobile">
        <div v-show="isSidebarOpen" class="absolute left-0 w-full z-base" :style="{ top: sideBarTop }">
          <MenuMobile :menu="data" @close-sidebar="toggleSidebar" />
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
        <div v-if="!user">
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
