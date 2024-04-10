<script lang="ts">
import { computed, defineComponent, ref, useRoute, watch } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'

import { useVercelKv } from '~/store/vercelKv'

import chevronLeftIcon from '~/assets/svg/chevron-left.svg'
import chevronRightIcon from '~/assets/svg/chevron-right.svg'
import closeIcon from '~/assets/svg/close.svg'
import promoTagIcon from '~/assets/svg/promo-tag.svg'

import { getIconByFeature } from '~/utilities/icons'
import { generateKey } from '~/utilities/strings'

export default defineComponent({
  emits: ['close-sidebar'],
  setup(_, { emit }) {
    const route = useRoute()
    const activeItem = ref({})
    const { filteredMegaMenu } = storeToRefs(useVercelKv())

    const closeSidebar = (full: any) => {
      activeItem.value = {}
      if (full) {
        setTimeout(() =>
          emit('close-sidebar', full), 300)
      }
    }

    /* const handleAfterEnter = (target: { querySelector: (arg0: string) => any }) => {
      const scrollableEl = target.querySelector('.js-scroll')
      scrollableEl && scrollableEl.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
    } */

    const mappedMenu = computed(() => filteredMegaMenu.value?.map((menu: { items: { items: any[] }[] }) => ({
      ...menu,
      items: menu.items.map((item: { items: any[] }) => ({
        ...item,
        isSelection: item.items.every(i => !!i.selection),
        isMarketing: item.items.every(i => !!i.marketing_cta),
      })),
    })))

    watch(() => route.value, () => closeSidebar(true), { deep: true })

    return {
      // handleAfterEnter,
      activeItem,
      chevronLeftIcon,
      chevronRightIcon,
      closeIcon,
      closeSidebar,
      mappedMenu,
      filteredMegaMenu,
      promoTagIcon,
    }
  },
  methods: { getIconByFeature, generateKey },
})
</script>

<template>
  <div class="w-full bg-white">
    <div class="shadow h-[3px]" />
    <div class="overflow-auto h-screen">
      <div v-for="(mappedMenuItem) in filteredMegaMenu" :key="generateKey(`menu-mobile-${mappedMenuItem?.name}`)">
        <template v-if="mappedMenuItem.name.toLowerCase() === 'blog'">
          <a href="/blog" class="relative flex justify-between items-center w-full py-4 px-2">
            <span class="uppercase text-sm cmw-font-light tracking-wide">{{ mappedMenuItem.name }}</span></a>
        </template>
        <template v-else>
          <component
            :is="!!mappedMenuItem.items.length ? 'button' : 'NuxtLink'"
            :to="!mappedMenuItem.items.length ? localePath(`/${mappedMenuItem.link}`) : undefined"
            class="relative flex justify-between items-center w-full py-4 px-2"
            @click="activeItem = mappedMenuItem"
          >
            <span
              class="uppercase text-sm cmw-font-light tracking-wide"
              :class="mappedMenuItem.isPromotionTab ? 'text-primary-400' : ''"
            >
              <VueSvgIcon
                v-if="mappedMenuItem.isPromotionTab"
                :data="promoTagIcon"
                width="26"
                height="26"
                class="inline"
              />
              {{ mappedMenuItem.name }}
            </span>
            <VueSvgIcon
              v-if="!!mappedMenuItem.items.length"
              :data="chevronRightIcon"
              width="16"
              height="16"
              color="#d94965"
            />
            <span class="absolute w-[calc(100%_-_1rem)] left-2 bottom-0 h-px bg-gray-light" />
          </component>
        </template>
      </div>
    </div>
    <!--    <transition name="menu-mobile-second-level" @after-enter="handleAfterEnter"> -->
    <div
      v-for="menuItem in mappedMenu" :key="generateKey(`second-layer-${menuItem.name}`)"
      class="fixed top-0 left-0 w-full transform transition-transform z-amenadiel pt-$cmw-top-banner-height"
      :class="activeItem.name === menuItem.name ? 'translate-x-0' : '-translate-x-full'"
    >
      <!--        <MenuMobileSecondLayer :menu="activeItem" @close-sidebar="closeSidebar" /> -->
      <div class="w-full bg-white" :class="activeItem.name === menuItem.name ? 'bg-primary' : 'bg-secondary'">
        <div class="overflow-auto max-h-[calc(100vh_-_var(--cmw-top-banner-height))] bg-white js-scroll">
          <!-- Sticky Header -->
          <div class="sticky bg-white z-base flex gap-2 justify-between items-center top-0 left-0 pt-2 px-4">
            <ButtonIcon :icon="chevronLeftIcon" variant="icon" size="22" @click.native="closeSidebar(false)" />
            <div class="text-center">
              {{ menuItem.name }} <CmwButton variant="text" size="sm" class="block py-0" :label="$t('common.cta.viewAll')" :to="localePath(`/${menuItem.link}`)" />
            </div>
            <ButtonIcon :icon="closeIcon" variant="icon" size="26" @click.native="closeSidebar(true)" />
          </div>
          <!-- Content -->
          <div class="h-screen">
            <div
              v-for="(item) in menuItem.items"
              :key="generateKey(item.name || `missing`)"
              class="relative w-full py-4"
              :class="item.isSelection ? 'bg-gray-lightest' : 'bg-white px-2'"
            >
              <!-- Selection Case -->
              <template v-if="item.isSelection">
                <div class="overline-2 uppercase text-sm text-secondary-700 font-medium text-center mt-2 mb-4" v-text="item.name" />
                <div class="flex flex-wrap items-center justify-center">
                  <div
                    v-for="({ third_level_name, third_level_link, second_level_name, second_level_link, selection }) in item.items"
                    :key="generateKey(third_level_name || second_level_name)"
                    class="basis-4/12 flex-grow-0 flex-shrink-1 p-2"
                  >
                    <NuxtLink
                      :to="localePath(third_level_link || second_level_link)"
                      class="
                  grid grid-rows-[50px_50px] items-center justify-items-center content-center
                  bg-white border border-gray-light rounded text-center text-primary-400 fill-primary-400 pt-4
