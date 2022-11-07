<template>
  <div class="container-fluid min-vh-100 mt-5">
    <div class="row h-100 mt-4 d-lg-none">
      <div class="col-12 col-lg-6 px-0 px-lg-3" v-if="!registerIsVisible">
        <h3 class="text-center">
          {{ $t("navbar.user.alreadyRegistered") }}
        </h3>
        <login-form width="90%" />
        <div class="bg-light py-3 d-lg-none">
          <p class="text-center mb-0" @click="registerIsVisible = true">
            {{ $t("navbar.user.notRegisteredYet") }}
            <strong class="text-light-red text-uppercase">{{
              $t("navbar.user.register")
            }}</strong>
          </p>
        </div>
      </div>
      <div class="col-12 col-lg-6" v-else>
        <h3 class="text-center">{{ $t("createYourAccount") }}</h3>
        <RegisterBox />
      </div>
    </div>
    <div class="row h-100 mt-4 d-none d-lg-flex">
      <div class="col-12 col-lg-6 px-0 px-lg-3">
        <h3 class="text-center">
          {{ $t("navbar.user.alreadyRegistered") }}
        </h3>
        <login-form width="90%" />
        <div class="bg-light py-3 d-lg-none">
          <p class="text-center mb-0">
            {{ $t("navbar.user.notRegisteredYet") }}
            <strong class="text-light-red text-uppercase">{{
              $t("navbar.user.register")
            }}</strong>
          </p>
        </div>
      </div>
      <div class="col-12 col-lg-6">
        <h3 class="text-center">{{ $t("createYourAccount") }}</h3>
        <RegisterBox />
      </div>
    </div>
  </div>
</template>

<script>
import LoginForm from "../components/LoginForm.vue";
import RegisterBox from "../components/RegisterBox.vue";
export default {
  components: {
    RegisterBox,
    LoginForm,
  },
  data() {
    return {
      registerIsVisible: false,
    };
  },
  methods: {
    switchTab() {
      console.log("e");
    },
  },
};
</script>
