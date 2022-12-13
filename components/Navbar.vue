<template>
  <div ref="navbar" class="container-fluid bg-white fixed-top">
    <div class="row align-items-center py-md-3 px-lg-5">
      <div
        class="col-12 col-lg-3 px-lg-2 bg-white"
        style="position: relative; z-index: 1040"
      >
        <div class="row align-items-center">
          <button class="btn d-lg-none" @click="toggleSidebar">
            <VueSvgIcon :data="isMobileMenuOpen ? closeIcon : menuIcon" width="32" height="32"/>
          </button>

          <div class="col-4 col-lg-10 p-0">
            <nuxt-link class="d-flex cmw-max-w-250px" :to="localePath('/')">
              <VueSvgIcon :data="logo" width="100%" height="auto" original/>
            </nuxt-link>
          </div>

          <div class="ml-auto d-lg-none">
            <button class="btn" @click="toggleMobileLogin">
              <VueSvgIcon :data="userIcon" width="36" height="36"/>
            </button>
            <nuxt-link :to="localePath('/cart')" class="btn">
              <span class="totalItems">{{ cartTotalQuantity }} </span>
              <VueSvgIcon :data="cartIcon" width="32px" height="32px"/>
            </nuxt-link>
          </div>
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
          <VueSvgIcon :data="searchIcon" color="white" width="22" height="28"/>
        </b-button>
        <div
          @mouseleave="search = ''"
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
              <span v-html="bolder(item.name)"></span>
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
                <span v-html="bolder(item.name)"></span>
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
                <span v-html="bolder(item.name)"></span>
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
                <span v-html="bolder(item.name)"></span>
              </nuxt-link>
            </div>
          </div>
        </div>
        <b-form-input
          type="search"
          size="sm"
          class="p-4"
          style="border-radius: 12px; border: 1px solid #8c8d8e"
          :placeholder="$t('navbar.search')"
          v-model="search"
          @input="suggest"
        ></b-form-input>
      </div>

      <div class="d-none d-lg-block col-lg-3 p-0">
        <HeaderUserActions/>
      </div>
    </div>
    <div class="d-none d-lg-block">
      <MegaMenu/>
    </div>

    <b-sidebar
      title=""
      shadow
      width="100%"
      z-index="1029"
      no-header
      v-model="isSidebarOpen"
    >
      <div v-if="data" class="px-3 py-2 mt-5">
        <div v-for="(item, i) in data" :key="`mobile_${i}`">
          <dropdown-mobile-menu :data="item"/>
        </div>
      </div>
    </b-sidebar>

    <b-sidebar
      title=""
      shadow
      width="100%"
      z-index="2089"
      no-header
      v-model="mobileLogin"
    >
      <div class="">
        <div
          class="p-3 d-flex justify-content-between align-items-center shadow"
          @click="toggleMobileLogin"
        >
          <i class="fal fa-chevron-left fa-2x text-light-secondary"></i>
          <p class="mb-0">
            {{ user ? user.customer.firstName.split(" ") : "Account" }}
          </p>
          <i class="fal fa-times fa-2x text-light-secondary"></i>
        </div>
        <div v-if="!user">
          <h3 class="px-3 text-center text-dark-primary mt-5 font-weight-bold">
            {{ $t("navbar.user.signIn") }}
          </h3>
          <div class="px-3">
            <login-form width="340px"/>
          </div>
          <div class="bg-light p-3 text-center">
            {{ $t("navbar.user.notRegisteredYet") }}
            <nuxt-link
              to="/login"
              class="text-uppercase text-light-secondary"
            >{{ $t("navbar.user.register") }}
            </nuxt-link
            >
          </div>
        </div>
        <div v-else class="mt-5">
          <UserMenu/>
        </div>
      </div>
    </b-sidebar>
  </div>
</template>

<script>
import Cart from "./Cart/Cart.vue";
import logo from '~/assets/svg/logo-call-me-wine.svg'
import cartIcon from '~/assets/svg/cart.svg'
import closeIcon from '~/assets/svg/close.svg'
import menuIcon from '~/assets/svg/menu.svg'
import userIcon from '~/assets/svg/user.svg'
import searchIcon from '~/assets/svg/search.svg'
import heartIcon from '~/assets/svg/heart.svg'
import LoginForm from "./LoginForm.vue";
import DropdownMobileMenu from "./UI/DropdownMobileMenu.vue";
import UserMenu from "./UserMenu.vue";
import {mapGetters, mapState} from "vuex";
import debounce from "lodash.debounce";

