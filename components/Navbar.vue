<script>
import { inject, ref } from '@nuxtjs/composition-api'
import { is } from 'vee-validate/dist/rules'
import { mapGetters } from 'vuex'
import chevronLeftIcon from 'assets/svg/chevron-left.svg'
import themeConfig from '~/config/themeConfig'
import { useCustomer } from '~/store/customer'
import logo from '~/assets/svg/logo-call-me-wine.svg'
import cartIcon from '~/assets/svg/cart.svg'
import closeIcon from '~/assets/svg/close.svg'
import menuIcon from '~/assets/svg/menu.svg'
import userIcon from '~/assets/svg/user.svg'
import searchIcon from '~/assets/svg/search.svg'
import heartIcon from '~/assets/svg/heart.svg'
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
      heartIcon,
      isDesktop,
      logo,
      menuBarRef,
      menuIcon,
      navbar,
      searchIcon,
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
      search: '',
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
    bolder(text) {
      const regexValue = new RegExp(`(${this.search})`, 'ig')
      return text.replace(
        regexValue,
        '<span class=\'font-bold\'>$1</span>',
      )
    },
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
    async suggest() {
      this.showSearchSuggestions = true
      const elastic_url = this.$config.ELASTIC_URL

      if (this.search && this.search.length >= 3) {
        const result = await fetch(
          `${elastic_url
          }autocomplete/search/?stores=${themeConfig[this.$config.STORE].id}&locale=${
          this.$i18n.locale
          }&search=${
          this.search}`,
        )
        this.data = await result.json()
      }
    },
    switchToCart() {
      this.showUser = false
      this.showCart = true
    },
    switchToUser() {
      this.showCart = false
      this.showUser = true
    },
    startSearch() {
      if (!this.search)
        return

      this.$router.push({
        path: '/catalog',
        query: { search: this.search },
      })
    },
    handleBlur() {
      this.showSearchSuggestions = false
    },
  },
}
</script>

<template>
  <div
    ref="navbar"
    class="fixed w-screen min-h-[135px] px-4 top-0 bg-white z-tooltip print:hidden"
  >
    <div
      class="
    max-w-screen-xl mx-auto grid grid-cols-1 gap-3 min-h-[109px] items-center
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
              :data="logo"
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

      <div class="relative z-base">
        <!-- Note: Since we are handling submit with Vue methods we don't need the name attribute in the search field -->
        <input
          id="search-term"
          v-model="search"
          type="search"
          class="
               c-searchInput -hasIcon px-4 text-gray-dark py-3 w-full bg-transparent border border-gray-light rounded
               hover:(border-gray)
               focus:(outline-none border-gray-dark)"
          :placeholder="$t('navbar.search')"
          @input="suggest"
          @blur="handleBlur"
          @keyup.enter="startSearch"
        >
        <ButtonIcon
          :icon="searchIcon"
          :aria-label="$t('enums.accessibility.role.TRIGGER_SEARCH')"
          size="sm"
          class="transform absolute top-1/2 right-0 translate-y-[-50%] translate-x-[-30%]"
          @click.native="startSearch"
        />
        <transition
          keep-alive
          name="slideFade"
          mode="out-in"
        >
          <div
            v-if="search && data && showSearchSuggestions"
            class="absolute w-full z-100 transform
            transition-transform-opacity translate-x-0 translate-y-full bottom-0 left-0
            "
          >
            <!-- {{ data }} -->

            <div class="bg-white max-h-[70vh] rounded-lg shadow-popover overflow-hidden mt-2">
              <div v-if="data.gift_cards && data.gift_cards.length > 0">
                <p class="overline-2 uppercase text-secondary-400 py-2 px-3 m-0">
                  {{ $t("search.giftCards") }}
                </p>
                <NuxtLink
                  v-for="item in data.gift_cards"
                  :key="item.id"
                  class="body-1 block py-2 px-3 hover:(bg-primary-50) text-body"
                  :to="localePath(`/${item.handle}`)"
                >
                  <span v-html="bolder(item.name)" />
                </NuxtLink>
              </div>
              <div
                v-if="data.winelists && data.winelists.length > 0"
                class="max-h-[70vh] overflow-y-auto"
              >
                <p class="overline-2 uppercase text-secondary-400 py-2 px-3 mb-0 mt-2">
                  {{ $t("search.winelists") }}
                </p>
                <NuxtLink
                  v-for="item in data.winelists"
                  :key="item.id"
                  class="body-1 block py-2 px-3 hover:(bg-primary-50) text-body"
                  :to="localePath(`/${item.handle}-V${item.id}.htm`)"
                >
                  <span v-html="bolder(item.name)" />
                </NuxtLink>
              </div>

              <div
                v-if="data"
                class="pt-3"
              >
                <div v-if="data.categories && data.categories.length > 0">
                  <p class="overline-2 uppercase text-secondary-400 py-2 px-3 m-0">
                    {{ $t("search.categories") }}
                  </p>
                  <NuxtLink
                    v-for="item in data.categories"
                    :key="item.id"
                    class="body-1 block py-2 px-3 hover:(bg-primary-50) text-body"
                    :to="localePath(`/catalog?&categories=${item.id}`)"
                  >
                    <span v-html="bolder(item.name)" />
                  </NuxtLink>
                </div>

                <div v-if="data.brands && data.brands.length > 0">
                  <p class="overline-2 uppercase text-secondary-400 py-2 px-3 m-0">
                    {{ $t("search.brands") }}
                  </p>
                  <NuxtLink
                    v-for="item in data.brands"
                    :key="item.id"
                    class="body-1 block py-2 px-3 hover:(bg-primary-50) text-body"
                    :to="localePath(`/winery/${item.handle}-B${item.id}.htm`)"
                  >
                    <span v-html="bolder(item.name)" />
                  </NuxtLink>
                </div>

                <div v-if="data.products && data.products.length > 0">
                  <p class="overline-2 uppercase text-secondary-400 py-2 px-3 m-0">
                    {{ $t("search.products") }}
                  </p>
                  <NuxtLink
                    v-for="item in data.products"
                    :key="item.id"
                    class="body-1 block py-2 px-3 hover:(bg-primary-50) text-body"
                    :to="localePath(`/${item.handle}-P${item.id}.htm`)"
                  >
                    <span v-html="bolder(item.name)" />
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <div v-if="isDesktop" class="md:place-self-end">
        <UserActions />
      </div>
    </div>
    <div v-if="isDesktop" class="c-megaMenu fixed left-0 w-full bg-white">
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
