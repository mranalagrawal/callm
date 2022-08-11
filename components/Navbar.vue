<template>
  <div class="container-fluid">
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
          <b-icon icon="search" aria-hidden="true" style=""></b-icon>
        </b-button>
      </div>
      <div class="col-3">
        <div class="d-flex justify-content-around">
          <Login />
          <Cart />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Login from "./Login.vue";
import Cart from "./Cart.vue";

export default {
  components: { Login, Cart },
};
</script>
