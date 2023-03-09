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
    'it': 'https://www.callmewine.com/contatti.html',
    'en': 'https://www.callmewine.com/en/contatti.html',
    'fr': 'https://www.callmewine.fr/contatti.html',
    'de': 'https://www.callmewine.de/contatti.html',
    'en-gb': 'https://callmewine.co.uk/contact',
  },
  async fetch() {
    let lang = ''
    if (this.$i18n.locale === 'en')
      lang = 'en-gb'
    else
      lang = 'it-it'

    const response = await this.$prismic.api.getSingle(
      documents[this.$config.STORE].contactPage,
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
  <div v-if="data" class="container mt-5">
    <div class="row">
      <div class="col-12">
        <h1>{{ data.title }}</h1>
      </div>
      <div class="col-12">
        <img :src="data.image.url" class="img-fluid w-100" alt="">
      </div>
    </div>
    <div class="row mt-5">
      <div v-for="(content, j) in data.section" :key="j" class="col-12">
        <prismic-rich-text :field="[content]" />
      </div>
    </div>
  </div>
</template>
