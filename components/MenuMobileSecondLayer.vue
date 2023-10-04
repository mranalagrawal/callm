<script>
import { computed } from '@nuxtjs/composition-api'
import closeIcon from 'assets/svg/close.svg'
import chevronLeftIcon from 'assets/svg/chevron-left.svg'
import { generateKey } from '~/utilities/strings'
import { getIconByFeature } from '~/utilities/icons'

export default {
  components: { },
  props: {
    menu: {
      type: [Object, Array],
      required: true,
    },
  },
  emits: ['close-sidebar'],
  setup(props, { emit }) {
    const closeSidebar = (full = false) => {
      emit('close-sidebar', full)
    }

    const mappedMenu = computed(() => props.menu.items?.map(item => ({
      ...item,
      isSelection: item.items.every(i => !!i.selection),
      isMarketing: item.items.every(i => !!i.marketing_cta),
    })))

    return { mappedMenu, closeIcon, chevronLeftIcon, closeSidebar }
  },
  methods: { generateKey, getIconByFeature },
}
</script>

<template>
  <div class="w-full bg-white">
    <div class="overflow-auto max-h-[calc(100vh_-_var(--cmw-top-banner-height))] bg-white js-scroll">
      <!-- Sticky Header -->
      <div class="sticky bg-white z-base flex gap-2 justify-between items-center top-0 left-0 pt-2 px-4">
        <ButtonIcon :icon="chevronLeftIcon" variant="icon" size="22" @click.native="closeSidebar(false)" />
        <div class="text-center">
          {{ menu.name }} <CmwButton variant="text" size="sm" class="block py-0" :label="$t('common.cta.viewAll')" :to="localePath(`/${menu.link}`)" />
        </div>
        <ButtonIcon :icon="closeIcon" variant="icon" size="26" @click.native="closeSidebar(true)" />
      </div>
      <!-- Content -->
      <div class="h-screen">
        <div
          v-for="(item) in mappedMenu"
          :key="generateKey(item.name || `missing`)"
          class="relative w-full py-4"
          :class="item.isSelection ? 'bg-gray-lightest' : 'bg-white px-2'"
        >
          <!-- Selection Case -->
          <template v-if="item.isSelection">
            <div class="overline-2 uppercase text-sm text-secondary-700 font-medium text-center mt-2 mb-4">
              {{ item.name }}
            </div>
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
              :key="generateKey(third_level_name || second_level_name || marketing_cta || 'missing')"
              class="relative"
            >
              <NuxtLink :to="localePath(third_level_link)">
                <Card :bg-url="marketing_image.url" :title="third_level_name" :subtitle="marketing_cta" :icon="icon" />
              </NuxtLink>
            </div>
          </template>
          <template v-else>
            <div class="overline-2 uppercase text-sm text-secondary-700 font-medium text-center mt-2 mb-4">
              {{ item.name }}
            </div>
            <NuxtLink
              v-for="({ third_level_style, third_level_name, third_level_link }) in item.items"
              :key="generateKey(third_level_name || 'missing')"
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
</template>
