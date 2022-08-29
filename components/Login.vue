<template>
  <div class="position-relative">
    <div>
      <button class="btn" @click="show = !show">
        <p class="mb-0">
          <i class="fal fa-user"></i>
        </p>
        <p v-if="user" class="mb-0" style="font-size: 10px">{{ user }}</p>
        <p v-else class="mb-0" style="font-size: 12px">Accedi</p>
      </button>
      <div v-if="show" @mouseleave="show = false" class="content card shadow">
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
</template>

<script>
import LoginForm from "./LoginForm.vue";
import UserMenu from "./UserMenu.vue";
export default {
  components: {
    LoginForm,
    UserMenu,
  },
  watch: {
    $route() {
      this.show = false;
    },
  },
  data() {
    return {
      show: false,
      user: "",
    };
  },
  created() {
    this.$nuxt.$on("login", (e) => {
      this.user = e.customer.firstName;
    });
    this.$nuxt.$on("logout", (e) => {
      this.user = "";
    });
  },
  mounted() {
    if (process.client) {
      const userData = localStorage.getItem("call-me-wine-user");
      if (userData) this.user = JSON.parse(userData).customer.firstName;
    }
  },
};
</script>

<style scoped>
.content {
  position: absolute;
  /* left: -275px; */
  transform: translate(-80px, 20px);
  z-index: 99;
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