"
                    >
                      <VueSvgIcon
                        :data="require(`@/assets/svg/${getIconByFeature(selection)}.svg`)"
                        class="block"
                        width="44"
                        height="auto"
                      />
                      <div class="text-xs text-body">
                        {{ third_level_name }}
                      </div>
                    </NuxtLink>
                  </div>
                </div>
              </template>
              <!-- Marketing Case -->
              <template v-else-if="item.isMarketing">
                <div class="overline-2 uppercase text-sm text-secondary-700 font-medium text-center mt-2 mb-4">
                  {{ item.name }}
                </div>
                <div
                  v-for="({ marketing_image, third_level_name, third_level_link, second_level_name, marketing_cta, icon }) in item.items"
                  :key="generateKey(third_level_name || second_level_name || marketing_cta || 'Marketing Case missing')"
                  class="relative"
                >
                  <NuxtLink :to="localePath(third_level_link)">
                    <Card
                      :bg-url="marketing_image.url" :title="third_level_name" :subtitle="marketing_cta" :icon="icon"
                      show-bg
                    />
                  </NuxtLink>
                </div>
              </template>
              <template v-else>
                <div class="overline-2 uppercase text-sm text-secondary-700 font-medium text-center mt-2 mb-4">
                  {{ item.name }}
                </div>
                <NuxtLink
                  v-for="({ third_level_style, third_level_name, third_level_link }) in item.items"
                  :key="generateKey(third_level_name || 'v-else-missing')"
                  :to="localePath(third_level_link)"
                  class="relative flex justify-between items-center w-full py-4 px-2"
                >
                  <span
                    class="text-sm cmw-font-light tracking-wide"
                    :class="third_level_style ? 'text-primary-400' : 'text-body' "
                  >{{ third_level_name }}</span>
                  <span class="absolute w-[calc(100%_-_1rem)] left-2 bottom-0 h-px bg-gray-light" />
                </NuxtLink>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--    </transition> -->
  </div>
</template>
