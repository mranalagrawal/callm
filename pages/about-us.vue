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
    'it': 'https://www.callmewine.com/chi-siamo.html',
    'en': 'https://www.callmewine.com/en/about-us.html',
    'fr': 'https://www.callmewine.fr/qui-nous-sommes.html',
    'de': 'https://www.callmewine.de/uber-uns.html',
    'en-gb': 'https://callmewine.co.uk/about-us',
  },
  async fetch() {
    let lang = ''
    if (this.$i18n.locale === 'en')
      lang = 'en-gb'
    else
      lang = 'it-it'

    const data = await this.$prismic.api.getSingle(
      documents[this.$config.STORE].aboutUs,
      { lang },
    )
    this.data = data.data
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
        <img :src="data.image.url" class="img-fluid w-100" alt="">
      </div>
    </div>
    <div v-for="(section, i) in data.section" :key="i" class="row mt-5">
      <div
        v-for="(content, j) in section.section_content"
        :key="j"
        class="col-12"
      >
        <!-- <prismic-rich-text :field="content.text" /> -->
        <prismic-rich-text :field="[content]" />

        <!-- {{ content }} -->
      </div>
    </div>
  </div>
</template>
