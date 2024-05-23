<script lang="ts">
import { defineComponent, ref, useFetch } from '@nuxtjs/composition-api'

import readMoreBg from '~/assets/images/enoteca.jpeg'

import { initialPageData } from '~/config/prismicConfig'
import type { IPrismicPageData } from '~/types/prismic'

export default defineComponent({
  setup() {
    const componentData = ref<IPrismicPageData>(initialPageData)
    const showMoreText = ref(false)
    useFetch(async ({ $cmwRepo }) => {
      componentData.value = await $cmwRepo.prismic.getSingle('call-to-action')
    })
    return { componentData, showMoreText, readMoreBg }
  },
})
</script>

<template>
  <div class="max-w-screen-xl mx-auto py-8 px-4 mt-4">
    <div
      v-if="componentData.image?.url"
      :style="{ backgroundImage: `linear-gradient(90deg,rgba(0,0,0,0) 10%,rgba(0,0,0,1), rgba(0,0,0,1)), url('${componentData.image.url}')` }"
      class="rounded-sm overflow-hidden pl-3/12 py-20"
    >
      <PrismicText v-if="componentData.title" class="h2 !text-white" :field="componentData.title" />
      <PrismicRichText v-if="componentData.subtitle" :field="componentData.subtitle" />
      <CmwButton
        class="w-max" variant="ghost-inverse" :label="componentData.cta_button" :to="componentData.cta_link"
      />
    </div>
    <div
      class="relative my-8 bg-auto bg-no-repeat bg-right-top"
      :class="[
        { 'after:(content-DEFAULT absolute w-full h-1/2 bottom-0 left-0 bg-gradient-to-b from-transparent to-white)': !showMoreText },
        { 'min-h-[700px] ': showMoreText },
      ]
      "
      :style="{ backgroundImage: `url('${readMoreBg}')` }"
    >
      <div class="prose w-[min(100%,_60rem)] m-inline-auto pr-1/12">
        <PrismicRichText v-if="componentData.shown" :field="componentData.shown" />
        <transition>
          <PrismicRichText v-if="componentData.hidden && showMoreText" :field="componentData.hidden" />
        </transition>
        <CmwButton
          v-if="!showMoreText" class="relative w-max z-base"
          :label="$t('common.cta.readMore')" variant="ghost" @click.native="showMoreText = true"
        />
      </div>
    </div>
  </div>
</template>
