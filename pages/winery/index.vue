<script>
import { computed, onMounted, ref, useContext, useFetch, useRoute, useRouter } from '@nuxtjs/composition-api'
import DropdownWinery from '../../components/UI/DropdownWinery.vue'
import Loader from '../../components/UI/Loader.vue'
import useGtm from '@/components/composables/useGtm'

export default {
  components: { DropdownWinery, Loader },
  layout(context) {
    return context.$config.STORE
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const { gtmPushPage } = useGtm()

    const data = ref(null)
    const linksRef = ref(null)
    const allFilters = ref(null)
    const selectedFilters = ref(null)
    const limit = ref(5)
    const trigger = ref(null)
    const options = {
      root: null,
      threshold: 0,
    }

    const { $http, $config } = useContext()

    useFetch(async () => {
      if (!allFilters.value) {
        // TODO: get a decent API 'brands-filters' that returns only brands.filters
        const data = await $http.$get(`${$config.ELASTIC_URL}brands`)
        allFilters.value = data.brands.filters
      }

      await $http.$get(`${$config.ELASTIC_URL}brands`, {
        searchParams: route.value.query,
      }).then(({ brands, links }) => {
        data.value = brands.data.sort((a, b) => b.isPartner - a.isPartner)
        linksRef.value = links
        selectedFilters.value = brands.filters
      })
    })

    const slicedData = computed(() => data.value && data.value.slice(0, limit.value))

    const resetLazyLoad = () => {
      scrollTo({ left: 0, top: 0, behavior: 'smooth' })
      limit.value = window.IntersectionObserver ? 5 : 50
    }

    const fetchPrev = () => {
      resetLazyLoad()
      const url = new URL(linksRef.value.prev)
      const cursor = url.searchParams.get('cursor')

      const query = {
        ...route.value.query,
        cursor,
      }
      router.push({ path: '/winery', query })
    }

    const fetchNext = () => {
      resetLazyLoad()
      const url = new URL(linksRef.value.next)
      const cursor = url.searchParams.get('cursor')

      const query = {
        ...route.value.query,
        cursor,
      }
      router.push({ path: '/winery', query })
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
      scrollTo({ left: 0, top: 0, behavior: 'smooth' })
      const observer = new IntersectionObserver(handleIntersect, options)
      trigger.value && observer.observe(trigger.value)
    }

    onMounted(() => {
      process.browser && gtmPushPage('page');
      (window.IntersectionObserver)
        ? createObserver()
        : limit.value = 50 // <-- Note: this could be messy, how can we handle this?
    })

    const fetchBrands = (params) => {
      resetLazyLoad()

      const { cursor, ...rest } = route.value.query

      const query = {
        ...rest,
        [params.keyword]: params.id,
      }
      router.push({ path: '/winery', query })
    }

    return { data, slicedData, linksRef, allFilters, selectedFilters, trigger, limit, fetchBrands, fetchPrev, fetchNext }
  },
  watch: {
    '$route.query': '$fetch',
  },
  created() {
    this.$nuxt.$on('update-query', (event) => {
      this.fetchBrands(event)
    })
  },
}
</script>

<template>
  <div class="container-fluid px-md-5 mt-5">
    <div class="row">
      <div v-if="data && allFilters" class="c-filters col-12 col-md-3 cmw-h-max">
        <DropdownWinery
          label="Production Types"
          :items="allFilters.productionTypes"
          keyword="type"
        />
        <DropdownWinery
          label="Regions"
          :items="allFilters.regions"
          keyword="region"
        />
        <DropdownWinery
          label="Country"
          :items="allFilters.countries"
          keyword="country"
        />
        <DropdownWinery
          label="Categories"
          :items="allFilters.categories"
          keyword="category"
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
            v-if="linksRef.prev"
            class="btn text-light-secondary"
            @click="fetchPrev"
            v-text="$t('common.cta.prevPage')"
          />
          <button
            v-if="linksRef.next"
            class="btn text-light-secondary"
            @click="fetchNext"
            v-text="$t('common.cta.nextPage')"
          />
        </div>
      </div>
    </div>
    <Loader v-if="$fetchState.pending" />
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
