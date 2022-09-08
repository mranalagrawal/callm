<template>
  <div class="container-fluid fixed- bg-white">
    <div class="row align-items-center py-3 px-4">
      <div class="col-12 col-md-2">
        <nuxt-link to="/">
          <img
            src="../assets/images/logo.svg"
            class="img-fluid"
            width="180px"
            alt=""
          />
        </nuxt-link>
      </div>

      <div class="col-12 col-md-7 py-2" style="position: relative">
        <b-form-input
          size="sm"
          class="border border-dark p-4"
          style="border-radius: 8px"
          placeholder="Cosa stai cercando?"
          v-model="search"
        ></b-form-input>
        <b-button
          size="sm"
          class="my-2 my-sm-0 border-0"
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
      </div>
      <div class="col-12 col-md-3">
        <div
          class="d-flex"
          :class="user ? 'justify-content-around' : 'justify-content-end'"
        >
          <button class="btn" v-if="user">
            <i class="fal fa-heart"></i>
            <p class="mb-0">{{ $t("navbar.favorites") }}</p>
          </button>
          <div class="position-relative">
            <div>
              <button class="btn cart-box" @mouseenter="switchToUser()">
                <p class="mb-0">
                  <i class="fal fa-user"></i>
                </p>
                <p v-if="user" class="mb-0">
                  {{ user.customer.firstName }}
                </p>
                <p v-else class="mb-0" style="font-size: 12px">Accedi</p>
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
          <div class="position-relative" v-if="user">
            <div class="">
              <div v-if="1" class="btn cart-box" @mouseenter="switchToCart()">
                <div
                  v-if="cart && cart.lines.edges.length > 0"
                  class="d-flex align-items-center"
                >
                  <div class="text-left">
                    <p class="mb-2" style="font-size: 8px">
                      {{ $t("navbar.cart.total") }}
                    </p>
                    <p class="mb-0 h4">
                      {{ Number(cartTotalAmount).toFixed(0) }}.<span
                        class="small"
                        >{{
                          Number(cartTotalAmount.split(".")[1])
                            .toFixed(2)
                            .split(".")[1]
                        }}</span
                      >
                    </p>
                  </div>
                  <div class="">
                    <p class="mb-0">
                      <span class="totalItems">{{ cart.totalQuantity }}</span>
                      <i class="fal fa-shopping-cart fa-2x"></i>
                    </p>
                  </div>
                </div>
                <div v-else>
                  <p class="mb-0">
                    <i class="fal fa-shopping-cart"></i>
                  </p>
                  <p class="mb-0">Carrello</p>
                </div>
              </div>

              <div
                v-if="showCart"
                @mouseleave="showCart = false"
                class="content card p-3 shadow"
                style="width: 440px"
              >
                <Cart />
                <!-- <button class="btn" @click="onSubmit">Submit</button> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Cart from "./Cart/Cart.vue";
import LoginForm from "./LoginForm.vue";
import UserMenu from "./UserMenu.vue";

export default {
  components: { Cart, LoginForm, UserMenu },
  watch: {
    $route() {
      this.showUser = false;
      this.showCart = false;
    },
  },
  computed: {
    cart() {
      return this.$store.state.cart.cart;
    },
    cartTotalAmount() {
      return this.$store.state.cart.cart.cost.totalAmount.amount;
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
    };
  },
  methods: {
    switchToCart() {
      this.showUser = false;
      this.showCart = true;
    },
    switchToUser() {
      this.showCart = false;
      this.showUser = true;
    },
    startSearch() {
      console.log(this.search);
      const query = { search: this.search };
      this.$router.push({
        path: "search",
        query: query,
      });
      this.search = "";
    },
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
:deep(.btn-secondary) {
  background-color: var(--dark-red) !important;
  border-color: var(--dark-red) !important;
}
:deep(.dropdown-menu) {
  left: -60px;
  border-top: 4px solid var(--dark-red);
  padding-bottom: 0px;
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
  background: #eee;
  border-radius: 10px;
}
.cart-box:hover {
  background: var(--dark-red);
  border-radius: 10px 10px 0px 0px;
}
.cart-box:hover * {
  color: white;
}
</style>
