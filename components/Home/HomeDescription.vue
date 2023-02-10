<script>
import locales from '../../locales-mapper'
export default {
  data: () => ({
    shown: '',
    hidden: '',
    button_text: '',
    readMore: false,
  }),
  async fetch() {
    let lang = locales[this.$i18n.locale]

    if (lang == 'en-gb' && this.$config.STORE == 'CMW')
      lang = 'en-eu'

    const data = await this.$prismic.api.getSingle('home-description', {
      lang,
    })
    this.shown = data.data.shown
    this.hidden = data.data.hidden
    this.button_text = data.data.button_text
  },
  watch: {
    '$i18n.locale': '$fetch',
  },
}
</script>

<template>
  <div class="container-fluid background">
    <div class="container">
      <div class="row">
        <div class="col-12 col-md-8">
          <p
            class="lead d-none d-mb-block"
            style="font-size: 2rem; line-height: 1.5"
          >
            Callmewine, la tua enoteca online, il tuo personale sommelier
          </p>
          <p
            class="d-md-none text-center font-weight-bold"
            style="font-size: 1.6rem"
          >
            Callmewine, la tua enoteca online, il tuo personale sommelier
          </p>
          <p class="">
            {{ shown }}
          </p>
          <p :class="!readMore && 'd-none'">
            {{ hidden }}
          </p>
          <button
            v-if="!readMore"
            class="btn px-3 py-2 text-uppercase view-more"
            style="font-weight: 700"
            @click="readMore = true"
          >
            {{ button_text }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.background {
  background-image: url("../../assets/images/enoteca.jpeg") !important;
  background-position: right;
  background-repeat: no-repeat;
}
</style>
