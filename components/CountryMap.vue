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
  <div class="cmw-w-full cmw-relative cmw-h-400px cmw-my-8">
    <div class="cmw-flex cmw-h-400px md:(cmw-max-w-[60%] cmw-mx-auto)">
      <VueSvgIcon
        v-if="country && currentMap" ref="mapRef"
        class="!cmw-h-full cmw-max-h-360px cmw-my-auto"
        :data="require(`@/assets/svg/maps/${currentMap}`)" width="100%" original
      />
    </div>
    <!-- Todo: Handle width dynamically based on logo's orientation -->
    <img :src="logo" :alt="logo" class="cmw-absolute cmw-top-4 cmw-right-4 cmw-max-w-[100px]">
  </div>
</template>
