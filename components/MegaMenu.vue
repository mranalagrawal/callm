<script>
import { ref, useContext, useRouter } from '@nuxtjs/composition-api'
import promoTagIcon from 'assets/svg/promo-tag.svg'
import ThirdLevel from './UI/ThirdLevel.vue'
import prismicConfig from '~/config/prismicConfig'
import { generateKey } from '~/utilities/strings'

export default {
  components: { ThirdLevel },
  setup() {
    const {
      localeLocation,
      $cmwRepo,
    } = useContext()
    const router = useRouter()
    const megaMenu = ref(null)
    const selectedItem = ref(null)
    const handleClick = (to) => {
      router.push(localeLocation(to))
      selectedItem.value = null
    }

    const onTab = item => selectedItem.value = item

    return {
      $cmwRepo,
      megaMenu,
      selectedItem,
      handleClick,
      onTab,
    }
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

          return {
            ...el,
            items: temp,
          }
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
    <div ref="megaMenu" class="flex items-center">
      <div class="max-w-screen-xl mx-auto flex items-center justify-evenly w-full">
        <div
          v-for="(firstLevel, i) in data"
          :key="i"
          class="text-center text-uppercase py-2"
          @mouseenter="onTab(firstLevel)"
        >
          <button
            class="w-max text-xs w-max desktop-wide:text-sm uppercase hover:(text-primary font-bold)"
            :class="firstLevel.isPromotionTab ? 'text-primary-400' : 'text-body'"
            @click="handleClick(`/${firstLevel.link}`)"
          >
            <VueSvgIcon
              v-if="firstLevel.isPromotionTab"
              :data="promoTagIcon"
              width="26"
              height="26"
              class="inline"
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
          class="grid grid-cols-[1fr_minmax(100px,_1332px)_1fr] bg-white min-h-[300px] border-t border-t-gray-light"
          @mouseleave="onTab(null)"
        >
          <div class="bg-gray-lightest" />
          <div class="col-start-2 flex">
            <div
              v-for="(secondLevel, i) in selectedItem.items"
              :key="generateKey(`${secondLevel.name}-${i}`)"
              class="flex-1 flex flex-col px-4"
              :class="[
                { 'border-r border-r-gray-light': (i + 1) < selectedItem.items.length },
                { 'bg-gray-lightest': (i === 0) },
              ]"
            >
              <p class="overline-2 uppercase text-secondary-700 font-semibold pt-4">
                {{ secondLevel.name }}
              </p>
              <div class="flex flex-col h-full">
                <ThirdLevel
                  v-for="(thirdLevel, i) in secondLevel.items"
                  :key="generateKey(`${thirdLevel.third_level_name}-${i}`)" :third-level="thirdLevel"
                  @close-banner="onTab(null)"
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
          class="grid grid-cols-[minmax(100px,_1332px)] justify-center"
          @mouseleave="onTab(null)"
        >
          <div v-for="(secondLevel, i) in selectedItem.items" :key="generateKey(`${secondLevel.name}-as-card-${i}`)">
            <div>
              <p class="overline-2 uppercase text-secondary-700 font-semibold pt-8">
                {{ secondLevel.name }}
              </p>
            </div>
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <div v-for="(thirdLevel, j) in secondLevel.items" :key="j">
                <ThirdLevel :third-level="thirdLevel" @close-banner="onTab(null)" />
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
