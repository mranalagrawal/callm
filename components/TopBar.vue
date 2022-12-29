<template>
  <div
    ref="topBar"
    class="container-fluid text-center
     cmw-bg-secondary cmw-fixed cmw-top-0 cmw-left-0 cmw-z-1050 cmw-text-white cmw-uppercase cmw-py-1
     cmw-overline-1 md:cmw-overline-2"
  >
    <span
      v-if="data"
      v-html="data.data.text[0].text"
    />
  </div>
</template>

<script>
import documents from "../prismic-mapper";
import locales from "../locales-mapper";
import {useHeaderSize} from "~/store/headerSize";
import {nextTick, onMounted, onUnmounted, ref} from "@nuxtjs/composition-api";
import debounce from "lodash.debounce";
export default {
  watch: {
    "$i18n.locale": "$fetch",
  },
  setup() {
    const headerSize = useHeaderSize()
    const topBar = ref(null)

    const resizeListener = debounce( function () {
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

    return { headerSize, topBar }
  },
  data: () => ({
    selectedItem: "",
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

    let lang = locales[this.$i18n.locale];
    if (lang == "en-gb" && this.$config.STORE == "CMW") {
      lang = "en-eu";
    }

    this.data = await this.$prismic.api.getSingle(
      documents[this.$config.STORE].topbar,
      { lang: lang }
    );
  },
};
</script>
