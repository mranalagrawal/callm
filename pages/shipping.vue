<script>
import documents from '../prismic-mapper'
import locales from '../locales-mapper'

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
    let lang = locales[this.$i18n.locale]
    if (lang === 'en-gb' && this.$config.STORE === 'CMW')
      lang = 'en-eu'

    const response = await this.$prismic.api.getSingle(
      documents[this.$config.STORE].shippingPage,
      {
        lang,
      },
    )

    this.data = response.data
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
