<template>
  <div class="container-fluid vh-100">
    <div class="row h-100 mt-4">
      <div class="col-12 col-lg-6">
        <h3 class="text-center">Ho già un account</h3>
        <login-form width="400px" />
      </div>
      <div class="col-12 col-lg-6">
        <h3 class="text-center">Crea il tuo account</h3>
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
  methods: {},
};
</script>
