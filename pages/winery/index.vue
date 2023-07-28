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
    const { $cmwGtmUtils, localePath } = useContext()
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

    const { fetch } = useFetch(async ({ $elastic }) => {
      console.log($elastic)
      if (!Object.keys(allFiltersRaw.value).length) {
        await $elastic.$get('/brands')
          .then((response) => {
            console.log(response)
            const { brands } = response as { brands: { filters: Record<string, any> } }

            allFiltersRaw.value = brands.filters
          })
      }

      const searchParams = route.value.query as { [key: string]: string | number | boolean }

      await $elastic.$get('/brands', {
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
      router.push(localePath({ name: 'winery', query }))
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

      router.push(localePath({ name: 'winery', query }))
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
  <div class="max-w-screen-xl mx-auto py-4 px-4 mt-4">
    <div
      class="grid grid-cols-[auto_200px] items-start border-y border-gray-light py-1 transition-all"
    >
      <!-- Filter Components -->
      <div class="flex flex-wrap">
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
    <div v-if="activeSelections.length" class="my-4 flex gap-2">
      <CmwChip
        v-for="({ id, label, keyword }) in activeSelections" :key="id" size="xs"
        :label="label" :on-delete="() => fetchBrands(JSON.stringify({ keyword, id }))"
      />
    </div>
    <div class="l-brands grid grid-cols-2 gap-4 mt-8 desktop:(grid-cols-4)">
      <div
        v-for="brand in slicedData"
        :key="brand.brandId"
        :class="brand.isPartner ? 'col-span-2' : 'col-span-2 sm:col-span-1'"
      >
        <ClientOnly>
          <component :is="brand.isPartner ? 'CardBrandPartner' : 'CardBrand'" :brand="brand" />
        </ClientOnly>
      </div>
    </div>

    <div ref="trigger" class="w-full h-4 text-transparent">
      <!-- Note: lazy load trigger, can't hide this because it loses the observer, v-if="limit < data.length" -->
      lazy-loading-trigger
    </div>
    <div v-if="data" class="flex justify-between">
      <Button
        v-if="linksRef.prev"
        class="w-max"
        variant="text"
        :label="$t('common.cta.prevPage')"
        @click.native="fetchPage(true)"
      />
      <Button
        v-if="linksRef.next"
        class="w-max"
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
