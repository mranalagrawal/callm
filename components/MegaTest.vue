<template>
  <div class="container-fluid position-relative" @mouseleave="onTab(null)">
    <!-- <div v-for="(item, i) in document" :key="i">
      <p>{{ item }}</p>
    </div> -->

    <div class="row pb-3">
      <div
        class="col text-center"
        v-for="(item, i) in data"
        @mouseenter="onTab(item)"
        :key="i"
      >
        {{ item.title }}
        <!-- <nuxt-link :to="`/${item.title.toLowerCase()}`">{{
          item.title
        }}</nuxt-link> -->
      </div>
    </div>
    <div
      v-if="selectedItem"
      class="row bg-white w-100 position-absolute shadow"
      style="min-height: 300px; z-index: 10"
      @mouseleave="onTab(null)"
    >
      <div
        v-for="item in selectedItem.items"
        :key="item.id"
        class="col-3 pt-3"
        style="border-right: 1px solid #ddd"
      >
        <p class="font-weight-bold">{{ item.title }}</p>
        <p v-for="el in item.items" :key="el.id">
          <nuxt-link :to="`/${el.url.split('.com/')[1]}`">{{
            el.title
          }}</nuxt-link>
        </p>
      </div>
    </div>
  </div>
</template>

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
        console.log("ok");
        this.selectedItem = item;
      } else {
        console.log("else");
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

        let r = menu.find((el) => {
          console.log(
            el.items.some((x) => x.title === "Marketing"),
            "qui"
          );
          return el.items.some((x) => x.title === "Marketing");
          /* console.log(
            el.items.some((x) => x.title === "Marketing"),
            "SS"
          ); */
        });

        console.log(r);
        console.log(menu.indexOf(r));
        return menu;
      });
  },
};
</script>
