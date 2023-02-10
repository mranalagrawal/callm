<script>
export default {
  data: () => ({
    selectedItem: null,
    selectedContent: null,
    data: null,
    promotions: null,
    marketing: null,
  }),
  async fetch() {
    let lang = ''
    if (this.$i18n.locale == 'en')
      lang = 'en-gb'
    else
      lang = 'it-it'

    const response = await this.$prismic.api.getSingle('wv_mega-menu', {
      lang,
    })
    const data = response.data.body

    const mapped = data
      .map((firstLevel) => {
        const secondLevelNames = [
          ...new Set(firstLevel.items.map(el => el.secondlevelname)),
        ]
        const secondLevels = firstLevel.items.map((el) => {
          return {
            name: el.secondlevelname,
            position: el.second_level_position,
          }
        })
        const secondLevelsSet = [
          ...new Set(secondLevels.map(el => JSON.stringify(el))),
        ]
          .map(el => JSON.parse(el))
          .sort((a, b) => a.position - b.position)

        const items = secondLevelsSet.map((el) => {
          const temp = firstLevel.items
            .filter(x => x.secondlevelname === el.name)
            .sort((a, b) => a.third_level_position - b.third_level_position)

          return { ...el, items: temp }
        })

        return {
          name: firstLevel.primary.group_label,
          link: firstLevel.primary.first_level_link,
          position: firstLevel.primary.first_level_position,
          items,
        }
      })
      .sort((a, b) => a.position - b.position)

    this.data = mapped
    /* this.selectedItem = mapped[3]; */
  },
  watch: {
    '$i18n.locale': '$fetch',
  },
  methods: {
    onTab(item) {
      if (item)
        this.selectedItem = item
      else
        this.selectedItem = null
    },
  },
}
</script>

<template>
  <div
    class="container-fluid position-relative px-md-0"
    @mouseleave="onTab(null)"
  >
    <div class="row shadow-menu">
      <div
        v-for="(item, i) in data"
        :key="i"
        class="col text-center text-uppercase menu-link"
        @mouseenter="onTab(item)"
      >
        {{ item.name }}
      </div>
    </div>

    <div
      v-if="selectedItem"
      class="row bg-white shadow-menu pt-3 pt-md-0"
      style="
        min-height: 300px;
        z-index: 100;
        max-height: 400px;
        overflow-y: scroll;
      "
      @mouseleave="onTab(null)"
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
          <ThirdLevel :third-level="thirdLevel" />
        </div>
      </div>
    </div>
  </div>
</template>

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
}
.menu-link:hover {
  /* color: var(--dark-secondary); */
  text-decoration: none;
}
</style>
