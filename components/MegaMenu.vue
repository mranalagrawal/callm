<template>
  <div class="container-fluid position-relative" @mouseleave="onTab(null)">
    <!-- <div v-for="(item, i) in document" :key="i">
      <p>{{ item }}</p>
    </div> -->

    <div class="row pb-3">
      <div
        class="col text-center"
        v-for="(item, i) in document"
        @mouseenter="onTab(item)"
        :key="i"
      >
        {{ item.first_level }}
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
        v-for="second_level in selectedItem.second_level"
        :key="second_level.text"
        class="col"
      >
        <p class="font-weight-bold text-uppercase my-3">
          {{ second_level.text }}
        </p>
        <p v-for="item in second_level.items" :key="item">
          {{ item }}
        </p>
      </div>
      <div class="col-12 pt-5 d-none">
        <!-- <nuxt-link
          class="d-block"
          v-for="(link, i) in selectedItem.data.links"
          :key="i"
          :to="`/${link.link_query}`"
          >{{ link.link_label }}</nuxt-link> -->

        {{ selectedItem.second_level }}
        <!-- <p v-for="(subCategory, i) in selectedItem.items" :key="i">
          <nuxt-link
            :to="`/${selectedItem.title.toLowerCase()}/${subCategory.title.toLowerCase()}`"
            >{{ subCategory.title }}</nuxt-link
          >
        </p> -->
      </div>
    </div>
  </div>
</template>

<script>
import menuQuery from "../utilities/menuQuery";
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
    const response = await this.$prismic.api.getSingle("menu");
    const body = response.data.body; /* .filter(
      (el) => el.slice_type == "2nd_level"
    ); */

    /* const result = body.reduce((acc, obj) => {
      const key = obj.primary["primary_reference"];
      acc[key] ??= [];
      console.log(obj);
      acc[key].push({
        primary: obj.primary.primary_reference,
        secondary: obj.primary.link_text,
        items: obj.items,
      });
      return acc;
    }, {}); */

    const result = body;

    const keys = [...new Set(result.map((el) => el.primary.primary_reference))];
    console.log(keys);

    const mapped = keys.map((el) => {
      const link = result.find((x) => x.primary.primary_reference == el).primary
        .primary_reference_link;
      const second_level = result
        .filter((x) => x.primary.primary_reference == el)
        .map((x) => x.items);

      const second_test = result
        .filter((x) => x.primary.primary_reference == el)
        .map((x) => x.primary.link_text);

      return {
        first_level_link: link,
        first_level: el,
        second_level: second_test.map((x) => {
          return {
            text: x,
            items: result
              .filter((y) => y.primary.primary_reference == el)
              .filter((k) => k.primary.link_text == x)
              .map((z) => z.items)
              .flat()
              .map((t) => t.third_level_link_text),
          };
        }),
      };
    });

    console.log(mapped, "mapp");
    this.document = mapped;
    console.log(body, "resulst");

    /* const GRAPHQL_URL = this.$config.DOMAIN;

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
        body: menuQuery,
      };
    };
    this.data = await fetch(GRAPHQL_URL, GRAPHQL_BODY())
      .then((res) => res.json())
      .then((res) => {
        console.log(res.data);
        return res.data.menu.items;
      }); */
  },
};
</script>
