<template>
  <div class="container-fluid fixed- bg-white">
    <div class="row align-items-center py-md-3 px-md-5">
      <div
        class="col-12 col-md-3 px-0 px-md-2 bg-white"
        style="position: relative; z-index: 1040"
      >
        <button class="btn d-md-none" @click="toggleSidebar">
          <i class="fal" :class="isMobileMenuOpen ? 'fa-times' : 'fa-bars'"></i>
        </button>

        <nuxt-link :to="localePath('/')">
          <img
            src="../assets/images/logo.svg"
            class="img-fluid d-md-none"
            width="80px"
            alt=""
          />
          <img
            src="../assets/images/logo.svg"
            class="img-fluid d-none d-md-block"
            width="270px"
            alt=""
          />
        </nuxt-link>
        <div class="d-inline-block float-right d-md-none">
          <button class="btn">
            <i class="fal fa-user"></i>
          </button>
          <button class="btn">
            <i class="fal fa-shopping-cart"></i>
          </button>
        </div>
      </div>

      <div class="col-12 col-md-6 py-2" style="position: relative">
        <b-button
          size="sm"
          class="border-0 text-white"
          type="button"
          style="
            position: absolute;
            top: 18px;
            right: 30px;
            background: #d94965;
          "
          @click="startSearch"
        >
          <i class="fal fa-search"></i>
        </b-button>
        <div
          v-if="search && data"
          class="bg-white px-3 shadow"
          style="
            position: absolute;
            top: 70px;
            left: 0px;
            z-index: 999;
            width: 100%;
            height: 50vh;
            overflow-y: scroll;
            border-radius: 10px;
          "
        >
          <!-- {{ data }} -->
          <div v-if="data" class="pt-3">
            <div v-if="data.products && data.products.length > 0">
              <p class="font-weight-bold mb-0">Prodotti</p>
              <nuxt-link
                v-for="item in data.products"
                :key="item.id"
                class="suggest-voice p-2 mb-0"
                :to="`/${item.handle}-P${item.id}`"
              >
                {{ item.name }}
              </nuxt-link>
            </div>
            <div v-if="data.brands && data.brands.length > 0">
              <p class="font-weight-bold mb-0">Produttori</p>
              <nuxt-link
                v-for="item in data.brands"
                :key="item.id"
                class="suggest-voice p-2 mb-0"
                :to="`/winery/${item.handle}-B${item.id}`"
              >
                {{ item.name }}
              </nuxt-link>
            </div>
            <div v-if="data.categories && data.categories.length > 0">
              <p class="font-weight-bold mb-0">Tipologia</p>
              <p
                v-for="item in data.categories"
                :key="item.id"
                class="suggest-voice p-2 mb-0"
              >
                {{ item.name }}
              </p>
            </div>
          </div>
        </div>
        <b-form-input
          type="search"
          size="sm"
          class="p-4"
          style="border-radius: 12px; border: 1px solid #8c8d8e"
          placeholder="Cosa stai cercando?"
          v-model="search"
          @input="suggest"
        ></b-form-input>
      </div>
      <div class="d-none d-md-block col-md-3">
        <div
          class="d-flex"
          :class="user ? 'justify-content-around' : 'justify-content-end'"
        >
          <div class="btn" v-if="user">
            <nuxt-link
              :to="localePath('/wishlist')"
              class="text-decoration-none text-dark"
            >
              <i class="fal fa-heart"></i>
              <p class="mb-0">{{ $t("navbar.favorites") }}</p>
            </nuxt-link>
          </div>
          <div class="position-relative">
            <div>
              <button class="btn cart-box" @mouseenter="switchToUser()">
                <p class="mb-0">
                  <i class="fal fa-user" style="font-size: 28px"></i>
                </p>
                <p v-if="user" class="mb-0">
                  {{ user.customer.firstName }}
                </p>
                <p v-else class="mb-0">Accedi</p>
              </button>

              <div
                v-if="showUser"
                @mouseleave="showUser = false"
                class="content card shadow"
              >
                <div v-if="!user">
                  <login-form width="340px" />
                  <div class="bg-light p-3 text-center">
                    Non hai ancora un profilo?
                    <nuxt-link to="/login" class="text-uppercase text-light-red"
                      >Registrati</nuxt-link
                    >
                  </div>
                </div>
                <div v-else>
                  <user-menu />
                </div>
              </div>
            </div>
          </div>
          <!-- Cart -->
          <div class="position-relative" v-if="true">
            <div class="">
              <div
                v-if="1"
                class="btn cart-box pb-1"
                @mouseenter="switchToCart()"
              >
                <div
                  v-if="cart && cart.lines.edges.length > 0"
                  class="d-flex align-items-center"
                >
                  <div class="text-left">
                    <p class="pr-1 mb-2" style="font-size: 11px">
                      {{ $t("navbar.cart.total") }}
                    </p>
                    {{ Number(cartTotalAmount).toFixed(2) }}
                  </div>
                  <div class="">
                    <p class="mb-0">
                      <span class="totalItems">{{ cart.totalQuantity }}</span>
                      <i
                        class="fal fa-shopping-cart"
                        style="font-size: 28px"
                      ></i>
                    </p>
                  </div>
                </div>
                <div v-else>
                  <p class="mb-0">
                    <i class="fal fa-shopping-cart" style="font-size: 28px"></i>
                  </p>
                  <p class="mb-0">Carrello</p>
                </div>
              </div>

              <div
                v-if="showCart"
                @mouseleave="showCart = false"
                class="content card p-3 shadow"
                style="width: 540px"
              >
                <Cart />
                <!-- <button class="btn" @click="onSubmit">Submit</button> -->
              </div>
            </div>
          </div>
        </div>
      </div>
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
        qui
        <div v-for="(item, i) in data" :key="`mobile_${i}`">
          <dropdown-mobile-menu :data="item" />
        </div>
      </div>
    </b-sidebar>
    <!-- <b-modal
      ref="modalFilter"
      size="xl"
      scrollable
      centered
      hide-footer
      title=""
    >
    </b-modal> -->
  </div>
