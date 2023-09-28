<script lang="ts">
import { defineComponent, ref, useContext, useFetch, useRoute, watch } from '@nuxtjs/composition-api'
import promoTagIcon from 'assets/svg/promo-tag.svg'
import ThirdLevel from '~/components/UI/ThirdLevel.vue'
import { generateKey } from '~/utilities/strings'

export default defineComponent({
  name: 'MegaMenu',
  components: { ThirdLevel },
  setup() {
    const { i18n } = useContext()
    const route = useRoute()
    const megaMenu = ref(null)
    const selectedItem = ref<string>('')
    const pageData = ref<any>()

    const { fetch } = useFetch(async ({ $cmwRepo }) => {
      await $cmwRepo.prismic.getSingle('mega-menu-test')
        .then((data) => {
          pageData.value = data.body && data.body
            .map((firstLevel) => {
              const secondLevels = firstLevel.items.map((el: { secondlevelname: any; second_level_position: any }) => {
                return {
                  name: el.secondlevelname,
                  position: el.second_level_position,
                }
              })
              const secondLevelsSet = [
                ...new Set(secondLevels.map((el: any) => JSON.stringify(el))),
              ]
                .map(el => JSON.parse(el as string))
                .sort((a, b) => a.position - b.position)

              const items = secondLevelsSet.map((el) => {
                const temp = firstLevel.items
                  .filter((x: { secondlevelname: any }) => x.secondlevelname === el.name)
                  .sort((a: { third_level_position: number }, b: { third_level_position: number }) => a.third_level_position - b.third_level_position)

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
            .sort((a: { position: number }, b: { position: number }) => a.position - b.position)
        })
    })

    watch(() => route.value, () => selectedItem.value = '')
    watch(() => i18n.locale, () => fetch(), { deep: true })

    const onTab = (item: string) => selectedItem.value = item

    return {
      megaMenu,
      onTab,
      pageData,
      promoTagIcon,
      selectedItem,
    }
  },
  methods: { generateKey },
})
</script>

<template>
  <div @mouseleave="onTab('')">
    <div ref="megaMenu" class="flex items-center">
      <div class="max-w-screen-xl mx-auto flex items-center justify-evenly w-full">
        <div
          v-for="(firstLevel, i) in pageData"
          :key="i"
          class="text-center text-uppercase py-2"
          @mouseenter="onTab(firstLevel.name)"
        >
          <template v-if="firstLevel?.link === 'blog'">
            <a href="/blog" class="w-max text-xs w-max desktop-wide:text-sm uppercase text-body hover:(text-primary cmw-font-bold)">{{ firstLevel.link }}</a>
          </template>
          <template v-else>
            <component
              :is="firstLevel.link ? 'NuxtLink' : 'span'"
              class="w-max text-xs w-max desktop-wide:text-sm uppercase hover:(text-primary cmw-font-bold)"
              :class="firstLevel.isPromotionTab ? 'text-primary-400' : 'text-body'"
              :to="firstLevel.link ? localePath(`/${firstLevel.link}`) : undefined"
            >
              <VueSvgIcon
                v-if="firstLevel.isPromotionTab"
                :data="promoTagIcon"
                width="26"
                height="26"
                class="inline"
              />
              {{ firstLevel.name }}
            </component>
          </template>
        </div>
      </div>
    </div>
    <div class="relative">
      <div
        v-for="items in pageData" :key="generateKey(items.name)" class="absolute top-0 left-0 w-full"
        :class="selectedItem === items.name ? 'visible' : 'invisible'"
      >
        <div
          v-if="items.display_as_cards"
          class="grid grid-cols-[minmax(100px,_1332px)] justify-center bg-white"
        >
          <div v-for="(secondLevel, i) in items.items" :key="generateKey(`${secondLevel.name}-as-card-${i}`)">
            <div>
              <p class="overline-2 uppercase text-secondary-700 cmw-font-semibold pt-8" v-text="secondLevel.name" />
            </div>
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <div v-for="(thirdLevel, j) in secondLevel.items" :key="j">
                <ThirdLevel :third-level="thirdLevel" @close-banner="onTab('')" />
              </div>
            </div>
          </div>
        </div>
        <div
          v-else class="grid grid-cols-[1fr_minmax(100px,_1332px)_1fr] bg-white min-h-[300px] border-t border-t-gray-light"
          @mouseleave="onTab('')"
        >
          <div class="bg-gray-lightest" />
          <div class="col-start-2 flex">
            <div
              v-for="(secondLevel, i) in items.items"
              :key="generateKey(`${secondLevel.name}-${i}`)"
              class="flex-1 flex flex-col px-4"
              :class="[
                { 'border-r border-r-gray-light': (i + 1) < items.items.length },
                { 'bg-gray-lightest': (i === 0) },
              ]"
            >
              <p class="overline-2 uppercase text-secondary-700 cmw-font-semibold pt-4" v-text="secondLevel.name" />
              <div class="flex flex-col h-full">
                <ThirdLevel
                  v-for="(thirdLevel, idx) in secondLevel.items"
                  :key="generateKey(`${thirdLevel.third_level_name}-${idx}`)" :third-level="thirdLevel"
                  @close-banner="onTab('')"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
