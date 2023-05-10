<script>
import Cart from './Cart/Cart.vue'
/* import Cart from "./Cart/Cart.vue"; */

import LoginForm from './LoginForm.vue'
import MegaMenuWV from './MegaMenuWV.vue'
import DropdownMobileMenu from './UI/DropdownMobileMenu.vue'
import UserMenu from './UserMenu.vue'
import themeConfig from '~/config/themeConfig'

export default {
  components: { LoginForm, UserMenu, DropdownMobileMenu, Cart, MegaMenuWV },
  data() {
    return {
      showUser: false,
      showCart: false,
      search: '',
      visible: false,
      data: null,
      isMobileMenuOpen: false,
      isSidebarOpen: false,
      mobileLogin: false,
      data: null,
    }
  },
  async fetch() {
    let lang = ''
    if (this.$i18n.locale == 'en')
      lang = 'en-gb'
    else
      lang = 'it-it'

    const response = await this.$prismic.api.getSingle('mega-menu-test', {
      lang,
    })
    const data = response.data.body

    const mapped = data
      .map((firstLevel) => {
        const secondLevelNames = [
          ...new Set(firstLevel.items.map(el => el.secondlevelname)),
        ]
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

    this.data = mapped
  },
  computed: {
    cart() {
      return this.$store.state.cart.cart
    },
    cartTotalAmount() {
      const cart = this.$store.state.userCart.userCart
      const total = cart
        .reduce((t, n) => t + n.quantity * n.singleAmount, 0)
        .toFixed(2)
      return total
    },
    cartTotalQuantity() {
      const cart = this.$store.state.userCart.userCart
      const total = cart.reduce((t, n) => t + n.quantity, 0)

      return total
    },
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
    },
    /* cartTotalAmount(total) {
      if (Number(total) > 50) {
        setTimeout(() => {
          this.flashMessage.show({
            status: "",
            message: "Hai raggiunto la spedizione gratuita!",
            time: 1000,
            blockClass: "free-shipping-notification",
          });
        }, 3000);
      }
    }, */
  },
  methods: {
    bolder(text) {
      const regexValue = new RegExp(`(${this.search})`, 'ig')
      const newStr = text.replace(
        regexValue,
        '<span class=\'font-weight-bold\'>$1</span>',
      )
      return newStr
    },
    toggleMobileLogin() {
      this.mobileLogin = !this.mobileLogin
    },
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen
    },
    showSidebar() {
      this.$refs.sidebar.show()
    },
    hideSidebar() {
      this.$refs.sidebar.hide()
    },
    async suggest() {
      const elastic_url = this.$config.ELASTIC_URL
      if (this.search && this.search.length >= 3) {
        const result = await fetch(
          `${elastic_url
            }autocomplete/search/?stores=${themeConfig[this.$config.STORE].id}&locale=${
            this.$i18n.locale
            }&search=${
            this.search}`,
        )
        const resultJSON = await result.json()
        this.data = resultJSON
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
      const query = { search: this.search || '' }
      this.$router.push({
        path: '/catalog',
        query,
      })
      this.search = ''
    },
  },
}
</script>

<template>
  <div class="container-fluid bg-dark-primary fixed-top pt-5">
    <div
      class="row align-items-center py-md-3 px-lg-5"
      style="border-top: 1px solid white"
    >
      <div
        class="col-12 col-lg-3 px-lg-2 bg-dark-primary"
        style="position: relative; z-index: 1040"
      >
        <button class="btn d-lg-none" @click="toggleSidebar">
          <i
            class="fal fa-2x"
            :class="isMobileMenuOpen ? 'fa-times' : 'fa-bars'"
          />
        </button>

        <nuxt-link :to="localePath('/')">
          <img
            src="../assets/images/logo-white-wv.svg"
            class="img-fluid d-lg-none"
            width="80px"
            alt=""
          >
          <img
            src="../assets/images/logo-white-wv.svg"
            class="img-fluid d-none d-lg-block"
            width="270px"
            alt=""
          >
        </nuxt-link>
        <div class="d-inline-block float-right d-lg-none">
          <button class="btn" @click="toggleMobileLogin">
            <svg
              width="27px"
              height="26px"
              viewBox="0 0 27 26"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
            >
              <g
                id="COMPONENTS"
                stroke="none"
                stroke-width="1"
                fill="none"
                fill-rule="evenodd"
              >
                <g
                  id="COMPONENTS/DS/Header/Accessi/Combo-Logged-sticky"
                  transform="translate(-161.000000, -19.000000)"
                  fill="#ffffff"
                >
                  <g
                    id="ICONS/System/User-2"
                    transform="translate(158.500000, 16.000000)"
                  >
                    <path
                      id="Shape"
                      d="M16.1584763,3 C20.2024884,3 23.4794871,6.10401132 23.4794871,9.93454669 C23.4794871,12.5233105 21.9833701,14.7797105 19.7652026,15.9713769 C24.3487689,17.3116885 27.9528504,21.036168 28.9358618,25.8237109 C29.0213794,26.1994992 29.0213794,26.5886489 28.9358618,26.9644372 C28.7128108,27.7218594 28.176783,28.3540188 27.4573773,28.7064247 C27.087095,28.8918136 26.6780212,28.9920238 26.2618944,28.9987045 L5.92545934,28.9987045 C5.50580603,29.0120658 5.08967921,28.9218767 4.71498875,28.7373229 C4.32707392,28.5669655 3.98764844,28.3080891 3.72404268,27.9815708 C3.45073905,27.6951366 3.24708376,27.3535868 3.12630119,26.9794687 C3.00111049,26.6078558 2.96760876,26.2111904 3.03196736,25.8237109 C4.03084805,20.9551648 7.7398428,17.1872608 12.4327306,15.9054052 C10.2806849,14.6987072 8.83658382,12.4765457 8.83658382,9.93454669 C8.83658382,6.10484641 12.1153458,3 16.1584763,3 L16.1584763,3 Z M16.0507388,17.0003269 L16.0621113,17.0003269 C10.4720917,16.9594626 5.63528136,20.7541214 4.52952475,26.0517692 C4.49015842,26.2209474 4.49015842,26.3950293 4.52952475,26.5650248 C4.57501474,26.7325685 4.66074587,26.8878528 4.77884487,27.016984 C4.90831638,27.1698165 5.07452979,27.2891402 5.26261339,27.3643305 C5.44632296,27.4534147 5.65015309,27.5 5.85573284,27.5 L26.1442672,27.5 C26.3498469,27.5 26.5528022,27.4534147 26.7373866,27.3643305 C27.0925584,27.217219 27.3619991,26.9229961 27.4704752,26.5650248 C27.5098416,26.3958466 27.5098416,26.2209474 27.4704752,26.0517692 C26.412833,20.8685415 21.7641063,17.1131124 16.3245536,17.003596 L16.1268471,17.0011442 L16.0822319,17.0011442 L16.0507388,17.0003269 L16.0507388,17.0003269 Z M16.2504423,4.5 C13.0744288,4.5 10.5,6.96268657 10.5,9.99915372 C10.5,13.0373134 13.0744288,15.5 16.2504423,15.5 C19.4264559,15.5 22,13.0373134 22,9.99915372 C22,6.960994 19.4255712,4.5 16.2495577,4.5 L16.2504423,4.5 Z"
                    />
                  </g>
                </g>
              </g>
            </svg>
          </button>
          <nuxt-link :to="localePath('/cart')" class="btn">
            <span class="totalItems">{{ cartTotalQuantity }} </span>
            <svg
              width="27px"
              height="26px"
              viewBox="0 0 27 26"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
            >
              <g
                id="COMPONENTS"
                stroke="none"
                stroke-width="1"
                fill="#ffffff"
                fill-rule="evenodd"
              >
                <g
                  id="COMPONENTS/DS/Header/Accessi/Combo-Logged-sticky"
                  transform="translate(-233.000000, -19.000000)"
                  fill="#ffffff"
                >
                  <g
                    id="ICONS/System/Shopping/Shopping-3"
                    transform="translate(230.500000, 16.000000)"
                  >
                    <path
                      id="Shape"
                      fill="#ffffff"
                      d="M7.875,25.75 C7.875,27.5448072 9.33019281,29 11.125,29 C12.9198072,29 14.375,27.5448072 14.375,25.75 C14.375,23.9551928 12.9198072,22.5 11.125,22.5 C9.33019281,22.5 7.875,23.9551928 7.875,25.75 Z M11.125,24.125 C12.0228072,24.125 12.75,24.8521928 12.75,25.75 C12.75,26.6478072 12.0228072,27.375 11.125,27.375 C10.2271928,27.375 9.5,26.647 9.5,25.75 C9.5,24.853 10.2271928,24.125 11.125,24.125 Z M17.625,25.75 C17.625,27.5448072 19.0801928,29 20.875,29 C22.6698072,29 24.125,27.5448072 24.125,25.75 C24.125,23.9551928 22.6698072,22.5 20.875,22.5 C19.0801928,22.5 17.625,23.9551928 17.625,25.75 Z M20.875,24.125 C21.7728072,24.125 22.5,24.8521928 22.5,25.75 C22.5,26.6478072 21.7728072,27.375 20.875,27.375 C19.9771928,27.375 19.25,26.647 19.25,25.75 C19.25,24.853 19.9771928,24.125 20.875,24.125 Z M9.5,20.875 C8.60219281,20.875 7.875,20.1478072 7.875,19.25 L26.5625,17.625 C26.5625,17.625 29,7.77342157 29,7.0625 C29,6.614 28.636,6.25 28.1875,6.25 L7.875,6.25 L7.875,4.625 L8.6875,4.625 C9.136,4.625 9.5,4.261 9.5,3.8125 C9.5,3.364 9.136,3 8.6875,3 L3.8125,3 C3.364,3 3,3.364 3,3.8125 C3,4.261 3.364,4.625 3.8125,4.625 L6.25,4.625 L6.25,19.25 C6.25,21.0448072 7.70519281,22.5 9.5,22.5 L11.125,22.5 L20.875,22.5 L28.1875,22.5 C28.2126928,22.5 28.1875,21.694 28.1875,20.875 L9.5,20.875 Z M7.875,7.875 L27.375,7.875 L25.2974641,16.1852288 L7.875,17.625 L7.875,7.875 Z"
                    />
                  </g>
                </g>
              </g>
            </svg>
          </nuxt-link>
        </div>
      </div>

      <div class="col-12 col-lg-6 py-2" style="position: relative">
        <b-button
          size="sm"
          class="border-0 text-white btn-search"
          type="button"
          style=""
          @click="startSearch"
        >
          <i class="fal fa-search text-dark-primary" />
        </b-button>
        <div
          v-if="search && data"
          class="bg-white px-2 shadowed"
          style="
            position: absolute;
            top: 70px;
            left: 0px;
            z-index: 999;
            width: 100%;
            height: 70vh;
            overflow-y: scroll;
            border-radius: 10px;
          "
          @mouseleave="search = ''"
        >
          <!-- {{ data }} -->

          <div v-if="data.winelists && data.winelists.length > 0">
            <p class="text-uppercase suggest-title px-2 mt-3 mb-0 pb-0">
              {{ $t("search.winelists") }}
            </p>
            <nuxt-link
              v-for="item in data.winelists"
              :key="item.id"
              class="suggest-voice p-2 mb-0"
              :to="`/${item.handle}-V${item.id}`"
            >
              <span v-html="bolder(item.name)" />
            </nuxt-link>
          </div>

          <div v-if="data" class="pt-3">
            <div v-if="data.categories && data.categories.length > 0">
              <p class="text-uppercase suggest-title px-2 mt-3 mb-0 pb-0">
                {{ $t("search.categories") }}
              </p>
              <nuxt-link
                v-for="item in data.categories"
                :key="item.id"
                class="suggest-voice p-2 mb-0"
                :to="`/catalog?&categories=${item.id}`"
              >
                <span v-html="bolder(item.name)" />
              </nuxt-link>
            </div>

            <div v-if="data.brands && data.brands.length > 0">
              <p class="text-uppercase suggest-title px-2 mt-3 mb-0 pb-0">
                {{ $t("search.brands") }}
              </p>
              <nuxt-link
                v-for="item in data.brands"
                :key="item.id"
                class="suggest-voice p-2 mb-0"
                :to="`/winery/${item.handle}-B${item.id}`"
              >
                <span v-html="bolder(item.name)" />
              </nuxt-link>
            </div>

            <div v-if="data.products && data.products.length > 0">
              <p class="text-uppercase suggest-title px-2 mt-3 mb-0 pb-0">
                {{ $t("search.products") }}
              </p>
              <nuxt-link
                v-for="item in data.products"
                :key="item.id"
                class="suggest-voice p-2 mb-0"
                :to="`/${item.handle}-P${item.id}`"
              >
                <span v-html="bolder(item.name)" />
              </nuxt-link>
            </div>
          </div>
        </div>
        <b-form-input
          v-model="search"
          type="search"
          size="sm"
          class="p-4 bg-transparent"
          style="border-radius: 12px; border: 1px solid #8c8d8e"
          :placeholder="$t('navbar.search')"
          @input="suggest"
        />
      </div>

      <div class="d-none d-lg-block col-lg-3">
        <div class="d-flex justify-content-end">
          <div class="position-relative d-flex">
            <div v-if="user" class="btn px-md-2 px-xl-4 pb-0 pt-1 box">
              <nuxt-link
                :to="localePath('/profile/wishlist')"
                class="text-decoration-none text-dark"
              >
                <svg
                  width="27px"
                  height="24px"
                  viewBox="0 0 27 26"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                >
                  <title>COMPONENTS/DS/Header/Accessi/Icona preferiti</title>
                  <g
                    id="COMPONENTS"
                    stroke="none"
                    stroke-width="1"
                    fill="none"
                    fill-rule="evenodd"
                  >
                    <g
                      id="COMPONENTS/DS/Header/Accessi/Combo-Logged-sticky"
                      transform="translate(-89.000000, -20.000000)"
                      fill="#ffffff"
                    >
                      <g
                        id="ICONS/System/Shopping/Shopping-3"
                        transform="translate(86.500000, 16.000000)"
                      >
                        <path
                          id="Shape"
                          d="M22.5,4 C19.7919641,4 17.7428072,5.55911706 16,7.18833583 C14.3392712,5.45946594 12.2080784,4 9.5,4 C5.68611438,4 3,7.21701001 3,10.725013 C3,12.606923 3.78569281,13.9627784 4.64611438,15.2356955 L14.7479216,27.1170185 C15.8821928,28.2943272 16.0958856,28.2943272 17.2301144,27.1170185 L27.3546503,15.2356955 C28.3662288,13.9627784 29,12.606923 29,10.725013 C29,7.21705169 26.3138431,4 22.5,4 Z M25.75,14.905734 L16,26.3183508 L6.25,14.85868 C5.08407843,13.2685131 4.625,12.1956485 4.625,10.725013 C4.625,7.98462791 6.61969281,5.51764786 9.5,5.4944019 C11.8692712,5.47538678 14.5545784,7.84909238 16,9.6385615 C17.4072712,7.91127535 20.1307288,5.4944019 22.5,5.4944019 C25.3039216,5.4944019 27.375,7.98462791 27.375,10.725013 C27.375,12.1956485 27.0118072,13.3482007 25.75,14.905734 Z"
                        />
                      </g>
                    </g>
                  </g>
                </svg>
                <p
                  class="mb-0 fs-14 text-white"
                  style="position: relative; top: 4px"
                >
                  {{ $t("navbar.favorites") }}
                </p>
              </nuxt-link>
            </div>
            <div>
              <div
                class="btn px-md-2 px-xl-4 pb-0 pt-1 box user-box"
                @mouseenter="switchToUser()"
              >
                <div>
                  <svg
                    width="27px"
                    height="26px"
                    viewBox="0 0 27 26"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                  >
                    <g
                      id="COMPONENTS"
                      stroke="none"
                      stroke-width="1"
                      fill="none"
                      fill-rule="evenodd"
                    >
                      <g
                        id="COMPONENTS/DS/Header/Accessi/Combo-Logged-sticky"
                        transform="translate(-161.000000, -19.000000)"
                        fill="#ffffff"
                      >
                        <g
                          id="ICONS/System/User-2"
                          transform="translate(158.500000, 16.000000)"
                        >
                          <path
                            id="Shape"
                            d="M16.1584763,3 C20.2024884,3 23.4794871,6.10401132 23.4794871,9.93454669 C23.4794871,12.5233105 21.9833701,14.7797105 19.7652026,15.9713769 C24.3487689,17.3116885 27.9528504,21.036168 28.9358618,25.8237109 C29.0213794,26.1994992 29.0213794,26.5886489 28.9358618,26.9644372 C28.7128108,27.7218594 28.176783,28.3540188 27.4573773,28.7064247 C27.087095,28.8918136 26.6780212,28.9920238 26.2618944,28.9987045 L5.92545934,28.9987045 C5.50580603,29.0120658 5.08967921,28.9218767 4.71498875,28.7373229 C4.32707392,28.5669655 3.98764844,28.3080891 3.72404268,27.9815708 C3.45073905,27.6951366 3.24708376,27.3535868 3.12630119,26.9794687 C3.00111049,26.6078558 2.96760876,26.2111904 3.03196736,25.8237109 C4.03084805,20.9551648 7.7398428,17.1872608 12.4327306,15.9054052 C10.2806849,14.6987072 8.83658382,12.4765457 8.83658382,9.93454669 C8.83658382,6.10484641 12.1153458,3 16.1584763,3 L16.1584763,3 Z M16.0507388,17.0003269 L16.0621113,17.0003269 C10.4720917,16.9594626 5.63528136,20.7541214 4.52952475,26.0517692 C4.49015842,26.2209474 4.49015842,26.3950293 4.52952475,26.5650248 C4.57501474,26.7325685 4.66074587,26.8878528 4.77884487,27.016984 C4.90831638,27.1698165 5.07452979,27.2891402 5.26261339,27.3643305 C5.44632296,27.4534147 5.65015309,27.5 5.85573284,27.5 L26.1442672,27.5 C26.3498469,27.5 26.5528022,27.4534147 26.7373866,27.3643305 C27.0925584,27.217219 27.3619991,26.9229961 27.4704752,26.5650248 C27.5098416,26.3958466 27.5098416,26.2209474 27.4704752,26.0517692 C26.412833,20.8685415 21.7641063,17.1131124 16.3245536,17.003596 L16.1268471,17.0011442 L16.0822319,17.0011442 L16.0507388,17.0003269 L16.0507388,17.0003269 Z M16.2504423,4.5 C13.0744288,4.5 10.5,6.96268657 10.5,9.99915372 C10.5,13.0373134 13.0744288,15.5 16.2504423,15.5 C19.4264559,15.5 22,13.0373134 22,9.99915372 C22,6.960994 19.4255712,4.5 16.2495577,4.5 L16.2504423,4.5 Z"
                          />
                        </g>
                      </g>
                    </g>
                  </svg>
                  <p class="mb-0 fs-14" style="position: relative; top: 4px">
                    {{
                      user
                        ? user.customer.firstName.split(" ")[0]
                        : $t("navbar.user.signIn")
                    }}
                  </p>
                </div>
              </div>

              <div
                v-if="showUser"
                class="content card shadow"
                @mouseleave="showUser = false"
              >
                <div v-if="!user">
                  <LoginForm width="340px" />
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
                <div v-else>
                  <UserMenu />
                </div>
              </div>
            </div>
          </div>

          <div class="position-relative d-flex">
            <div class="">
              <div
                class="btn px-md-2 px-xl-4 pb-0 pt-1 box cart-box"
                @mouseenter="switchToCart()"
              >
                <div
                  v-if="Number(cartTotalAmount) > 0"
                  class="d-flex align-items-center"
                >
                  <div
                    class="d-flex flex-column justify-content-between align-items-start"
                  >
                    <span class="pr-1" style="font-size: 11px">
                      {{ $t("navbar.cart.total") }}
                    </span>
                    <div>
                      <span style="font-weight: bold; font-size: 1.75rem">{{
                        cartTotalAmount.split(".")[0]
                      }}</span><span>,{{ cartTotalAmount.split(".")[1] }}</span>
                    </div>
                  </div>
                  <div class="">
                    <p class="mb-0">
                      <span class="totalItems">{{ cartTotalQuantity }} </span>
                      <svg
                        width="27px"
                        height="26px"
                        viewBox="0 0 27 26"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink"
                      >
                        <g
                          id="COMPONENTS"
                          stroke="none"
                          stroke-width="1"
                          fill="#ffffff"
                          fill-rule="evenodd"
                        >
                          <g
                            id="COMPONENTS/DS/Header/Accessi/Combo-Logged-sticky"
                            transform="translate(-233.000000, -19.000000)"
                            fill="#ffffff"
                          >
                            <g
                              id="ICONS/System/Shopping/Shopping-3"
                              transform="translate(230.500000, 16.000000)"
                            >
                              <path
                                id="Shape"
                                fill="#ffffff"
                                d="M7.875,25.75 C7.875,27.5448072 9.33019281,29 11.125,29 C12.9198072,29 14.375,27.5448072 14.375,25.75 C14.375,23.9551928 12.9198072,22.5 11.125,22.5 C9.33019281,22.5 7.875,23.9551928 7.875,25.75 Z M11.125,24.125 C12.0228072,24.125 12.75,24.8521928 12.75,25.75 C12.75,26.6478072 12.0228072,27.375 11.125,27.375 C10.2271928,27.375 9.5,26.647 9.5,25.75 C9.5,24.853 10.2271928,24.125 11.125,24.125 Z M17.625,25.75 C17.625,27.5448072 19.0801928,29 20.875,29 C22.6698072,29 24.125,27.5448072 24.125,25.75 C24.125,23.9551928 22.6698072,22.5 20.875,22.5 C19.0801928,22.5 17.625,23.9551928 17.625,25.75 Z M20.875,24.125 C21.7728072,24.125 22.5,24.8521928 22.5,25.75 C22.5,26.6478072 21.7728072,27.375 20.875,27.375 C19.9771928,27.375 19.25,26.647 19.25,25.75 C19.25,24.853 19.9771928,24.125 20.875,24.125 Z M9.5,20.875 C8.60219281,20.875 7.875,20.1478072 7.875,19.25 L26.5625,17.625 C26.5625,17.625 29,7.77342157 29,7.0625 C29,6.614 28.636,6.25 28.1875,6.25 L7.875,6.25 L7.875,4.625 L8.6875,4.625 C9.136,4.625 9.5,4.261 9.5,3.8125 C9.5,3.364 9.136,3 8.6875,3 L3.8125,3 C3.364,3 3,3.364 3,3.8125 C3,4.261 3.364,4.625 3.8125,4.625 L6.25,4.625 L6.25,19.25 C6.25,21.0448072 7.70519281,22.5 9.5,22.5 L11.125,22.5 L20.875,22.5 L28.1875,22.5 C28.2126928,22.5 28.1875,21.694 28.1875,20.875 L9.5,20.875 Z M7.875,7.875 L27.375,7.875 L25.2974641,16.1852288 L7.875,17.625 L7.875,7.875 Z"
                              />
                            </g>
                          </g>
                        </g>
                      </svg>
                    </p>
                  </div>
                </div>
                <div v-else class="">
                  <svg
                    width="27px"
                    height="26px"
                    viewBox="0 0 27 26"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                  >
                    <g
                      id="COMPONENTS"
                      stroke="none"
                      stroke-width="1"
                      fill="#ffffff"
                      fill-rule="evenodd"
                    >
                      <g
                        id="COMPONENTS/DS/Header/Accessi/Combo-Logged-sticky"
                        transform="translate(-233.000000, -19.000000)"
                        fill="#ffffff"
                      >
                        <g
                          id="ICONS/System/Shopping/Shopping-3"
                          transform="translate(230.500000, 16.000000)"
                        >
                          <path
                            id="Shape"
                            fill="#ffffff"
                            d="M7.875,25.75 C7.875,27.5448072 9.33019281,29 11.125,29 C12.9198072,29 14.375,27.5448072 14.375,25.75 C14.375,23.9551928 12.9198072,22.5 11.125,22.5 C9.33019281,22.5 7.875,23.9551928 7.875,25.75 Z M11.125,24.125 C12.0228072,24.125 12.75,24.8521928 12.75,25.75 C12.75,26.6478072 12.0228072,27.375 11.125,27.375 C10.2271928,27.375 9.5,26.647 9.5,25.75 C9.5,24.853 10.2271928,24.125 11.125,24.125 Z M17.625,25.75 C17.625,27.5448072 19.0801928,29 20.875,29 C22.6698072,29 24.125,27.5448072 24.125,25.75 C24.125,23.9551928 22.6698072,22.5 20.875,22.5 C19.0801928,22.5 17.625,23.9551928 17.625,25.75 Z M20.875,24.125 C21.7728072,24.125 22.5,24.8521928 22.5,25.75 C22.5,26.6478072 21.7728072,27.375 20.875,27.375 C19.9771928,27.375 19.25,26.647 19.25,25.75 C19.25,24.853 19.9771928,24.125 20.875,24.125 Z M9.5,20.875 C8.60219281,20.875 7.875,20.1478072 7.875,19.25 L26.5625,17.625 C26.5625,17.625 29,7.77342157 29,7.0625 C29,6.614 28.636,6.25 28.1875,6.25 L7.875,6.25 L7.875,4.625 L8.6875,4.625 C9.136,4.625 9.5,4.261 9.5,3.8125 C9.5,3.364 9.136,3 8.6875,3 L3.8125,3 C3.364,3 3,3.364 3,3.8125 C3,4.261 3.364,4.625 3.8125,4.625 L6.25,4.625 L6.25,19.25 C6.25,21.0448072 7.70519281,22.5 9.5,22.5 L11.125,22.5 L20.875,22.5 L28.1875,22.5 C28.2126928,22.5 28.1875,21.694 28.1875,20.875 L9.5,20.875 Z M7.875,7.875 L27.375,7.875 L25.2974641,16.1852288 L7.875,17.625 L7.875,7.875 Z"
                          />
                        </g>
                      </g>
                    </g>
                  </svg>

                  <p class="mb-0 fs-14" style="position: relative; top: 4px">
                    {{ $t("cart") }}
                  </p>
                </div>
              </div>

              <div
                v-if="showCart"
                class="content card shadow"
                @mouseleave="showCart = false"
              >
                <!-- <Cart /> -->
                <Cart />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="d-none d-lg-block">
      <MegaMenuWV />
    </div>

    <b-sidebar
      v-model="isSidebarOpen"
      title=""
      shadow
      width="100%"
      z-index="1029"
      no-header
    >
      <div v-if="data" class="px-3 py-2 mt-5">
        <div v-for="(item, i) in data" :key="`mobile_${i}`">
          <DropdownMobileMenu :data="item" />
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
            {{ user ? user.customer.firstName.split(" ") : "Account" }}
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
        <div v-else class="mt-5">
          <UserMenu />
        </div>
      </div>
    </b-sidebar>
  </div>
</template>

<style scoped>
.content {
  position: absolute;
  right: 0px;
  transform: translateY(-3px);
  z-index: 999;
  border-top: 4px solid var(--dark-secondary);
  padding-bottom: 0px;
  background: white;
}

:deep(.b-sidebar-body) {
  background: white;
  border-top: 20px solid var(--dark-secondary);
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
  padding-bottom: 0px;
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

.user-box p,
.cart-box p {
  color: white;
}

.cart-box {
  color: white !important;
}

.user-box:hover {
  background: white;
  border-radius: 10px 10px 0px 0px;
  color: var(--dark-primary);
}
.user-box:hover * {
  color: var(--dark-primary);
}

.user-box:hover g {
  fill: var(--dark-primary);
}

.cart-box:hover {
  background: white;
  border-radius: 10px 10px 0px 0px;
  color: var(--dark-primary);
}
.cart-box:hover * {
  color: var(--dark-primary);
}

.cart-box:hover g path {
  fill: var(--dark-primary);
}

.suggest-voice {
  color: black;
  display: block;
  font-size: 14px;
  text-decoration: none;
}

.suggest-voice:hover {
  background: #fae4e8;
  color: var(--dark-secondary);
}

.suggest-title {
  font-size: 14px;
  color: #2c8982;
}

.shadowed {
  box-shadow: 0 1px 8px 0 rgb(51 51 51 / 20%),
    0 3px 3px -2px rgb(51 51 51 / 12%), 0 3px 4px 0 rgb(51 51 51 / 14%);
}

.btn-search {
  position: absolute;
  top: 18px;
  right: 24px;
  background: white !important;
  border-radius: 8px;
}
</style>
