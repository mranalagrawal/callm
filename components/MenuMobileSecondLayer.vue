<script>
import { computed, useContext, useRouter } from '@nuxtjs/composition-api'
import closeIcon from 'assets/svg/close.svg'
import chevronLeftIcon from 'assets/svg/chevron-left.svg'
import { generateKey } from '~/utilities/strings'
import { getIconByFeature } from '@/utilities/icons'

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
    const { localeLocation } = useContext()
    const router = useRouter()
    const closeSidebar = (full = false) => {
      emit('close-sidebar', full)
    }

    const mappedMenu = computed(() => props.menu.items?.map(item => ({
      ...item,
      isSelection: item.items.every(i => !!i.selection),
      isMarketing: item.items.every(i => !!i.marketing_cta),
    })))

    const handleMarketingClick = (to) => {
      router.push(localeLocation((to)))
    }

    return { mappedMenu, closeIcon, chevronLeftIcon, closeSidebar, handleMarketingClick }
  },
  methods: { generateKey, getIconByFeature },
}
</script>

<template>
  <div class="cmw-w-full cmw-bg-white">
    <div class="cmw-overflow-auto cmw-max-h-[calc(100vh_-_var(--cmw-top-banner-height))] cmw-bg-white js-scroll">
      <!-- Sticky Header -->
      <div class="cmw-sticky cmw-bg-white cmw-z-base cmw-flex cmw-gap-2 cmw-justify-between cmw-items-center cmw-top-0 cmw-left-0 cmw-pt-2 cmw-px-4">
        <ButtonIcon :icon="chevronLeftIcon" variant="icon" :size="22" @click.native="closeSidebar(false)" />
        <div class="cmw-text-center">
          {{ menu.name }} <Button variant="text" size="sm" class="cmw-block cmw-py-0" label="vedi tutti" :to="localePath(`/${menu.link}`)" />
        </div>
        <ButtonIcon :icon="closeIcon" variant="icon" :size="26" @click.native="closeSidebar(true)" />
      </div>
      <!-- Content -->
      <div class="cmw-h-screen">
        <div
          v-for="(item) in mappedMenu"
          :key="generateKey(item.name || `missing`)"
          class="cmw-relative cmw-w-full cmw-py-4"
          :class="item.isSelection ? 'cmw-bg-gray-lightest' : 'cmw-bg-white cmw-px-2'"
        >
          <!-- Selection Case -->
          <template v-if="item.isSelection">
            <div class="cmw-overline-2 cmw-uppercase cmw-text-sm cmw-text-secondary-700 cmw-font-medium cmw-text-center cmw-mt-2 cmw-mb-4">
              {{ item.name }}
            </div>
            <div class="cmw-flex cmw-flex-wrap cmw-items-center cmw-justify-center">
              <div
                v-for="({ third_level_name, third_level_link, second_level_name, second_level_link, selection }) in item.items"
                :key="generateKey(third_level_name || second_level_name)"
                class="cmw-basis-4/12 cmw-flex-grow-0 cmw-flex-shrink-1 cmw-p-2"
              >
                <NuxtLink
                  :to="localePath(third_level_link || second_level_link)"
                  class="
                  cmw-grid cmw-grid-rows-[50px_50px] cmw-items-center cmw-justify-items-center cmw-content-center
                  cmw-bg-white cmw-border cmw-border-gray-light cmw-rounded cmw-text-center cmw-text-primary-400 cmw-fill-primary-400 cmw-pt-4
                  hover:(cmw-no-underline)
"
                >
                  <VueSvgIcon
                    :data="require(`@/assets/svg/${getIconByFeature(selection)}.svg`)"
                    class="cmw-block"
                    width="44"
                    height="auto"
                  />
                  <div class="cmw-text-xs cmw-text-body hover:(cmw-text-body cmw-no-underline)">
                    {{ third_level_name }}
                  </div>
                </NuxtLink>
              </div>
            </div>
          </template>
          <!-- Marketing Case -->
          <template v-else-if="item.isMarketing">
            <div class="cmw-overline-2 cmw-uppercase cmw-text-sm cmw-text-secondary-700 cmw-font-medium cmw-text-center cmw-mt-2 cmw-mb-4">
              {{ item.name }}
            </div>
            <div
              v-for="({ marketing_image, third_level_name, third_level_link, second_level_name, marketing_cta, icon }) in item.items"
              :key="generateKey(third_level_name || second_level_name || marketing_cta || 'missing')"
              class="cmw-relative"
            >
              <Card
                :bg-url="marketing_image.url" :title="third_level_name" :subtitle="marketing_cta" :icon="icon"
                @click.native="handleMarketingClick(third_level_link)"
              />
            </div>
          </template>
          <template v-else>
            <div class="cmw-overline-2 cmw-uppercase cmw-text-sm cmw-text-secondary-700 cmw-font-medium cmw-text-center cmw-mt-2 cmw-mb-4">
              {{ item.name }}
            </div>
            <NuxtLink
              v-for="({ third_level_style, third_level_name, third_level_link }) in item.items"
              :key="generateKey(third_level_name || 'missing')"
              :to="localePath(third_level_link)"
              class="cmw-relative cmw-flex cmw-justify-between cmw-items-center cmw-w-full cmw-py-4 cmw-px-2"
            >
              <span
                class="cmw-text-sm cmw-font-light cmw-tracking-wide hover:(cmw-text-body cmw-no-underline)"
                :class="third_level_style ? 'cmw-text-primary-400' : 'cmw-text-body' "
              >{{ third_level_name }}</span>
              <span class="cmw-absolute cmw-w-[calc(100%_-_1rem)] cmw-left-2 cmw-bottom-0 cmw-h-px cmw-bg-gray-light" />
            </NuxtLink>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
