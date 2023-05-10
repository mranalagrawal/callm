<script>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from '@nuxtjs/composition-api'
import debounce from 'lodash.debounce'
import { is } from 'vee-validate/dist/rules'
import { mapGetters } from 'vuex'
import useScreenSize from '@/components/composables/useScreenSize'
import themeConfig from '~/config/themeConfig'
import { useHeaderSize } from '~/store/headerSize'
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
    const headerSize = useHeaderSize()
    const customer = useCustomer()
    const navbar = ref(null)
    const menuBarRef = ref(null)
    const showMobileButton = ref(true)
    const { isDesktop } = useScreenSize()

    const handleShowMobileButton = (val) => {
      showMobileButton.value = val
    }
    const resizeListener = debounce(() => {
      headerSize.$patch({
        navbarHeight: navbar.value ? navbar.value.getBoundingClientRect().height : 0,
      })
    }, 500)

    const setHeaderSize = () => {
      const doc = document.querySelector(':root')
      doc && doc.style.setProperty('--cmw-header-height', `${headerSize.navbarHeight + headerSize.megaMenuHeight}px`)
      doc && doc.style.setProperty('--cmw-top-banner-height', headerSize.getTopBarHeight)
    }

    const megaMenuTop = computed(() => {
      return `${headerSize.navbarHeight}px`
    })

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
      megaMenuTop,
      isDesktop,
      customer,
      headerSize,
      navbar,
      menuBarRef,
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
      setHeaderSize,
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
    this.resizeListener()
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
        '<span class=\'font-weight-bold\'>$1</span>',
      )
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
    showSidebar() {
      this.$refs.sidebar.show()
    },
    hideSidebar() {
      this.$refs.sidebar.hide()
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
    class="cmw-fixed cmw-w-screen cmw-px-4 cmw-top-0 bg-white cmw-z-tooltip"
  >
    <div
      class="
    cmw-max-w-screen-xl cmw-mx-auto cmw-grid cmw-grid-cols-1 cmw-gap-3 cmw-py-3 cmw-items-center
    lg:cmw-grid-cols-[25%_40%_35%] 2xl:cmw-grid-cols-[25%_48%_32%]"
    >
      <div
        ref="menuBarRef"
        class="bg-white"
      >
        <div class="cmw-flex cmw-gap-2 cmw-items-center">
          <button
            v-show="showMobileButton"
            class="cmw-relative cmw-z-base d-lg-none"
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
            :aria-label="$t('enums.accessibility.labels.GO_TO_HOME_PAGE')"
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
              class="cmw-relative btn"
            >
              <VueSvgIcon
                :data="cartIcon"
                width="32px"
                height="32px"
              />
              <span class="totalItems">{{ cartTotalQuantity }} </span>
            </nuxt-link>
          </div>
        </div>
      </div>

      <div class="cmw-relative cmw-z-base">
        <!-- Note: Since we are handling submit with Vue methods we don't need the name attribute in the search field -->
        <input
          id="search-term"
          v-model="search"
          type="search"
          class="
               c-searchInput -hasIcon cmw-px-4 cmw-text-gray-dark cmw-py-3 cmw-w-full cmw-bg-transparent cmw-border cmw-border-gray-light cmw-rounded
               hover:(cmw-border-gray)
               focus:(cmw-outline-none cmw-border-gray-dark)"
          :placeholder="$t('navbar.search')"
          @input="suggest"
          @blur="handleBlur"
          @keyup.enter="startSearch"
        >
        <ButtonIcon
          :icon="searchIcon"
          :aria-label="$t('enums.accessibility.role.TRIGGER_SEARCH')"
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
                  :to="localePath(`/${item.handle}-V${item.id}.htm`)"
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
                    :to="localePath(`/winery/${item.handle}-B${item.id}.htm`)"
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
                    :to="localePath(`/${item.handle}-P${item.id}.htm`)"
                  >
                    <span v-html="bolder(item.name)" />
                  </nuxt-link>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <div v-if="isDesktop" class="d-none d-lg-block md:cmw-place-self-end">
        <UserActions />
      </div>
    </div>
    <div v-if="isDesktop" class="d-none d-lg-block c-megaMenu cmw-fixed cmw-left-0 cmw-w-full cmw-bg-white">
      <div class="shadow-menu">
        <MegaMenu />
      </div>
    </div>

    <div v-if="!isDesktop && !!data.length" class="">
      <transition name="menu-mobile">
        <div v-show="isSidebarOpen" class="cmw-absolute cmw-left-0 cmw-w-full cmw-z-base" :style="{ top: sideBarTop }">
          <MenuMobile :menu="data" @close-sidebar="toggleSidebar" />
        </div>
      </transition>
    </div>
    <!--    <b-sidebar
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
    </b-sidebar> -->

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
.c-megaMenu {
  top: v-bind(megaMenuTop)
}

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
    top: -2px;
    right: 0;
  }
}

.shadow-menu {
  box-shadow: 0 0.5rem 0.75rem rgb(0 0 0 / 15%) !important;
}
</style>
