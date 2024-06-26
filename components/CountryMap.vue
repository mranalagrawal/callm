<script lang="ts">
import { computed, defineComponent, onMounted, ref } from '@nuxtjs/composition-api'

import { generateKey } from '~/utilities/strings'

export default defineComponent({
  name: 'CountryMap',
  props: {
    logo: {
      type: String,
    },
    country: {
      type: String,
    },
    region: {
      type: String,
    },
  },
  setup(props) {
    const mapRef = ref<HTMLDivElement | null>(null)
    const getMap = (country: string) => ({
      belgio: 'belgium.svg',
      be: 'belgium.svg',
      belgium: 'belgium.svg',
      italia: 'italy.svg',
      it: 'italy.svg',
      fr: 'france.svg',
      france: 'france.svg',
      francia: 'france.svg',
    })[country]

    const currentMap = computed(() => props.country && getMap(props.country.toLowerCase()))

    const paintRegion = () => {
      if (!mapRef.value || !props.region) { return }

      const region = mapRef.value.querySelector(`[aria-valuetext='${generateKey(props.region)}']`)

      if (region instanceof Element) {
        region.setAttribute('fill', '#992545')
      }
    }

    onMounted(() => {
      paintRegion()
    })

    return { mapRef, getMap, currentMap }
  },
})
</script>

<template>
  <div class="w-full relative h-400px my-8">
    <div class="flex h-400px md:(max-w-[60%] mx-auto)">
      <VueSvgIcon
        v-if="country && currentMap" ref="mapRef"
        class="!h-full max-h-360px my-auto"
        :data="require(`@/assets/svg/maps/${currentMap}`)" width="100%" original
      />
    </div>
    <!-- Todo: Handle width dynamically based on logo's orientation -->
    <img v-if="logo" :src="logo" :alt="logo" class="absolute top-4 right-4 max-w-[100px]">
  </div>
</template>
