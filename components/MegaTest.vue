<template>
  <div class="container-fluid position-relative" @mouseleave="onTab(null)">
    <!-- <div v-for="(item, i) in document" :key="i">
      <p>{{ item }}</p>
    </div> -->

    <div class="row pb-3 shadow-menu">
      <div
        class="col text-center"
        v-for="(item, i) in data"
        @mouseenter="onTab(item)"
        :key="i"
      >
        <nuxt-link :to="`/${item.url.split('.com/')[1]}`" class="menu-link">{{
          item.title
        }}</nuxt-link>
      </div>
      <div class="col text-center" @mouseenter="onTab(promotions)">
        <span class="text-light-red"
          ><i class="fas fa-tags me-3"></i> Promozioni</span
        >
      </div>
    </div>
    <div v-if="selectedItem" @mouseleave="onTab(null)">
      <div
        v-if="!Array.isArray(selectedItem)"
        class="row bg-white w-100 position-absolute shadow-menu"
        style="min-height: 300px; z-index: 100"
      >
        <div
          v-for="item in selectedItem.items"
          :key="item.id"
          class="col pt-3"
          style="border-right: 1px solid #ddd"
        >
          <div v-if="item.title !== 'Marketing'">
            <p class="text-dark-green">{{ item.title }}</p>
            <p v-for="el in item.items" :key="el.id">
              <nuxt-link
                class="menu-link small"
                :to="`/${el.url.split('.com/')[1]}`"
                >{{ el.title }}</nuxt-link
              >
            </p>
          </div>
          <div v-else>
            <div v-if="marketing">
              <div
                v-for="(mkt, i) in marketing.filter(
                  (el) => el.section == item.url.split('.com/')[1]
                )[0].items"
                :key="i"
                class="mb-3 shadow d-flex align-items-center"
                style="max-width: 400px; border-radius: 10px"
              >
                <img
                  :src="mkt.image.url"
                  alt=""
                  width="48px"
                  height="48px"
                  style="object-fit: cover; border-radius: 10px 0px 0px 10px"
                />

                <p class="text-light-red mb-0 pl-2">{{ mkt.text }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-else
        class="row bg-white w-100 position-absolute shadow-menu pt-5"
        style="min-height: 200px; z-index: 100"
      >
        <div
          class="col-12 col-md-6 col-lg-3 my-2"
          v-for="promotion in promotions"
          :key="promotion.id"
        >
          <div class="card shadow">
            <div
              class="row no-gutters align-items-center"
              style="height: 100px"
            >
              <div class="col-4">
                <img
                  :src="promotion.items[0].image.url"
                  alt="..."
                  width="100px"
                  height="100px"
                  style="object-fit: cover; border-radius: 0.25rem 0 0 0.25rem"
                />
              </div>
              <div class="col-8">
                <nuxt-link
                  :to="promotion.items[0].link"
                  class="font-weight-bold text-dark-red mb-0"
                >
                  {{ promotion.items[0].text }}
                </nuxt-link>
                <!-- <p class="font-weight-bold text-dark-red mb-0">
                  {{ promotion.items[0].text }}
                </p> -->
              </div>
            </div>
          </div>
          <!-- {{ promotion }} -->
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shadow-menu {
  box-shadow: 0 0.5rem 0.75rem rgb(0 0 0 / 15%) !important;
  border-bottom: 1px solid #ddd;
}
.menu-link {
  color: black;
  text-decoration: none;
}
.menu-link:hover {
  color: var(--dark-red);
  text-decoration: none;
}
</style>

<script>
export default {
  data: () => ({
    selectedItem: "",
    selectedContent: null,
    data: null,
    promotions: null,
    marketing: null,
  }),
  watch: {
    $route() {
      this.selectedItem = "";
    },
  },
  methods: {
    onTab(item) {
      if (item) {
        this.selectedItem = item;
      } else {
        this.selectedItem = null;
      }
    },
    async getMenu() {
      const GRAPHQL_URL = this.$config.DOMAIN;

      const productQuery = `query {
      menu(handle:"main-menu"){
        items{
          id
          title
          url
          items {
            title
            url
            items{
              title
              url
            }
          }
        }
      }
    }`;

      const GRAPHQL_BODY = () => {
        return {
          async: true,
          crossDomain: true,
          method: "POST",
          headers: {
            "X-Shopify-Storefront-Access-Token":
              this.$config.STOREFRONT_ACCESS_TOKEN,
            "Content-Type": "application/graphql",
          },
          body: productQuery,
        };
      };
      let data = await fetch(GRAPHQL_URL, GRAPHQL_BODY())
        .then((res) => res.json())
        .then((res) => {
          const menu = res.data.menu.items;

          return menu;
        });

      return data;
    },
    async getPromo() {
      let res = await this.$prismic.api.getSingle("promo-menu");
      let promo = await res.data.body.map((el) => {
        return {
          id: el.id,
          items: el.items,
        };
      });

      return promo;
    },
    async getMarketing() {
      let res = await this.$prismic.api.getSingle("marketing");
      let promo = await res.data.body.map((el) => {
        return {
          section: el.primary.section,
          items: el.items,
        };
      });

      return promo;
    },
  },

  async fetch() {
    this.data = await this.getMenu();
    this.promotions = await this.getPromo();
    this.marketing = await this.getMarketing();
  },

  /* async fetch() {
    
      await this.$prismic.api.query(
        this.$prismic.predicates.at("document.type", "partner")
      )
    ).results;
  }, */
};
</script>
