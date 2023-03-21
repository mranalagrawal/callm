<script>
export default {
  layout(context) {
    return context.$config.STORE
  },
  data() {
    return {
      product: null,
      inputParameters: {},
      hasResults: false,
    }
  },
  created() {
    if (['profile', 'blog'].includes(this.$route.name))
      return

    /* const path = this.$route.path; */
    const path = this.$route.params.handle
    // check if product page
    const isProduct = /[P][0-9]+/
    if (isProduct.test(path)) {
      this.product = `P${this.$route.path.split('-P')[1].replace('.htm', '')}`
      this.hasResults = true
      return
    }

    // rules
    const filters = [
      { name: 'winelists', rule: /[V][0-9]+/ },
      { name: 'categories', rule: /[C][0-9]+/ },
      { name: 'regions', rule: /[R][0-9]+/ },
      { name: 'dosagecontents', rule: /[D][0-9]+/ },
      { name: 'brands', rule: /[B][0-9]+/ },
      { name: 'countries', rule: /[N][0-9]+/ },
      { name: 'macrocategories', rule: /[M][0-9]+/ },
      { name: 'selections', rule: null },
    ]

    // loop and assign, MUST BE this way
    filters.forEach((el) => {
      if (el.name !== 'selections' && path.match(el.rule)) {
        // console.log('MATCHED >>> ', el.rule, path)
        this.inputParameters[el.name] = path.match(el.rule)[0].substring(1)
      }
      if (el.name === 'selections') {
        if (this.$route.fullPath.split('?sel=')[1]) {
          const selectionsInQuery = this.$route.fullPath
            .split('?sel=')[1]
            .split(',')
          selectionsInQuery.forEach(
            selection => (this.inputParameters[selection] = true),
          )
        }
      }
    })

    const noFilterInURL = filters
      .filter(el => el.rule !== null)
      .every(el => !el.rule.test(path))

    const noSelection = !this.$route.fullPath.split('?sel=')[1]

    this.hasResults = !(noFilterInURL && noSelection)
    /* // Todo: throw Error(redirect) // 404
    if (!this.hasResults) {
      return this.$nuxt.error({
        statusCode: 404,
        message: 'No results',
      })
    } */
  },
}
</script>

<template>
  <div>
    <div v-if="hasResults">
      <div v-if="product">
        <ProductDetails :product="product" />
      </div>
      <div v-else>
        <search-filter :input-parameters="{ ...$route.query, ...inputParameters }" />
      </div>
    </div>
    <div v-else class="cmw-relative cmw-text-center cmw-mt-12">
      <div class="md:(cmw-grid cmw-grid-cols-2 cmw-items-center)">
        <img
          class="cmw-w-3/4 cmw-mx-auto" :src="require('assets/images/wine-stain.png')"
          alt="empty-bottles"
        >
        <div class="cmw-text-left">
          <h2 class="cmw-h1 cmw-text-secondary" v-text="$t('notFoundTitle')" />
          <p class="cmw-mb-8 md:cmw-w-3/5" v-text="$t('notFoundLine')" />
        </div>
      </div>
    </div>
  </div>
</template>
