<script lang="ts">
import type { PropType } from '@nuxtjs/composition-api'
import { defineComponent, toRefs } from '@nuxtjs/composition-api'

import type { IWinery } from '~/types/winery'

export default defineComponent({
  name: 'CardBrand',
  props: {
    winery: {
      type: Object as PropType<IWinery>,
      required: true,
    },
  },

  setup(props) {
    const {
      country,
      handle,
      name,
      region,
      zone,
    } = toRefs(props.winery)

    return {
      country,
      handle,
      name,
      region,
      zone,
    }
  },

})
</script>

<template>
  <NuxtLink :to="localePath({ name: 'winery-handle', params: { handle } })">
    <div
      class="font-sans border border-gray-light rounded-sm border-gray-light overflow-hidden h-full
    hover:shadow-elevation"
    >
      <div class="c-brand__contentContainer h-full flex text-body">
        <div class="c-brand__content p-4">
          <LoadingImage
            img-classes="c-brand__contentImg mx-auto"
            :thumbnail="{
              url: winery.logo.url ? `${winery.logo.url}?&width=20&height=12` : 'https://picsum.photos/id/75/20/12',
              width: 20,
              height: 12,
              altText: winery.logo.altText,
            }"
            :source="{
              url: winery.logo.url ? `${winery.logo.url}?&width=265&height=164` : 'https://picsum.photos/id/75/265/164',
              width: 265,
              height: 164,
              altText: winery.logo.altText,
            }"
          />
          <div>
            <div class="cmw-font-bold text-xl mt-2" v-text="name" />
            <div class="flex gap-4 justify-center justify-items-center">
              <div class="text-secondary-700" v-text="region" />
              <span v-if="zone"> - {{ zone }}</span>
            </div>
            <span class="text-secondary-700" v-text="country" />
          </div>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<style>
.c-brand__contentContainer {
  container: brand-card-content / inline-size;
}

.c-brand__content {
  display: grid;
  grid-template-columns: 1fr;
  width: 100%;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.c-brand__contentImg {
  max-width: 200px;
}

@container brand-card-content (min-width: 500px) {
  .c-brand__content {
    grid-template-columns: 40% 60%;
    text-align: left;
  }

  .c-brand__contentImg {
    max-width: 70%;
  }
}
</style>
