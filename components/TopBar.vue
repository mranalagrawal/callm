<script>
import { nextTick, onMounted, onUnmounted, ref, watch } from '@nuxtjs/composition-api'
import debounce from 'lodash.debounce'
import documents from '../prismic-mapper'
import locales from '../locales-mapper'
import { useHeaderSize } from '~/store/headerSize'
export default {
  setup() {
    const headerSize = useHeaderSize()
    const topBar = ref(null)

    const resizeListener = debounce(() => {
      headerSize.$patch({
        topBarHeight: topBar.value ? topBar.value.getBoundingClientRect().height : 0,
      })
    }, 400)

    onMounted(() => {
      window.addEventListener('resize', resizeListener)
      nextTick(() => resizeListener())
    })

    onUnmounted(() => {
      window.removeEventListener('resize', resizeListener)
    })

    watch(() => headerSize, () => {
      resizeListener()
    }, { deep: true })

    return { headerSize, topBar }
  },
  data: () => ({
    selectedItem: '',
    selectedContent: null,
    data: null,
    document: null,
  }),
  async fetch() {
    /* let lang = "";
    if (this.$i18n.locale == "en") {
      lang = "en-gb";
    } else if (this.$i18n.locale == "de") {
      lang = "de-de";
    } else {
      lang = "it-it";
    } */

    let lang = locales[this.$i18n.locale]
    if (lang === 'en-gb' && this.$config.STORE === 'CMW')
      lang = 'en-eu'

    this.data = await this.$prismic.api.getSingle(
      documents[this.$config.STORE].topbar,
      { lang },
    )
  },
  watch: {
    '$i18n.locale': '$fetch',
  },
}
</script>

<template>
  <div
    ref="topBar"
    class="cmw-w-screen cmw-px-4 cmw-text-center
     cmw-bg-secondary cmw-fixed cmw-top-0 cmw-left-0 cmw-z-1050 cmw-text-white cmw-uppercase cmw-py-1
     cmw-overline-1 md:cmw-overline-2"
  >
    <span
      v-if="data"
      v-html="data.data.text[0].text"
    />
  </div>
</template>
