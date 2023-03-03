<script>
import documents from '../prismic-mapper'
import { generateHeadHreflang } from '@/utilities/arrays'

export default {
  layout(context) {
    return context.$config.STORE
  },
  data() {
    return {
      data: null,
    }
  },
  hrefLang: {
    'it': 'https://www.callmewine.com/cookies.html',
    'en': 'https://www.callmewine.com/en/cookies.html',
    'fr': 'https://www.callmewine.fr/cookies.html',
    'de': 'https://www.callmewine.de/cookies.html',
    'en-gb': 'https://callmewine.co.uk/cookie-policy',
  },
  async fetch() {
    let lang = ''
    if (this.$i18n.locale === 'en')
      lang = 'en-gb'
    else
      lang = 'it-it'

    const response = await this.$prismic.api.getSingle(
      documents[this.$config.STORE].cookiePage,
      {
        lang,
      },
    )
    this.data = response.data
  },
  head() {
    return {
      link: generateHeadHreflang(this.$options.hrefLang),
    }
  },
}
</script>

<template>
  <div v-if="data" class="container-fluid px-md-5 mt-5">
    <div class="row">
      <div class="col-12">
        <h1>{{ data.title }}</h1>
      </div>
      <div class="col-12">
        <img
          v-if="data.image.url"
          :src="data.image.url"
          class="img-fluid w-100"
          alt=""
        >
      </div>
    </div>
    <div class="row mt-5">
      <div v-for="(content, j) in data.section" :key="j" class="col-12">
        <prismic-rich-text :field="[content]" />
      </div>
      <script id="CookieDeclaration" src="https://consent.cookiebot.com/55bb6862-88ec-43e6-bd22-95823a1ed6ad/cd.js" async />
    </div>
  </div>
</template>
