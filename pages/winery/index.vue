<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  useContext,
  useFetch,
  useRoute,
  useRouter, watch,
} from '@nuxtjs/composition-api'
import type { RawLocation } from 'vue-router'
import Loader from '../../components/UI/Loader.vue'
import type { IOptions } from '~/types/types'

interface ILinksRef {
  first: string
  last: string
  next: URL | string
  prev: URL | string
}

interface IAllFilters {
  categories: IOptions[]
  countries: IOptions[]
  productionTypes: IOptions[]
  regions: IOptions[]
}

export default defineComponent({
  components: { Loader },
  layout({ $config }) {
    return $config.STORE
  },
  setup() {
    const { $http, $config, localeLocation } = useContext()
    const { $cmwGtmUtils } = useContext()
    const route = useRoute()
    const router = useRouter()

    const cmwActiveSelect = ref('')
    const data = ref([])
    const linksRef = ref<ILinksRef>({ first: '', last: '', next: '', prev: '' })
    const allFiltersRaw = ref({})
    const limit = ref(5)
    const trigger = ref(null)
    const options = {
      root: null,
      threshold: 0,
    }

    const getType = (key = ''): string => ({
      productionTypes: 'type',
      regions: 'region',
      countries: 'country',
      categories: 'category',
    })[key] || ''

    const { fetch } = useFetch(async () => {
      if (!Object.keys(allFiltersRaw.value).length) {
        await $http.$get(`${$config.ELASTIC_URL}brands`)
          .then((response) => {
            const { brands } = response as { brands: { filters: Record<string, any> } }

            allFiltersRaw.value = brands.filters
          })
      }

      const searchParams = route.value.query as { [key: string]: string | number | boolean }

      await $http.$get(`${$config.ELASTIC_URL}brands`, {
        searchParams,
      }).then((response) => {
        const { brands, links } = response as { brands: Record<string, any>; links: ILinksRef }
        data.value = brands.data.sort((a: { isPartner: number }, b: { isPartner: number }) => b.isPartner - a.isPartner)
        linksRef.value = links
      })
    })

    const allFilters = computed(() => {
      let newFilters: IAllFilters = {
        categories: [],
        countries: [],
        productionTypes: [],
        regions: [],
      }

      Object.entries(allFiltersRaw.value).forEach(([k, v]) => {
        newFilters = {
          ...newFilters,
          [k]: Object.values(v as Record<string, any>).map((value) => {
            const { name, id } = value as { name: string; id: string | number }
            return {
              id,
              keyword: getType(k),
              label: name,
              selected: route.value.fullPath?.toLowerCase().includes(getType(k) as string) && route.value.query[getType(k) as string] === id.toString(),
              value: JSON.stringify({
                id,
                keyword: getType(k),
              }),
            }
          }),
        }
      })

      return newFilters
    })
    const slicedData = computed(() => data.value && data.value.slice(0, limit.value))
    const activeSelections = computed<Record<string, string>[]>(() => {
      return Object.values(allFilters.value)
        .flatMap(v => v.filter((item: { selected: boolean }) => item.selected)) || []
    })

    const resetLazyLoad = () => {
      scrollTo({ left: 0, top: 0, behavior: 'smooth' })
      limit.value = window.IntersectionObserver ? 5 : 50
    }

    const fetchPage = (isPrev = false) => {
      resetLazyLoad()
      const url = isPrev ? new URL(linksRef.value.prev) : new URL(linksRef.value.next)
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

    const handleIntersect = (entries: any[]) => {
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
      process.browser && $cmwGtmUtils.pushPage('page');
      (window.IntersectionObserver)
        ? createObserver()
        : limit.value = 50 // <-- Note: this could be messy, how can we handle this?
    })

    const fetchBrands = (params: string) => {
      resetLazyLoad()
      cmwActiveSelect.value = ''

      // eslint-disable-next-line unused-imports/no-unused-vars
      const { cursor, ...rest } = route.value.query
      const parsedParams = JSON.parse(params)
      const { keyword, id } = parsedParams

      const query = {
        ...(rest && { ...rest }),
      }

      if (`${query[keyword]}` === id.toString())
        delete query[keyword]
      else query[keyword] = id

      router.push(localeLocation({ path: '/winery', query }) as RawLocation)
    }

    const handleUpdateTrigger = (value: string) => cmwActiveSelect.value = cmwActiveSelect.value === value ? '' : value

    watch(() => route.value.query, () => fetch())

    return {
      cmwActiveSelect,
      activeSelections,
      data,
      slicedData,
      linksRef,
      allFilters,
      trigger,
      limit,
      fetchBrands,
      fetchPage,
      handleUpdateTrigger,
    }
  },
})
</script>

