<script>
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
    'it': 'https://www.callmewine.com/enoteche-ristoranti.html',
    'en': 'https://www.callmewine.com/en/restaurants-Wineshops.html',
    'fr': 'https://www.callmewine.fr/cave-%C3%A0-vins-ou-restaurants.html',
    'de': 'https://www.callmewine.de/%C3%96nothek-Restaurants.html',
    'en-gb': 'https://callmewine.co.uk/restaurants-wineshops',
  },
  async fetch() {
    let lang = ''
    if (this.$i18n.locale === 'en')
      lang = 'en-gb'
    else
      lang = 'it-it'

    const response = await this.$prismic.api.getSingle(
      'restaurants-wineshops',
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
