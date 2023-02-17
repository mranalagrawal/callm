<script>
import locales from '../../locales-mapper'

export default {
  data() {
    return {
      contents: null,
    }
  },
  async fetch() {
    let lang = locales[this.$i18n.locale]

    // eslint-disable-next-line eqeqeq
    if (lang === 'en-gb' && this.$config.STORE == 'CMW')
      lang = 'en-eu'

    this.contents = (
      await this.$prismic.api.query(
        this.$prismic.predicates.at('document.type', 'call-to-action'),
        { lang },
      )
    ).results
  },
}
</script>

<template>
  <div v-if="contents" class="container-fluid px-md-5 my-5">
    <div class="row">
      <div class="col-12 text-center my-3">
        <h4>{{ contents[0].data["call-to-action"][0].text }}</h4>
      </div>
    </div>
    <div
      class="row cta-banner py-5"
      :style="{
        backgroundImage:
          `linear-gradient(90deg,rgba(0,0,0,0) 10%,rgba(0,0,0,1), rgba(0,0,0,1)),url(${
            contents[0].data.image.url
          })`,
      }"
    >
      <div class="col-12 col-md-7 offset-md-5 py-3">
        <h2 class="cmw-text-white">
          <NuxtLink
            class="cmw-text-white hover:(cmw-text-white cmw-no-underline)"
            :to="contents[0].data.cta_link || '/'"
          >
            {{ contents[0].data.title[0].text }}
          </NuxtLink>
        </h2>
        <p class="lead">
          {{ contents[0].data.subtitle[0].text }}
        </p>
        <NuxtLink
          :to="contents[0].data.cta_link || '/'"
          class="btn btn-outline-light mt-5 px-5"
        >
          {{ contents[0].data.cta_button }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cta-banner {
  border-radius: 10px;
  background-size: cover;
  color: white;
}
</style>
