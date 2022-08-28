<template>
  <div class="container-fluid fixed-top bg-white">
    <div class="row align-items-center py-3 px-4">
      <div class="col-3">
        <nuxt-link to="/">
          <img
            src="../assets/images/logo.svg"
            class="img-fluid"
            width="180px"
            alt=""
          />
        </nuxt-link>
      </div>
      <div class="col-6 py-2" style="position: relative">
        <b-form-input
          size="sm"
          class="border border-dark p-4"
          style="border-radius: 8px"
          placeholder="Cosa stai cercando?"
        ></b-form-input>
        <b-button
          size="sm"
          class="my-2 my-sm-0 border-0"
          type="submit"
          style="
            position: absolute;
            top: 18px;
            right: 30px;
            background: #d94965;
          "
        >
          <i class="fal fa-search"></i>
        </b-button>
      </div>
      <div class="col-3">
        <!-- login -->
        <div class="d-flex justify-content-around">
          <div class="position-relative">
            <div>
              <button class="btn" @mouseenter="switchToUser()">
                <p class="mb-0">
                  <i class="fal fa-user"></i>
                </p>
                <p v-if="user" class="mb-0" style="font-size: 10px">
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
                  <login-form />
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
            <div>
              <button v-if="cart" class="btn" @mouseenter="switchToCart()">
                <div v-if="cart.lines.edges.length > 0">
                  <p class="mb-0">
                    <i class="fas fa-cart-plus text-dark-red"></i>
                  </p>
                  <p class="mb-0" style="font-size: 10px">
                    {{ Number(cart.cost.totalAmount.amount).toFixed(2) }}
                  </p>
                </div>
                <div v-else>
                  <p class="mb-0">
                    <i class="fal fa-shopping-cart"></i>
                  </p>
                  <p class="mb-0" style="font-size: 10px">Empty</p>
                </div>
              </button>
              <div v-else>Vuoto</div>
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
import Login from "./Login.vue";
import Cart from "./Cart/Cart.vue";
import LoginForm from "./LoginForm.vue";
import UserMenu from "./UserMenu.vue";

export default {
  components: { Login, Cart, LoginForm, UserMenu },
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
    user() {
      return this.$store.state.user.user;
    },
  },
  data() {
    return {
      showUser: false,
      showCart: false,
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
  },
};
</script>

<style scoped>
.content {
  position: absolute;
  right: 0px;
  transform: translateY(20px);
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
</style>
