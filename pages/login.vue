<template>
  <div class="container-fluid vh-100">
    <div class="row h-100">
      <div class="col-12 col-lg-6">
        <LoginBox />
      </div>
      <div class="col-12 col-lg-6">
        <RegisterBox />
      </div>
    </div>
  </div>
</template>

<script>
import LoginBox from "../components/LoginBox.vue";
import RegisterBox from "../components/RegisterBox.vue";
export default {
  components: {
    LoginBox,
    RegisterBox,
  },
  methods: {},
};
</script>
