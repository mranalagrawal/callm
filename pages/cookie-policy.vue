<script>
import documents from '../prismic-mapper'

export default {
  layout(context) {
    return context.$config.STORE
  },
  data() {
    return {
      data: null,
    }
  },
  async fetch() {
    let lang = ''
    if (this.$i18n.locale == 'en')
      lang = 'en-gb'
    else
      lang = 'it-it'

    const response = await this.$prismic.api.getSingle(
      documents[this.$config.STORE].cookiePage,
      {
        lang,
      },
    )
    const data = response.data
    this.data = data
  },
  head() {
    return {
      meta: [{
        script: [
          {
            src: 'https://consent.cookiebot.com/55bb6862-88ec-43e6-bd22-95823a1ed6ad/cd.js',
            id: 'CookieDeclaration',
          },
        ],
      }],
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
      <div id="CookieDeclaration" />
    </div>
  </div>
</template>