</template>

<script>
import Cart from "./Cart/Cart.vue";
import LoginForm from "./LoginForm.vue";
import DropdownMobileMenu from "./UI/DropdownMobileMenu.vue";
import UserMenu from "./UserMenu.vue";

export default {
  components: { Cart, LoginForm, UserMenu, DropdownMobileMenu },
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
  },
  computed: {
    cart() {
      return this.$store.state.cart.cart;
    },
    cartTotalAmount() {
      if (this.$store.state.cart.cart) {
        return this.$store.state.cart.cart.cost.totalAmount.amount;
      } else {
        return 0;
      }
    },
    user() {
      return this.$store.state.user.user;
    },
  },
  data() {
    return {
      showUser: false,
      showCart: false,
      search: "",
      visible: false,
      data: null,
      isMobileMenuOpen: false,
      isSidebarOpen: false,
      data: null,
    };
  },
  methods: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    showSidebar() {
      this.$refs["sidebar"].show();
    },
    hideSidebar() {
      this.$refs["sidebar"].hide();
    },
    async suggest() {
      if (this.search && this.search.length > 3) {
        const result = await fetch(
          "https://callmewine-api.dojo.sh/api/autocomplete/search/?search=" +
            this.search
        );
        const resultJSON = await result.json();
        this.data = resultJSON;
        /* if (resultJSON.categories.length > 0) {
          this.categories = resultJSON.categories;
        }
        if (resultJSON.brands.length > 0) {
          this.brands = resultJSON.brands;
        }
        if (resultJSON.products.length > 0) {
          this.products = resultJSON.products;
        } */
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
      const query = { search: this.search };
      this.$router.push({
        path: "/search",
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
          return { ...el, items: temp };
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
};
</script>

<style scoped>
.content {
  position: absolute;
  right: 0px;
  transform: translateY(-3px);
  z-index: 999;
  border-top: 4px solid var(--dark-red);
  padding-bottom: 0px;
  background: white;
}
:deep(.dropdown-toggle::after) {
  display: none;
}
/* :deep(.btn-secondary) {
  background-color: var(--dark-red) !important;
  border-color: var(--dark-red) !important;
} */
:deep(.dropdown-menu) {
  left: -60px;
  border-top: 4px solid var(--dark-red);
  padding-bottom: 0px;
}

:deep(.b-sidebar) {
  padding-top: 48px !important;
}
.totalItems {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--light-red);
  color: white;
  position: absolute;
  top: 5px;
  right: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
}

.cart-box {
  /* background: #eee; */
  border-radius: 10px;
  height: 64px !important;
}
.cart-box:hover {
  background: var(--dark-red);
  border-radius: 10px 10px 0px 0px;
}
.cart-box:hover * {
  color: white;
}

.suggest-voice {
  color: black;
  display: block;
}

.suggest-voice:hover {
  background: #fae4e8;
  color: var(--dark-red);
}
</style>
