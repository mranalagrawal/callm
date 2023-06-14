<script>
import { computed, onMounted, ref, useContext } from '@nuxtjs/composition-api'
import themeConfig from '~/config/themeConfig'

export default {
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
    const mapRef = ref(null)
    const { $config } = useContext()
    const getMap = country => ({
      belgio: 'belgium.svg',
      be: 'belgium.svg',
      belgium: 'belgium.svg',
      italia: 'italy.svg',
      it: 'italy.svg',
      fr: 'france.svg',
      france: 'france.svg',
      francia: 'france.svg',
    })[country]

    const currentMap = computed(() => getMap(props.country.toLowerCase()))

    const paintRegion = () => {
      const region = mapRef.value && mapRef.value.querySelector(`[aria-valuetext='${props.region.toLowerCase()}']`)

      if (region)
        region.setAttribute('fill', themeConfig[$config.STORE].colors.primary.DEFAULT)
    }

    onMounted(() => {
      paintRegion()
    })

    return { mapRef, getMap, currentMap }
  },
}
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
