<script lang="ts">
import { defineComponent, onMounted, ref, useContext } from '@nuxtjs/composition-api'

export default defineComponent({
  layout(context) {
    return context.$config.STORE
  },
  setup() {
    const { $cmwGtmUtils } = useContext()
    const registerIsVisible = ref(false)

    onMounted(() => {
      process.browser && $cmwGtmUtils.pushPage('page')
    })

    return { registerIsVisible }
  },
})
</script>

<template>
  <div class="container-fluid min-vh-100">
    <div class="row h-100 d-lg-none">
      <div
        v-if="!registerIsVisible"
        class="col-12 col-lg-6 px-0 px-lg-3"
      >
        <h3 class="text-center">
          {{ $t("navbar.user.alreadyRegistered") }}
        </h3>
        <LoginForm width="90%" />
        <div class="bg-light py-3 d-lg-none">
          <p
            class="text-center mb-0"
            @click="registerIsVisible = true"
          >
            {{ $t("navbar.user.notRegisteredYet") }}
            <strong class="text-light-secondary text-uppercase">{{
              $t("navbar.user.register")
            }}</strong>
          </p>
        </div>
      </div>
      <div
        v-else
        class="col-12 col-lg-6"
      >
        <h3 class="text-center">
          {{ $t("createYourAccount") }}
        </h3>
        <RegisterBox />
      </div>
    </div>
    <div class="row h-100 d-none d-lg-flex">
      <div class="col-12 col-lg-6 px-0 px-lg-3 cmw-pt-20">
        <h3 class="text-center">
          {{ $t("navbar.user.alreadyRegistered") }}
        </h3>
        <LoginForm width="90%" />
        <div class="bg-light py-3 d-lg-none">
          <p class="text-center mb-0">
            {{ $t("navbar.user.notRegisteredYet") }}
            <strong class="text-light-secondary text-uppercase">{{
              $t("navbar.user.register")
            }}</strong>
          </p>
        </div>
      </div>
      <div class="col-12 col-lg-6 bg-light cmw-py-20">
        <h3 class="text-center">
          {{ $t("createYourAccount") }}
        </h3>
        <RegisterBox />
      </div>
    </div>
  </div>
</template>
