<template>
  <div class="px-4 pt-3 py-2" style="width: 340px">
    <p class="mb-3 menu-link">I miei ordini</p>
    <p class="mb-3 menu-link">Compra di nuovo</p>
    <p class="mb-3 menu-link">I miei preferiti</p>
    <p class="mb-3 menu-link">Indirizzo di spedizioni</p>
    <p class="mb-3 menu-link">Dati di fatturazione</p>
    <p class="mb-3 menu-link">Accessi consensi</p>
    <p class="mb-3 menu-link">Carte salvate</p>
    <div class="mt-5">
      <button @click="logout" class="btn btn-outline-light-red w-100">
        Esci
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        email: "",
        password: "",
        remember: false,
      },
    };
  },
  methods: {
    logout() {
      this.$store.commit("user/setUser", null);
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
:deep(form) {
  width: 340px;
}
.menu-link:hover {
  color: var(--dark-red);
  font-weight: bold;
}
</style>