export default {
  components: {LoginForm, UserMenu, DropdownMobileMenu, Cart},
  watch: {
    $route() {
      this.showUser = false;
      this.showCart = false;
      this.search = null;
      this.isSidebarOpen = false;
    },
    cartTotalAmount(total) {
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
    },
    navbarHeight() {
      this.setHeaderSize()
    }
  },
  computed: {
    // Todo: for some reason this is not updating... investigate
    /*...mapState({
      megaMenuHeight: 'headerSize/megaMenuHeight',
      navbarHeight: 'headerSize/navbarHeight',
    }),*/
    ...mapGetters({
      getTopBarHeight: 'headerSize/getTopBarHeight',
      cartTotalAmount: 'userCart/getCartTotalAmount',
      cartTotalQuantity: 'userCart/cartTotalQuantity',
    }),
    megaMenuHeight(state) {
      return this.$store.state.headerSize.megaMenuHeight;
    },
    navbarHeight(state) {
      // return state["headerSize/navbarHeight"]
      return this.$store.state.headerSize.navbarHeight;
    },
    user() {
      return this.$store.state.user.user;
    },
  },
  data() {
    return {
      logo,
      cartIcon,
      closeIcon,
      menuIcon,
      userIcon,
      searchIcon,
      heartIcon,
      showUser: false,
      showCart: false,
      search: "",
      visible: false,
      data: null,
      isMobileMenuOpen: false,
      isSidebarOpen: false,
      mobileLogin: false,
    };
  },
  methods: {
    resizeListener: debounce(function () {
      this.$nextTick(() =>
        this.$store.commit('headerSize/setNavbarHeight', this.$refs.navbar.getBoundingClientRect().height)
      )
    }, 400),
    setHeaderSize() {
      const doc = document.querySelector(':root');
      doc && doc.style.setProperty('--cmw-header-height', `${this.navbarHeight - this.megaMenuHeight}px`)
      doc && doc.style.setProperty('--cmw-top-banner-height', this.getTopBarHeight)
    },
    bolder(text) {
      let regexValue = new RegExp(`(${this.search})`, "ig");
      let newStr = text.replace(
        regexValue,
        "<span class='font-weight-bold'>$1</span>"
      );
      return newStr;
    },
    toggleMobileLogin() {
      this.mobileLogin = !this.mobileLogin;
    },
    toggleSidebar() {
      this.isMobileMenuOpen = this.isSidebarOpen = !this.isSidebarOpen;
    },
    showSidebar() {
      this.$refs["sidebar"].show();
    },
    hideSidebar() {
      this.$refs["sidebar"].hide();
    },
    async suggest() {
      const stores = {
        CMW: 1,
        CMW_UK: 2,
        WILDVIGNERON: 3,
      };

      const activeStoreID = stores[this.$config.STORE];

      const elastic_url = this.$config.ELASTIC_URL;


      if (this.search && this.search.length >= 3) {
        const result = await fetch(
          elastic_url +
          "autocomplete/search/?stores=" +
          activeStoreID +
          "&locale=" +
          this.$i18n.locale +
          "&search=" +
          this.search
        );
        const resultJSON = await result.json();
        this.data = resultJSON;
      }
    },
    switchToCart() {
      this.showUser = false;
      this.showCart = true;
    },
    switchToUser() {
      this.showCart = false;
      this.showUser = true;
    },
    startSearch() {
      const query = {search: this.search || ""};
      this.$router.push({
        path: "/catalog",
        query: query,
      });
      this.search = "";
    },
  },
  async fetch() {
    let lang = "";
    if (this.$i18n.locale == "en") {
      lang = "en-gb";
    } else {
      lang = "it-it";
    }
    // TODO component access!
    let response = await this.$prismic.api.getSingle("mega-menu-test", {
      lang: lang,
    });
    let data = response.data.body;

    let mapped = data
      .map((firstLevel) => {
        const secondLevelNames = [
          ...new Set(firstLevel.items.map((el) => el.secondlevelname)),
        ];
        const secondLevels = firstLevel.items.map((el) => {
          return {
            name: el.secondlevelname,
            position: el.second_level_position,
          };
        });
        const secondLevelsSet = [
          ...new Set(secondLevels.map((el) => JSON.stringify(el))),
        ]
          .map((el) => JSON.parse(el))
          .sort((a, b) => a.position - b.position);

        const items = secondLevelsSet.map((el) => {
          let temp = firstLevel.items
            .filter((x) => x.secondlevelname === el.name)
            .sort((a, b) => a.third_level_position - b.third_level_position);
          return {...el, items: temp};
        });

        return {
          name: firstLevel.primary.group_label,
          link: firstLevel.primary.first_level_link,
          position: firstLevel.primary.first_level_position,
          items,
        };
      })
      .sort((a, b) => a.position - b.position);

    this.data = mapped;
  },
  mounted() {
    window.addEventListener('resize', this.resizeListener)
    this.$nextTick(() => {
      this.resizeListener()
      this.setHeaderSize()
    })
  },
  destroyed() {
    window.removeEventListener('resize', this.resizeListener)
  }
};
</script>

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

.user-box:hover {
  background: var(--darker-secondary);
  border-radius: 10px 10px 0px 0px;
}

.user-box:hover * {
  color: white;
}

.user-box:hover g {
  fill: white;
}

.cart-box:hover {
  background: var(--darker-secondary);
  border-radius: 10px 10px 0px 0px;
}

.cart-box:hover * {
  color: white;
}

.cart-box:hover g path {
  fill: white;
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
</style>
