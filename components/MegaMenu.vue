<script>
import { ref, useContext, useRouter } from '@nuxtjs/composition-api'
import promoTagIcon from 'assets/svg/promo-tag.svg'
import ThirdLevel from './UI/ThirdLevel.vue'
import prismicConfig from '~/config/prismicConfig'
import { generateKey } from '~/utilities/strings'

export default {
  components: { ThirdLevel },
  setup() {
    const { localeLocation, $cmwRepo } = useContext()
    const router = useRouter()
    const megaMenu = ref(null)
    const selectedItem = ref(null)
    const handleClick = (to) => {
      router.push(localeLocation(to))
      selectedItem.value = null
    }

    const onTab = item => selectedItem.value = item

    return { $cmwRepo, megaMenu, selectedItem, handleClick, onTab }
  },
  data: () => ({
    promoTagIcon,
    selectedContent: null,
    data: null,
    promotions: null,
    marketing: null,
  }),
  async fetch() {
    const response = await this.$cmwRepo.prismic.getSingle({ page: prismicConfig[this.$config.STORE]?.components.megaMenu })
    const data = response.data.body

    const mapped = data
      .map((firstLevel) => {
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
          isPromotionTab: firstLevel.primary.is_promotion_tab,
          display_as_cards: firstLevel.primary.display_as_cards,
          items,
        }
      })
      .sort((a, b) => a.position - b.position)

    this.data = mapped
  },
  methods: { generateKey },
}
</script>

<template>
  <div @mouseleave="onTab(null)">
    <div ref="megaMenu" class="align-items-center">
      <div class="cmw-max-w-screen-xl cmw-mx-auto cmw-flex cmw-items-center">
        <div
          v-for="(firstLevel, i) in data"
          :key="i"
          class="col text-center text-uppercase menu-link cmw-py-2"
          @mouseenter="onTab(firstLevel)"
        >
          <button
            class="cmw-w-max cmw-text-xs desktop-wide:cmw-text-sm cmw-uppercase cmw-no-underline hover:(!cmw-text-primary cmw-font-bold cmw-no-underline)"
            :class="firstLevel.isPromotionTab ? '!cmw-text-primary-400' : '!cmw-text-body'"
            @click="handleClick(`/${firstLevel.link}`)"
          >
            <VueSvgIcon
              v-if="firstLevel.isPromotionTab"
              :data="promoTagIcon"
              width="26"
              height="26"
              class="cmw-inline"
            />
            {{ firstLevel.name }}
          </button>
        </div>
      </div>
    </div>
    <div>
      <transition>
        <div
          v-if="selectedItem && !selectedItem.display_as_cards"
          class="cmw-grid cmw-grid-cols-[1fr_minmax(100px,_1332px)_1fr] cmw-bg-white cmw-min-h-[300px] cmw-border-t cmw-border-t-gray-light"
          @mouseleave="onTab(null)"
        >
          <div class="cmw-bg-gray-lightest" />
          <div class="cmw-col-start-2 cmw-flex">
            <div
              v-for="(secondLevel, i) in selectedItem.items"
              :key="generateKey(`${secondLevel.name}-${i}`)"
              class="cmw-flex-1 cmw-flex cmw-flex-col cmw-px-4"
              :class="[
                { 'cmw-border-r cmw-border-r-gray-light': (i + 1) < selectedItem.items.length },
                { 'cmw-bg-gray-lightest': (i === 0) },
              ]"
            >
              <p class="cmw-overline-2 cmw-uppercase cmw-text-secondary-700 cmw-font-semibold cmw-pt-4">
                {{ secondLevel.name }}
              </p>
              <div class="cmw-flex cmw-flex-col cmw-h-full">
                <ThirdLevel
                  v-for="(thirdLevel, i) in secondLevel.items"
                  :key="generateKey(`${thirdLevel.third_level_name}-${i}`)" :third-level="thirdLevel" @close-banner="onTab(null)"
                />
              </div>
            </div>
          </div>
          <div />
        </div>
      </transition>
      <transition>
        <div
          v-if="selectedItem && selectedItem.display_as_cards"
          class="cmw-grid cmw-grid-cols-[minmax(100px,_1332px)] cmw-justify-center"
          @mouseleave="onTab(null)"
        >
          <div v-for="(secondLevel, i) in selectedItem.items" :key="generateKey(`${secondLevel.name}-as-card-${i}`)">
            <div>
              <p class="cmw-overline-2 cmw-uppercase cmw-text-secondary-700 cmw-font-semibold cmw-p-8">
                {{ secondLevel.name }}
              </p>
            </div>
            <div class="cmw-grid cmw-gap-4 md:cmw-grid-cols-2 lg:cmw-grid-cols-3 xl:cmw-grid-cols-4">
              <div
                v-for="(thirdLevel, j) in secondLevel.items"
                :key="j"
                class=""
              >
                <ThirdLevel :third-level="thirdLevel" @close-banner="onTab(null)" />
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
