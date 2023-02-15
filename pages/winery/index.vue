<script>
import DropdownWinery from '../../components/UI/DropdownWinery.vue'
import Loader from '../../components/UI/Loader.vue'

export default {
  components: { DropdownWinery, Loader },
  layout(context) {
    return context.$config.STORE
  },
  data() {
    return {
      data: null,
      links: null,
      filters: null,
      loading: null,
      baseURL: `${this.$config.ELASTIC_URL}brands`,
    }
  },
  async fetch() {
    this.loading = true
    const data = await fetch(this.baseURL)
    const dataJSON = await data.json()

    this.data = dataJSON.brands.data.sort((a, b) => b.isPartner - a.isPartner)
    this.links = dataJSON.links
    this.filters = dataJSON.brands.filters

    this.loading = false
  },
  created() {
    this.$nuxt.$on('changeregions', (event) => {
      this.fetchRegions(event)
    })
    this.$nuxt.$on('changeproductionTypes', (event) => {
      this.fetchProductionTypes(event)
    })
    this.$nuxt.$on('changecountries', (event) => {
      this.fetchCountries(event)
    })
  },
  methods: {
    async fetchNext() {
      const data = await fetch(this.links.next)
      const dataJSON = await data.json()

      this.data = dataJSON.brands.data
      this.links = dataJSON.links
    },
    async fetchPrev() {
      const data = await fetch(this.links.prev)
      const dataJSON = await data.json()

      this.data = dataJSON.brands.data
      this.links = dataJSON.links
    },
    async fetchRegions(id) {
      const data = await fetch(`${this.baseURL}?region=${id}`)
      const dataJSON = await data.json()

      this.data = dataJSON.brands.data
      this.links = dataJSON.links
    },
    async fetchProductionTypes(id) {
      const data = await fetch(`${this.baseURL}?type=${id}`)
      const dataJSON = await data.json()

      this.data = dataJSON.brands.data
      this.links = dataJSON.links
    },
    async fetchCountries(id) {
      const data = await fetch(`${this.baseURL}?country=${id}`)
      const dataJSON = await data.json()

      this.data = dataJSON.brands.data
      this.links = dataJSON.links
    },
  },
}
</script>

<template>
  <div class="container-fluid px-md-5 mt-5">
    <div v-if="data" class="row">
      <div v-if="filters" class="col-12 col-md-3">
        <DropdownWinery
          label="Production Types"
          :items="filters.productionTypes"
          keyword="productionTypes"
        />
        <DropdownWinery
          label="Regions"
          :items="filters.regions"
          keyword="regions"
        />
        <DropdownWinery
          label="Country"
          :items="filters.countries"
          keyword="countries"
        />
      </div>
      <div class="col-12 col-md-9">
        <div class="l-brands cmw-grid cmw-grid-cols-2 cmw-gap-4 desktop-wide:(cmw-grid-cols-4)">
          <div
            v-for="brand in data"
            :key="brand.brandId"
            :class="brand.isPartner ? 'cmw-col-span-2' : 'cmw-col-span-2 sm:cmw-col-span-1'"
          >
            <ClientOnly>
              <component :is="brand.isPartner ? 'CardBrandPartner' : 'CardBrand'" :brand="brand" />
            </ClientOnly>
          </div>
        </div>

        <div v-if="data" class="row justify-content-between">
          <button
            v-if="links.prev"
            class="btn text-light-secondary"
            @click="fetchPrev"
            v-text="$t('common.cta.prevPage')"
          />
          <button
            v-if="links.next"
            class="btn text-light-secondary"
            @click="fetchNext"
            v-text="$t('common.cta.nextPage')"
          />
        </div>
      </div>
    </div>
    <Loader v-if="loading" />
  </div>
</template>

<style scoped>
@screen md {
  .l-brands {
    grid-auto-rows: 330px;
  }
}
</style>
