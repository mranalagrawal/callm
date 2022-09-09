<template>
  <div class="container-fluid position-relative" @mouseleave="onTab(null)">
    <div class="row pb-3 shadow-menu">
      <div
        class="col text-center"
        v-for="(item, i) in data"
        @mouseenter="onTab(item)"
        :key="i"
      >
        {{ item.name }}
        <!-- <nuxt-link :to="`/${item.url.split('.com/')[1]}`" class="menu-link">{{
          item.title
        }}</nuxt-link> -->
      </div>
    </div>
    <div v-if="selectedItem" @mouseleave="onTab(null)">
      <div
        class="row bg-white w-100 position-absolute shadow-menu"
        style="min-height: 300px; z-index: 100"
      >
        {{ selectedItem }}
      </div>
    </div>
    <div class="row">
      <div class="col" v-for="item in data" :key="item.position">
        <p>{{ item.name }}</p>
        <div
          class="pl-4"
          v-for="(secondLevel, i) in Object.entries(item.items)"
          :key="i"
        >
          <p>{{ secondLevel[0] }}</p>
          <div>
            <div v-for="thirdLevel in secondLevel[1]" :key="thirdLevel.name">
              <div class="card" v-if="!thirdLevel.marketingCTA">
                {{ thirdLevel.name }}
              </div>
              <div class="card" v-else>
                {{ thirdLevel.name }}
                {{ thirdLevel.marketingCTA }}
                <img :src="thirdLevel.marketingImage" alt="" width="32px" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  watch: {
    "$i18n.locale": "$fetch",
  },
  data: () => ({
    selectedItem: null,
    selectedContent: null,
    data: null,
    promotions: null,
    marketing: null,
  }),
  methods: {
    onTab(item) {
      if (item) {
        this.selectedItem = item;
      } else {
        this.selectedItem = null;
      }
    },
  },
  async fetch() {
    console.log(this.$i18n.locale, "LAN");

    let lang = "";
    if (this.$i18n.locale == "en") {
      lang = "en-gb";
    } else {
      lang = "it-it";
    }
    let response = await this.$prismic.api.getSingle("mega-menu-test", {
      lang: lang,
    });
    let data = response.data.body;
    /* console.clear(); */
    console.log(data, "DATA");

    let mapped = data
      .map((firstLevel) => {
        return {
          name: firstLevel.primary.group_label,
          link: firstLevel.primary.first_level_link,
          position: firstLevel.primary.position,
          items: firstLevel.items.reduce((t, n) => {
            let temp = {
              name: n.third_level_name,
              link: n.third_level_link,
              marketingImage: n.marketing_image.url,
              marketingCTA: n.marketing_cta,
            };
            t[n.secondlevelname]
              ? t[n.secondlevelname].push(temp)
              : (t[n.secondlevelname] = [temp]);

            return t;
          }, {}),
        };
      })
      .sort((a, b) => a.position - b.position);

    this.data = mapped;

    console.log(mapped);
  },
};
</script>

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
