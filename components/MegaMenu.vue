<template>
  <div
    class="container-fluid position-relative px-md-0"
    @mouseleave="onTab(null)"
  >
    <div class="row align-items-center shadow-menu">
      <div
        class="col text-center text-uppercase menu-link cmw-py-2"
        v-for="(firstLevel, i) in data"
        @mouseenter="onTab(firstLevel)"
        :key="i"
        :style="{
          color: firstLevel.isPromotionTab ? 'var(--light-secondary)' : '',
        }"
      >
        <VueSvgIcon
          v-if="firstLevel.isPromotionTab"
          :data="promoTagIcon"
          width="30"
          height="30"
          class="d-inline"
        />
        {{ firstLevel.name }}
      </div>
    </div>
    <div ref="megaMenu">
      <div
        v-if="selectedItem && !selectedItem.display_as_cards"
        @mouseleave="onTab(null)"
        class="row bg-white shadow-menu pt-3 px-2"
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
          <p class="cmw-overline-2 cmw-uppercase cmw-text-secondary-700 cmw-font-semibold" >
            {{ secondLevel.name }}
          </p>
          <div v-for="(thirdLevel, j) in secondLevel.items" :key="j">
            <ThirdLevel :thirdLevel="thirdLevel" @close-banner="onTab(null)"/>
          </div>
        </div>
      </div>
      <div
        v-if="selectedItem && selectedItem.display_as_cards"
        @mouseleave="onTab(null)"
        class="row bg-white shadow-menu pt-3 px-4"
        style="
        min-height: 300px;
        z-index: 100;
        max-height: 400px;
        overflow-y: scroll;
      "
      >
        <div v-for="(secondLevel, i) in selectedItem.items" :key="i" class="row">
          <div class="col-12">
            <p class="cmw-overline-2 cmw-uppercase cmw-text-secondary-700 cmw-font-semibold cmw-p-8" >
              {{ secondLevel.name }}
            </p>
          </div>
          <div
            v-for="(thirdLevel, j) in secondLevel.items"
            :key="j"
            class="col-12 col-md-6 col-lg-4 col-xl-3"
          >
            <ThirdLevel :thirdLevel="thirdLevel" @close-banner="onTab(null)"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {useHeaderSize} from "~/store/headerSize";
import {nextTick, onMounted, onUnmounted, ref} from "@nuxtjs/composition-api";
import debounce from "lodash.debounce";
import ThirdLevel from "./UI/ThirdLevel.vue";
import promoTagIcon from 'assets/svg/promo-tag.svg'
import locales from "../locales-mapper";
export default {
  components: { ThirdLevel },
  watch: {
    "$i18n.locale": "$fetch",
  },
  setup() {
    const headerSize = useHeaderSize()
    const megaMenu = ref(null)

    const resizeListener = debounce( function () {
      headerSize.$patch({
        navbarHeight: megaMenu.value ? megaMenu.value.getBoundingClientRect().height : 0,
      })
    }, 400)

    onMounted(() => {
      window.addEventListener('resize', resizeListener)
      nextTick(() => resizeListener())
    })

    onUnmounted(() => {
      window.removeEventListener('resize', resizeListener)
    })

    return { headerSize, megaMenu }
  },
  data: () => ({
    promoTagIcon,
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
    let lang = locales[this.$i18n.locale];

    if (lang == "en-gb" && this.$config.STORE == "CMW") {
      lang = "en-eu";
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
          isPromotionTab: firstLevel.primary.is_promotion_tab,
          display_as_cards: firstLevel.primary.display_as_cards,
          items,
        };
      })
      .sort((a, b) => a.position - b.position);

    this.data = mapped;
    /* this.selectedItem = mapped[3]; */
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
  color: var(--dark-secondary);
  text-decoration: none;
}
</style>
