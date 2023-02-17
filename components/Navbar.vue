<script>
import { nextTick, onMounted, onUnmounted, ref, watch } from '@nuxtjs/composition-api'
import debounce from 'lodash.debounce'
import { mapGetters } from 'vuex'
import LoginForm from './LoginForm.vue'
import DropdownMobileMenu from './UI/DropdownMobileMenu.vue'
import UserMenu from './UserMenu.vue'
import { useHeaderSize } from '~/store/headerSize'
import logo from '~/assets/svg/logo-call-me-wine.svg'
import cartIcon from '~/assets/svg/cart.svg'
import closeIcon from '~/assets/svg/close.svg'
import menuIcon from '~/assets/svg/menu.svg'
import userIcon from '~/assets/svg/user.svg'
import searchIcon from '~/assets/svg/search.svg'
import heartIcon from '~/assets/svg/heart.svg'
import UserActions from '@/components/Header/UserActions.vue'
import { useCustomer } from '~/store/customer'

export default {
  components: { UserActions, LoginForm, UserMenu, DropdownMobileMenu },
  setup() {
    const headerSize = useHeaderSize()
    const customer = useCustomer()
    const navbar = ref(null)
    const showMobileButton = ref(true)

    const handleShowMobileButton = (val) => { showMobileButton.value = val }
    const resizeListener = debounce(() => {
      headerSize.$patch({
        navbarHeight: navbar.value ? navbar.value.getBoundingClientRect().height : 0,
      })
    }, 500)

    const setHeaderSize = () => {
      const doc = document.querySelector(':root')
      doc && doc.style.setProperty('--cmw-header-height', `${headerSize.navbarHeight - headerSize.megaMenuHeight}px`)
      doc && doc.style.setProperty('--cmw-top-banner-height', headerSize.getTopBarHeight)
    }

    onMounted(() => {
      window.addEventListener('resize', resizeListener)
      nextTick(() => {
        resizeListener()
        setHeaderSize()
      })
    })

    onUnmounted(() => {
      window.removeEventListener('resize', resizeListener)
    })

    watch(() => headerSize, () => {
      setHeaderSize()
    }, { deep: true })

    return {
      customer,
      headerSize,
      navbar,
      showMobileButton,
      logo,
      cartIcon,
      closeIcon,
      menuIcon,
      userIcon,
      searchIcon,
      heartIcon,
      resizeListener,
      handleShowMobileButton,
    }
  },
  data() {
    return {
      showUser: false,
      showCart: false,
      showSearchSuggestions: false,
      search: '',
      visible: false,
      data: null,
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
    this.resizeListener()
  },
  computed: {
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
        '<span class=\'font-weight-bold\'>$1</span>',
      )
    },
    toggleMobileLogin() {
      this.mobileLogin = !this.mobileLogin
    },
    toggleSidebar() {
      this.isMobileMenuOpen = this.isSidebarOpen = !this.isSidebarOpen
    },
    showSidebar() {
      this.$refs.sidebar.show()
    },
    hideSidebar() {
      this.$refs.sidebar.hide()
    },
    async suggest() {
      this.showSearchSuggestions = true
      const stores = {
        CMW: 1,
        CMW_UK: 2,
        WILDVIGNERON: 3,
      }

      const activeStoreID = stores[this.$config.STORE]

      const elastic_url = this.$config.ELASTIC_URL

      if (this.search && this.search.length >= 3) {
        const result = await fetch(
          `${elastic_url
          }autocomplete/search/?stores=${
          activeStoreID
          }&locale=${
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
    class="container-fluid bg-white fixed-top"
  >
    <div
      class="
    cmw-max-w-screen-xl cmw-mx-auto cmw-grid cmw-grid-cols-1 cmw-gap-3 cmw-py-3 cmw-items-center
    lg:cmw-grid-cols-[25%_40%_35%] 2xl:cmw-grid-cols-[25%_48%_32%]"
    >
      <div
        class="bg-white"
      >
        <div class="cmw-flex cmw-items-center">
          <button
            v-show="showMobileButton"
            class="cmw-relative btn cmw-z-amenadiel d-lg-none"
            @click="toggleSidebar"
          >
            <VueSvgIcon
              :data="isMobileMenuOpen ? closeIcon : menuIcon"
              width="32"
              height="32"
            />
          </button>

          <nuxt-link
            class="cmw-flex cmw-max-w-150px md:cmw-max-w-250px"
            :to="localePath('/')"
          >
            <VueSvgIcon
              :data="logo"
              width="100%"
              height="auto"
              original
            />
          </nuxt-link>

          <div class="cmw-flex cmw-items-center ml-auto d-lg-none">
            <button
              class="btn"
              @click="toggleMobileLogin"
            >
              <VueSvgIcon
                :data="userIcon"
                width="36"
                height="36"
              />
            </button>
            <nuxt-link
              :to="localePath('/cart')"
              class="btn"
            >
              <span class="totalItems">{{ cartTotalQuantity }} </span>
              <VueSvgIcon
                :data="cartIcon"
                width="32px"
                height="32px"
              />
            </nuxt-link>
          </div>
        </div>
      </div>

      <div class="cmw-relative cmw-z-base">
        <!-- Note: Since we are handling submit with Vue methods we don' need the name attribute in the search field -->
        <input
          id="search-term"
          v-model="search"
          type="search"
          class="
               cmw-px-4 cmw-text-gray-dark cmw-py-3 cmw-w-full cmw-bg-transparent cmw-border cmw-border-gray-light cmw-rounded
               hover:(cmw-border-gray)
               focus:(cmw-outline-none cmw-border-gray-dark)"
          :placeholder="$t('navbar.search')"
          @input="suggest"
          @blur="handleBlur"
          @keyup.enter="startSearch"
        >
        <ButtonIcon
          :icon="searchIcon"
          size="sm"
          class="cmw-transform cmw-absolute cmw-top-1/2 cmw-right-0 cmw-translate-y-[-50%] cmw-translate-x-[-30%]"
          @click.native="startSearch"
        />
        <transition
          keep-alive
          name="slideFade"
          mode="out-in"
        >
          <div
            v-if="search && data && showSearchSuggestions"
            class="cmw-absolute cmw-w-full cmw-z-100 cmw-transform
            cmw-transition-transform-opacity cmw-translate-x-0 cmw-translate-y-full cmw-bottom-0 cmw-left-0
            "
          >
            <!-- {{ data }} -->

            <div class="cmw-bg-white cmw-max-h-[70vh] cmw-rounded-lg cmw-shadow-popover cmw-overflow-hidden cmw-mt-2">
              <div
                v-if="data.winelists && data.winelists.length > 0"
                class="cmw-max-h-[70vh] cmw-overflow-y-auto"
              >
                <p class="cmw-overline-2 cmw-uppercase cmw-text-secondary-400 cmw-py-2 cmw-px-3 cmw-mb-0 cmw-mt-2">
                  {{ $t("search.winelists") }}
                </p>
                <nuxt-link
                  v-for="item in data.winelists"
                  :key="item.id"
                  class="cmw-body-1 cmw-block cmw-py-2 cmw-px-3 hover:(cmw-no-underline cmw-bg-primary-50) cmw-text-body"
                  :to="localePath(`/${item.handle}-V${item.id}`)"
                >
                  <span v-html="bolder(item.name)" />
                </nuxt-link>
              </div>

              <div
                v-if="data"
                class="pt-3"
              >
                <div v-if="data.categories && data.categories.length > 0">
                  <p class="cmw-overline-2 cmw-uppercase cmw-text-secondary-400 cmw-py-2 cmw-px-3 cmw-m-0">
                    {{ $t("search.categories") }}
                  </p>
                  <nuxt-link
                    v-for="item in data.categories"
                    :key="item.id"
                    class="cmw-body-1 cmw-block cmw-py-2 cmw-px-3 hover:(cmw-no-underline cmw-bg-primary-50) cmw-text-body"
                    :to="localePath(`/catalog?&categories=${item.id}`)"
                  >
                    <span v-html="bolder(item.name)" />
                  </nuxt-link>
                </div>

                <div v-if="data.brands && data.brands.length > 0">
                  <p class="cmw-overline-2 cmw-uppercase cmw-text-secondary-400 cmw-py-2 cmw-px-3 cmw-m-0">
                    {{ $t("search.brands") }}
                  </p>
                  <nuxt-link
                    v-for="item in data.brands"
                    :key="item.id"
                    class="cmw-body-1 cmw-block cmw-py-2 cmw-px-3 hover:(cmw-no-underline cmw-bg-primary-50) cmw-text-body"
                    :to="localePath(`/winery/${item.handle}-B${item.id}`)"
                  >
                    <span v-html="bolder(item.name)" />
                  </nuxt-link>
                </div>

                <div v-if="data.products && data.products.length > 0">
                  <p class="cmw-overline-2 cmw-uppercase cmw-text-secondary-400 cmw-py-2 cmw-px-3 cmw-m-0">
                    {{ $t("search.products") }}
                  </p>
                  <nuxt-link
                    v-for="item in data.products"
                    :key="item.id"
                    class="cmw-body-1 cmw-block cmw-py-2 cmw-px-3 hover:(cmw-no-underline cmw-bg-primary-50) cmw-text-body"
                    :to="localePath(`/${item.handle}-P${item.id}`)"
                  >
                    <span v-html="bolder(item.name)" />
                  </nuxt-link>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <div class="d-none d-lg-block md:cmw-place-self-end">
        <UserActions />
      </div>
    </div>
    <div class="d-none d-lg-block">
      <MegaMenu />
    </div>

    <b-sidebar
      v-model="isSidebarOpen"
      title=""
      shadow
      width="100%"
      z-index="1029"
      no-header
    >
      <div
        v-if="data"
        class="px-3 py-2 mt-5 here?"
      >
        <div
          v-for="(item, i) in data"
          :key="`mobile_${i}`"
        >
          <DropdownMobileMenu :data="item" @update-show="handleShowMobileButton" />
        </div>
      </div>
    </b-sidebar>

    <b-sidebar
      v-model="mobileLogin"
      title=""
      shadow
      width="100%"
      z-index="2089"
      no-header
    >
      <div class="">
        <div
          class="p-3 d-flex justify-content-between align-items-center shadow"
          @click="toggleMobileLogin"
        >
          <i class="fal fa-chevron-left fa-2x text-light-secondary" />
          <p class="mb-0">
            {{ customer.firstName ? customer.firstName.split(" ")[0] : "Account" }}
          </p>
          <i class="fal fa-times fa-2x text-light-secondary" />
        </div>
        <div v-if="!user">
          <h3 class="px-3 text-center text-dark-primary mt-5 font-weight-bold">
            {{ $t("navbar.user.signIn") }}
          </h3>
          <div class="px-3">
            <LoginForm width="340px" />
          </div>
          <div class="bg-light p-3 text-center">
            {{ $t("navbar.user.notRegisteredYet") }}
            <nuxt-link
              to="/login"
              class="text-uppercase text-light-secondary"
            >
              {{ $t("navbar.user.register") }}
            </nuxt-link>
          </div>
        </div>
        <div
          v-else
          class="mt-5"
        >
          <UserMenu />
        </div>
      </div>
    </b-sidebar>
  </div>
</template>

<style scoped>
:deep(.b-sidebar-body) {
  background: white;
}

:deep(.b-sidebar.shadow.bg-light) {
  padding-top: 40px !important;
}

:deep(.dropdown-toggle::after) {
  display: none;
}

/* :deep(.btn-secondary) {
  background-color: var(--dark-secondary) !important;
  border-color: var(--dark-secondary) !important;
} */
:deep(.dropdown-menu) {
  left: -60px;
  border-top: 4px solid var(--dark-secondary);
  padding-bottom: 0;
}

:deep(.b-sidebar) {
  padding-top: 48px !important;
}

.totalItems {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #d94965;
  color: white;
  position: absolute;
  top: 12px;
  right: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
}

@media screen and (max-width: 768px) {
  .totalItems {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--light-secondary);
    color: white;
    position: absolute;
    top: 2px;
    right: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
  }
}

.box {
  /* background: #eee; */
  border-radius: 10px;
  height: 52px !important;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  box-sizing: content-box;
}

.user-box:hover {
  background: var(--darker-secondary);
  border-radius: 10px 10px 0 0;
}

.user-box:hover * {
  color: white;
}

.user-box:hover g {
  fill: white;
}

.cart-box:hover {
  background: var(--darker-secondary);
  border-radius: 10px 10px 0 0;
}

.cart-box:hover * {
  color: white;
}

.cart-box:hover g path {
  fill: white;
}

.shadowed {
  box-shadow: 0 1px 8px 0 rgb(51 51 51 / 20%),
  0 3px 3px -2px rgb(51 51 51 / 12%), 0 3px 4px 0 rgb(51 51 51 / 14%);
}

#search-term::-webkit-search-cancel-button {
  position: relative;
  right: 30px;
  -webkit-appearance: none;
  height: 20px;
  width: 20px;
  background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIGlkPSJhIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+PHBhdGggZD0ibTEyLjQ1LDM3LjY1bC0yLjEtMi4xLDExLjU1LTExLjU1LTExLjU1LTExLjU1LDIuMS0yLjEsMTEuNTUsMTEuNTUsMTEuNTUtMTEuNTUsMi4xLDIuMS0xMS41NSwxMS41NSwxMS41NSwxMS41NS0yLjEsMi4xLTExLjU1LTExLjU1LTExLjU1LDExLjU1WiIgc3R5bGU9ImZpbGw6I2Q5NDk2NTsiLz48L3N2Zz4=");
  background-size: contain;
}
</style>
