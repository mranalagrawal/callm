<script lang="ts">
import { defineComponent, ref, useFetch } from '@nuxtjs/composition-api'
import readMoreBg from 'assets/images/enoteca.jpeg'
import prismicConfig from '~/config/prismicConfig'
import type { TStores } from '~/config/themeConfig'

export default defineComponent({
  setup() {
    const componentData = ref({
      image: {
        url: '',
      },
      title: '',
      subtitle: '',
      cta_button: '',
      cta_link: '',
      shown: '',
      hidden: '',
    })
    const showMoreText = ref(false)

    useFetch(async ({ $config, $cmwRepo, $handleApiErrors }) => {
      await $cmwRepo.prismic.getSingle({ page: prismicConfig[$config.STORE as TStores]?.components.callToAction })
        .then(({ data }) => {
          componentData.value = data
        })
        .catch((err: Error) => $handleApiErrors(`Catch getting callToAction data from prismic: ${err}`))
    })
    return { componentData, showMoreText, readMoreBg }
  },
})
</script>

<template>
  <div class="cmw-max-w-screen-xl cmw-mx-auto cmw-py-8 cmw-px-4 cmw-mt-4">
    <div
      :style="{ backgroundImage: `linear-gradient(90deg,rgba(0,0,0,0) 10%,rgba(0,0,0,1), rgba(0,0,0,1)), url('${componentData.image.url}')` }"
      class="cmw-rounded-sm cmw-overflow-hidden cmw-pl-3/12 cmw-py-20"
    >
      <PrismicText v-if="componentData.title" class="cmw-h2 !cmw-text-white" :field="componentData.title" />
      <PrismicRichText v-if="componentData.subtitle" :field="componentData.subtitle" />
      <Button
        class="cmw-w-max" variant="ghost-inverse" :label="componentData.cta_button" :to="componentData.cta_link"
      />
    </div>
    <div
      class="cmw-relative cmw-my-8 cmw-bg-auto cmw-bg-no-repeat cmw-bg-right-top"
      :class="[
        { 'after:(cmw-content-DEFAULT cmw-absolute cmw-w-full cmw-h-1/2 cmw-bottom-0 cmw-left-0 cmw-bg-gradient-to-b cmw-from-transparent cmw-to-white)': !showMoreText },
        { 'cmw-min-h-[700px] ': showMoreText },
      ]
      "
      :style="{ backgroundImage: `url('${readMoreBg}')` }"
    >
      <div class="cmw-w-[min(100%,_60rem)] cmw-m-inline-auto cmw-pr-1/12">
        <PrismicRichText v-if="componentData.shown" :field="componentData.shown" />
        <transition>
          <PrismicRichText v-if="componentData.hidden && showMoreText" :field="componentData.hidden" />
        </transition>
        <Button
          v-if="!showMoreText" class="cmw-relative cmw-w-max cmw-z-base"
          :label="$t('common.cta.readMore')" variant="ghost" @click.native="showMoreText = true"
        />
      </div>
    </div>
  </div>
</template>
