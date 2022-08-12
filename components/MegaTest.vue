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
        <!-- <span class="menu-link">{{ item.title }}</span> -->

        <nuxt-link :to="`/${item.url.split('.com/')[1]}`" class="menu-link">{{
          item.title
        }}</nuxt-link>
      </div>
    </div>
    <div
      v-if="selectedItem"
      class="row bg-white w-100 position-absolute shadow-menu"
      style="min-height: 300px; z-index: 10"
      @mouseleave="onTab(null)"
    >
      <div
        v-for="item in selectedItem.items"
        :key="item.id"
        class="col pt-3"
        style="border-right: 1px solid #ddd"
      >
        <p class="text-dark-green">{{ item.title }}</p>
        <p v-for="el in item.items" :key="el.id">
          <nuxt-link
            class="menu-link small"
            :to="`/${el.url.split('.com/')[1]}`"
            >{{ el.title }}</nuxt-link
          >
        </p>
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
import { queryByCollection } from "../utilities/productQueries";

export default {
  data: () => ({
    selectedItem: "",
    selectedContent: null,
    data: null,
    document: null,
  }),
  watch: {
    $route() {
      this.selectedItem = "";
    },
  },
  methods: {
    onTab(item) {
      console.log(item);
      if (item) {
        this.selectedItem = item;
      } else {
        this.selectedItem = null;
      }
    },
  },

  async fetch() {
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
    this.data = await fetch(GRAPHQL_URL, GRAPHQL_BODY())
      .then((res) => res.json())
      .then((res) => {
        const menu = res.data.menu.items;
        console.log(menu, "menu");

        let elementoMarketing = menu.find((el) => {
          return el.items.some((x) => x.title === "Marketing");
        });

        console.log(elementoMarketing, "elemento");

        let indexOfElementoMarketing = menu.indexOf(elementoMarketing);
        console.log(indexOfElementoMarketing, "index");

        let elementoDaSwitchare = menu[indexOfElementoMarketing].items.find(
          (x) => x.title === "Marketing"
        );
        console.log(elementoDaSwitchare, "elementoDaSwitchare");

        return menu;
      });
  },
};
</script>
