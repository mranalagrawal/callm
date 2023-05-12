<script>
import LoginForm from './LoginForm.vue'
import UserMenu from './UserMenu.vue'

export default {
  components: {
    LoginForm,
    UserMenu,
  },
  data() {
    return {
      show: false,
      user: '',
    }
  },
  watch: {
    $route() {
      this.show = false
    },
  },
  created() {
    this.$nuxt.$on('login', (e) => {
      this.user = e.customer.firstName
    })
    this.$nuxt.$on('logout', (e) => {
      this.user = ''
    })
  },
  mounted() {
    if (process.client) {
      const userData = localStorage.getItem('call-me-wine-user')
      if (userData)
        this.user = JSON.parse(userData).customer.firstName
    }
  },
}
</script>

<template>
  <div class="position-relative">
    <div>
      <button class="btn" @click="show = !show">
        <p class="mb-0">
          <i class="fal fa-user" />
        </p>
        <p v-if="user" class="mb-0" style="font-size: 10px">
          {{ user }}
        </p>
        <p v-else class="mb-0" style="font-size: 12px">
          Accedi
        </p>
      </button>
      <div v-if="show" class="content card shadow" @mouseleave="show = false">
        <div v-if="!user">
          <LoginForm />
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
          <UserMenu wid="340px" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.content {
  position: absolute;
  /* left: -275px; */
  transform: translate(-80px, 20px);
  z-index: 99;
  border-top: 4px solid var(--dart-secondary);
  padding-bottom: 0px;
  background: white;
}
:deep(.dropdown-toggle::after) {
  display: none;
}
:deep(.btn-secondary) {
  background-color: var(--dart-secondary) !important;
  border-color: var(--dart-secondary) !important;
}
:deep(.dropdown-menu) {
  left: -60px;
  border-top: 4px solid var(--dart-secondary);
  padding-bottom: 0px;
}
</style>
