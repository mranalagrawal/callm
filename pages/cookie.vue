<script>
import { defineComponent, onMounted, ref, useContext, useFetch, useMeta } from '@nuxtjs/composition-api'
import { generateHeadHreflang } from '@/utilities/arrays'

export default defineComponent({
  layout(context) {
    return context.$config.STORE
  },
  setup() {
    const { i18n, $prismic, $sentry, $cmwGtmUtils } = useContext()

    const hrefLang = {
      'it': 'https://www.callmewine.com/chi-siamo.html',
      'en': 'https://www.callmewine.com/en/about-us.html',
      'fr': 'https://www.callmewine.fr/qui-nous-sommes.html',
      'de': 'https://www.callmewine.de/uber-uns.html',
      'en-gb': 'https://callmewine.co.uk/about-us',
    }

    const pageData = ref({ section: [] })
    const sectionContent = ref({ section: [] })

    const { fetch } = useFetch(async () => {
      await $prismic.api.getSingle(
        'cookie-policy',
        { lang: i18n.localeProperties.iso.toLowerCase() },
      )
        .then(({ data }) => {
          pageData.value = data
          sectionContent.value = data.section[0] ? data.section : []
        })
        .catch((err) => {
          $sentry.captureException(new Error(`Catch getting cookies data from prismic: ${err}`))
        })
    })

    onMounted(() => {
      process.browser && $cmwGtmUtils.pushPage('page')
    })

    useMeta(() => ({
      link: generateHeadHreflang(hrefLang),
      /* script: {
        id: 'CookieDeclaration',
        src: 'https://consent.cookiebot.com/55bb6862-88ec-43e6-bd22-95823a1ed6ad/cd.js',
        hid: 'cookie-declaration',
        async: true,
      }, */
    }))

    return { fetch, pageData, sectionContent }
  },
  head: {},
})
</script>

<template>
  <div v-if="pageData.title" class="cmw-max-w-screen-xl cmw-mx-auto cmw-p-4 cmw-mt-5">
    <h1 v-text="pageData.title" />
    <LoadingImage
      v-if="pageData.image"
      :thumbnail="{
        url: pageData.image.url ? `${pageData.image.url}?&width=20&height=12` : 'https://picsum.photos/id/75/20/12',
        width: 20,
        height: 12,
        altText: pageData.image.alt,
      }"
      :source="{
        url: pageData.image.url
          ? `${pageData.image.url}?&width=${pageData.image.dimensions.width}&height=${pageData.image.dimensions.height}`
          : 'https://picsum.photos/id/75/265/164',
        width: pageData.image.dimensions.width,
        height: pageData.image.dimensions.height,
        altText: pageData.image.alt,
      }"
    />
    <div v-for="(section, i) in sectionContent" :key="i" class="cmw-mt-5">
      <PrismicRichText :field="[section]" />
    </div>
    <script id="CookieDeclaration" src="https://consent.cookiebot.com/55bb6862-88ec-43e6-bd22-95823a1ed6ad/cd.js" async />
  </div>
</template>
