<template>
  <div
    class="container-fluid position-relative px-md-0"
    @mouseleave="onTab(null)"
  >
    <div class="row pb-3 shadow-menu">
      <div
        class="col text-center text-uppercase menu-link"
        v-for="(item, i) in data"
        @mouseenter="onTab(item)"
        :key="i"
      >
        {{ item.name }}
      </div>
    </div>

    <div
      v-if="selectedItem"
      @mouseleave="onTab(null)"
      class="row bg-white shadow-menu pt-3 pt-md-0"
      style="
        min-height: 300px;
        z-index: 100;
        max-height: 400px;
        overflow-y: scroll;
      "
    >
      <div
        v-for="(secondLevel, i) in selectedItem.items"
        :key="i"
        class="col pt-3"
        style="border-right: 1px solid #ddd"
        :class="i == 0 ? 'bg-dark-primary text-white' : ''"
      >
        <p class="fs-14 px-2" style="font-weight: 600">
          {{ secondLevel.name }}
        </p>
        <div v-for="(thirdLevel, j) in secondLevel.items" :key="j">
          <!-- {{ thirdLevel }} -->
          <ThirdLevel :thirdLevel="thirdLevel" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ThirdLevel from "./UI/ThirdLevel.vue";

export default {
  components: { ThirdLevel },
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
    let lang = "";
    if (this.$i18n.locale == "en") {
      lang = "en-gb";
    } else {
      lang = "it-it";
    }
    let response = await this.$prismic.api.getSingle("wv_mega-menu", {
      lang: lang,
    });
    let data = response.data.body;

    let mapped = data
      .map((firstLevel) => {
        const secondLevelNames = [
          ...new Set(firstLevel.items.map((el) => el.secondlevelname)),
        ];
        const secondLevels = firstLevel.items.map((el) => {
          return {
            name: el.secondlevelname,
            position: el.second_level_position,
          };
        });
        const secondLevelsSet = [
          ...new Set(secondLevels.map((el) => JSON.stringify(el))),
        ]
          .map((el) => JSON.parse(el))
          .sort((a, b) => a.position - b.position);

        const items = secondLevelsSet.map((el) => {
          let temp = firstLevel.items
            .filter((x) => x.secondlevelname === el.name)
            .sort((a, b) => a.third_level_position - b.third_level_position);

          return { ...el, items: temp };
        });
        /* console.log(items, "ITEMS"); */
        return {
          name: firstLevel.primary.group_label,
          link: firstLevel.primary.first_level_link,
          position: firstLevel.primary.first_level_position,
          items,
        };
      })
      .sort((a, b) => a.position - b.position);

    /* console.log(mapped, "mapped"); */
    this.data = mapped;
    /* this.selectedItem = mapped[3]; */
  },
};
</script>

<style scoped>
.img-height {
  height: 150px;
}

.shadow-menu {
  box-shadow: 0 0.5rem 0.75rem rgb(0 0 0 / 15%) !important;
  border-bottom: 1px solid #ddd;
}
.menu-link {
  color: white;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 300;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
.menu-link:hover {
  /* color: var(--dark-secondary); */
  text-decoration: none;
}
</style>
