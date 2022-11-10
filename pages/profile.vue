<template>
  <div class="container-fluid mt-5 pt-5">
    <div class="container-fluid px-md-5">
      <div class="row">
        <div class="col-12 mb-4">
          <nuxt-link class="text-dark-secondary" to="/">Home</nuxt-link>
          <i class="fal fa-chevron-right mx-2"></i>
          {{ $t("profile.myAccount") }}
        </div>
        <div class="col-8">
          <h1 v-if="user">Ciao {{ user.customer.firstName }}</h1>
        </div>
        <div class="col-4 text-right">
          <button
            class="btn text-uppercase text-light-secondary"
            @click="logout"
          >
            {{ $t("profile.logout") }}
            <i class="fal fa-long-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>

    <div class="container-fluid px-md-5" v-if="user">
      <div class="row">
        <div class="col-12">
          <div>
            <b-tabs content-class="mt-3" justified>
              <b-tab
                :title="$t('profile.myOrders')"
                :active="active == 'orders' ? true : false"
              >
                <Orders />
              </b-tab>
              <b-tab
                :title="$t('profile.buyAgain')"
                :active="active == 'buyagain' ? true : false"
              >
                <BuyAgain />
              </b-tab>
              <b-tab
                :title="$t('profile.favorites')"
                :active="active == 'wishlist' ? true : false"
              >
                <FavouritesProducts />
              </b-tab>
              <b-tab
                :title="$t('profile.addresses')"
                :active="active == 'addresses' ? true : false"
              >
                <ShippingAddress />
              </b-tab>
              <!-- <b-tab
                title="Dati di fatturazione"
                :active="active == 'billing' ? true : false"
              ></b-tab> -->
              <b-tab
                :title="$t('profile.accessData')"
                :active="active == 'accessData' ? true : false"
              >
                <AccessData />
              </b-tab>
              <!-- <b-tab
                :title="$t('profile.cards')"
                :active="active == 'cards' ? true : false"
              ></b-tab> -->
            </b-tabs>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  middleware: "auth",
  components: {},
  data() {
    return {
      active: null,
    };
  },
  methods: {
    logout() {
      this.$store.commit("user/setUser", null);
      this.$store.commit("cart/setCart", null);
      this.$router.push("/");
    },
  },
  computed: {
    user() {
      return this.$store.state.user.user;
    },
  },
  created() {
    this.active = this.$route.hash.split("#")[1];
  },
};
</script>

<style scoped>
:deep(.nav-tabs .nav-link) {
  margin-bottom: -1px;
  border: none;
  color: #666;
}

:deep(.nav-tabs) {
  border-bottom: 1px solid #ddd;
}

:deep(.nav-tabs .nav-link.active, .nav-tabs .nav-item.show .nav-link) {
  color: var(--dark-secondary);
  /* font-weight: bold; */
  background-color: #fff;
  border-bottom: 4px solid var(--dark-secondary);
}

:deep(ul.nav.nav-tabs.nav-justified) {
  flex-wrap: nowrap;
}

@media screen and (max-width: 766px) {
  :deep(ul.nav.nav-tabs.nav-justified) {
    flex-wrap: nowrap;
    overflow-x: scroll;
  }
  :deep(.nav-tabs .nav-link) {
    width: 240px;
  }
}
</style>
