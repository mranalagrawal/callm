<script lang="ts">
import { defineComponent, ref, useRoute, watch } from '@nuxtjs/composition-api'
import promoTagIcon from 'assets/svg/promo-tag.svg'
import { storeToRefs } from 'pinia'
import ThirdLevel from '~/components/UI/ThirdLevel.vue'
import { useVercelKv } from '~/store/vercelKv'
import { generateKey } from '~/utilities/strings'

export default defineComponent({
  components: { ThirdLevel },
  setup() {
    const route = useRoute()
    const selectedItem = ref<string>('')
    const { filteredMegaMenu } = storeToRefs(useVercelKv())

    watch(() => route.value, () => selectedItem.value = '')
    const onTab = (item: string) => selectedItem.value = item

    return {
      filteredMegaMenu,
      onTab,
      promoTagIcon,
      selectedItem,
    }
  },
  methods: { generateKey },
})
</script>

<template>
  <div @mouseleave="onTab('')">
    <div class="flex items-center">
      <div class="max-w-screen-xl mx-auto flex items-center justify-evenly w-full">
        <div
          v-for="(firstLevel, i) in filteredMegaMenu"
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
        v-for="items in filteredMegaMenu" :key="generateKey(items.name)" class="absolute top-0 left-0 w-full"
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
              <component :is="secondLevel.link ? 'NuxtLink' : 'span'" :to="secondLevel.link ? localePath(`${secondLevel.link}`) : undefined">
                <p class="overline-2 uppercase text-secondary-700 cmw-font-semibold pt-4" v-text="secondLevel.name" />
              </component>
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