<template>
  <div class="cmw-max-w-screen-xl cmw-mx-auto cmw-py-4 cmw-px-4 cmw-mt-4">
    <div
      class="cmw-grid cmw-grid-cols-[auto_200px] cmw-items-start cmw-border-y cmw-border-gray-light cmw-py-1 cmw-transition-all"
    >
      <!-- Filter Components -->
      <div class="cmw-flex cmw-flex-wrap">
        <CmwDropdown
          v-if="!!allFilters.productionTypes?.length"
          key="production-types"
          size="sm"
          :active="cmwActiveSelect === 'production-types'"
          @update-trigger="handleUpdateTrigger"
        >
          <template #default>
            <span>{{ $t('search.productionTypes') }}</span>
          </template>
          <template #children>
            <CmwSelect
              size="sm"
              :options="allFilters.productionTypes"
              @update-value="fetchBrands"
            />
          </template>
        </CmwDropdown>
        <CmwDropdown
          v-if="!!allFilters.regions?.length"
          key="regions"
          size="sm"
          :active="cmwActiveSelect === 'regions'"
          @update-trigger="handleUpdateTrigger"
        >
          <template #default>
            <span>{{ $t('search.regions') }}</span>
          </template>
          <template #children>
            <CmwSelect
              size="sm"
              :options="allFilters.regions"
              @update-value="fetchBrands"
            />
          </template>
        </CmwDropdown>
        <CmwDropdown
          v-if="!!allFilters.countries?.length"
          key="countries"
          size="sm"
          :active="cmwActiveSelect === 'countries'"
          @update-trigger="handleUpdateTrigger"
        >
          <template #default>
            <span>{{ $t('search.country') }}</span>
          </template>
          <template #children>
            <CmwSelect
              size="sm"
              :options="allFilters.countries"
              @update-value="fetchBrands"
            />
          </template>
        </CmwDropdown>
        <CmwDropdown
          v-if="!!allFilters.categories?.length"
          key="categories"
          size="sm"
          :active="cmwActiveSelect === 'categories'"
          @update-trigger="handleUpdateTrigger"
        >
          <template #default>
            <span>{{ $t('search.categories') }}</span>
          </template>
          <template #children>
            <CmwSelect
              size="sm"
              :options="allFilters.categories"
              @update-value="fetchBrands"
            />
          </template>
        </CmwDropdown>
      </div>
    </div>
    <div v-if="activeSelections.length" class="cmw-my-4 cmw-flex cmw-gap-2">
      <CmwChip
        v-for="({ id, label, keyword }) in activeSelections" :key="id" size="xs"
        :label="label" :on-delete="() => fetchBrands(JSON.stringify({ keyword, id }))"
      />
    </div>
    <div class="l-brands cmw-grid cmw-grid-cols-2 cmw-gap-4 cmw-mt-8 desktop:(cmw-grid-cols-4)">
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
    <div v-if="data" class="cmw-flex cmw-justify-between">
      <Button
        v-if="linksRef.prev"
        class="cmw-w-max"
        variant="text"
        :label="$t('common.cta.prevPage')"
        @click.native="fetchPage(true)"
      />
      <Button
        v-if="linksRef.next"
        class="cmw-w-max"
        variant="text"
        :label="$t('common.cta.nextPage')"
        @click.native="fetchPage(false)"
      />
    </div>
    <Loader v-if="$fetchState.pending" />
  </div>
</template>

<style scoped>
@screen md {
  .l-brands {
    grid-auto-rows: 330px;
  }
}
</style>
