<script>
import { onMounted, ref } from '@nuxtjs/composition-api'
import DropdownWinery from '../../components/UI/DropdownWinery.vue'
import Loader from '../../components/UI/Loader.vue'

export default {
  components: { DropdownWinery, Loader },
  layout(context) {
    return context.$config.STORE
  },
  setup() {
    // const data = ref(null)
    const limit = ref(5)
    const trigger = ref(null)
    const options = {
      root: null,
      threshold: 0,
    }

    const handleLazyLoad = () => {
      limit.value = limit.value + 5
    }

    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting)
          handleLazyLoad()
      })
    }

    const createObserver = () => {
      const observer = new IntersectionObserver(handleIntersect, options)
      trigger.value && observer.observe(trigger.value)
    }

    onMounted(() => {
      (window.IntersectionObserver)
        ? createObserver()
        : limit.value = 50 // <-- Note: this could be messy, how can we handle this?
    })
    return { trigger, limit }
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
  computed: {
    slicedData() {
      return this.data && this.data.slice(0, this.limit)
    },
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
    this.$nuxt.$on('changecategories', (event) => {
      this.fetchCategories(event)
    })
  },
  methods: {
    resetLazyLoad() {
      scrollTo({ left: 0, top: 0, behavior: 'smooth' })
      this.limit = window.IntersectionObserver ? 5 : 50
    },
    async fetchNext() {
      this.resetLazyLoad()
      const data = await fetch(this.links.next)
      const dataJSON = await data.json()

      this.data = dataJSON.brands.data
      this.links = dataJSON.links
    },
    async fetchPrev() {
      this.resetLazyLoad()
      const data = await fetch(this.links.prev)
      const dataJSON = await data.json()

      this.data = dataJSON.brands.data
      this.links = dataJSON.links
    },
    async fetchRegions(id) {
      this.resetLazyLoad()
      const data = await fetch(`${this.baseURL}?region=${id}`)
      const dataJSON = await data.json()

      this.data = dataJSON.brands.data
      this.links = dataJSON.links
    },
    async fetchProductionTypes(id) {
      this.resetLazyLoad()
      const data = await fetch(`${this.baseURL}?type=${id}`)
      const dataJSON = await data.json()

      this.data = dataJSON.brands.data
      this.links = dataJSON.links
    },
    async fetchCountries(id) {
      this.resetLazyLoad()
      const data = await fetch(`${this.baseURL}?country=${id}`)
      const dataJSON = await data.json()

      this.data = dataJSON.brands.data
      this.links = dataJSON.links
    },
    async fetchCategories(id) {
      this.resetLazyLoad()
      const data = await fetch(`${this.baseURL}?category=${id}`)
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
      <div v-if="filters" class="c-filters col-12 col-md-3 cmw-h-max">
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
        <DropdownWinery
          label="Categories"
          :items="filters.categories"
          keyword="categories"
        />
      </div>
      <div class="col-12 col-md-9">
        <div class="l-brands cmw-grid cmw-grid-cols-2 cmw-gap-4 desktop-wide:(cmw-grid-cols-4)">
          <div
            v-for="brand in slicedData"
            :key="brand.brandId"
            :class="brand.isPartner ? 'cmw-col-span-2' : 'cmw-col-span-2 sm:cmw-col-span-1'"
          >
            <ClientOnly>
              <component :is="brand.isPartner ? 'CardBrandPartner' : 'CardBrand'" :brand="brand" />
            </ClientOnly>
          </div>
        </div>

        <div ref="trigger" class="cmw-w-full cmw-h-4 cmw-text-transparent">
          <!-- Note: lazy load trigger, can't hide this because it loses the observer, v-if="limit < data.length" -->
          lazy-loading-trigger
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

  .c-filters {
    position: sticky;
    top: calc(var(--cmw-header-height) + 40px)
  }
}
</style>
