<template>
  <div class="container-fluid position-relative" @mouseleave="onTab(null)">
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
    <div v-if="selectedItem" @mouseleave="onTab(null)">
      <div
        class="row bg-white w-100 position-absolute shadow-menu pt-3"
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
          class="col"
          style="border-right: 1px solid #ddd"
        >
          <p class="fs-14 px-2" style="color: #155b53; font-weight: 600">
            {{ secondLevel.name }}
          </p>
          <div v-for="(thirdLevel, j) in secondLevel.items" :key="j">
            <!-- {{ thirdLevel }} -->
            <p v-if="!thirdLevel.marketing_cta" class="mb-2">
              <nuxt-link
                class="menu-link px-2"
                style="
                  font-weight: 300;
                  padding-top: 0.5rem;
                  padding-bottom: 0.5rem;
                "
                :to="thirdLevel.third_level_link || '/'"
                >{{ thirdLevel.third_level_name }}</nuxt-link
              >
            </p>
            <div
              v-else
              class="shadow row align-items-center mb-4 mx-auto"
              style="max-width: 350px; border-radius: 10px"
            >
              <div
                class="col-3"
                style="
                  height: 70px;
                  background-position: center;
                  background-size: cover;
                  border-radius: 10px 0px 0px 10px;
                "
                :style="{
                  backgroundImage:
                    'url(' + thirdLevel.marketing_image.url + ')',
                }"
              ></div>

              <div class="col-9">
                <p class="mb-0">{{ thirdLevel.third_level_name }}</p>
                <p class="mb-0 small text-light-red">
                  {{ thirdLevel.marketing_cta }}
                </p>
              </div>
            </div>
          </div>
          <!-- <h3>{{ secondLevel[0] }}</h3>
          <div v-for="(thirdLevel, j) in secondLevel[1]" :key="j">
            <div class="card" v-if="!thirdLevel.marketingCTA">
              {{ thirdLevel.name }}
            </div>
            <div class="card" v-else>
              {{ thirdLevel.name }}
              {{ thirdLevel.marketingCTA }}
              <img :src="thirdLevel.marketingImage" alt="" width="32px" />
            </div>
          </div> -->
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

        return {
          name: firstLevel.primary.group_label,
          link: firstLevel.primary.first_level_link,
          position: firstLevel.primary.first_level_position,
          items,
        };
      })
      .sort((a, b) => a.position - b.position);

    this.data = mapped;
    /* this.selectedItem = mapped[0] */
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
  font-size: 0.875rem;
  font-weight: 600;
}
.menu-link:hover {
  color: var(--dark-red);
  text-decoration: none;
}
</style>
