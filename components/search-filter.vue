<script>
import { nextTick, onMounted, onUnmounted, ref } from '@nuxtjs/composition-api'
import debounce from 'lodash.debounce'
import { storeToRefs } from 'pinia'
import Loader from '../components/UI/Loader.vue'
import Dropdown from './UI/Dropdown.vue'
import DropdownRange from './UI/DropdownRange.vue'
import DropdownSelections from './UI/DropdownSelections.vue'
import SelectionsBoxMobile from './UI/SelectionsBoxMobile.vue'
import { useFilters } from '~/store/filters'

export default {
  components: {
    Dropdown,
    DropdownSelections,
    DropdownRange,
    SelectionsBoxMobile,
    Loader,
  },
  scrollToTop: true,
  props: ['inputParameters'],
  setup() {
    const filtersStore = useFilters()
    const { selectedLayout, availableLayouts } = storeToRefs(filtersStore)
    const isDesktop = ref(false)

    const resizeListener = debounce(() => {
      isDesktop.value = window.innerWidth > 991
    }, 400)

    onMounted(() => {
      // Todo: Move this to a global composable when we implement VueUse
      window.addEventListener('resize', resizeListener)
      nextTick(() => {
        resizeListener()
      })
    })

    onUnmounted(() => {
      window.removeEventListener('resize', resizeListener)
    })

    return {
      isDesktop,
      availableLayouts,
      selectedLayout,
    }
  },
  data() {
    return {
      // macrocategories: null,
      minPrice: null,
      maxPrice: null,
      searchedTerm: '',
      loading: null,
      brands: null,
      search: null,
      regions: null,
      selections: null,
      pairings: null,
      agings: null,
      philosophies: null,
      sizes: null,
      dosagecontents: null,
      bodystyles: null,
      areas: null,
      boxes: null,
      categories: null,
      countries: null,
      winelists: null,
      awards: null,
      vintages: null,
      results: null,
      activeSelections: null,
      // activeMacroCategories: null,
      total: null,
      totalPages: null,
      currentPage: 1,
      view: {
        regions: null,
        brands: null,
        vintages: null,
        sizes: null,
        dosagecontents: null,
        bodystyles: null,
        areas: null,
        pairings: null,
        agings: null,
        philosophies: null,
        countries: null,
        categories: null,
        winelists: null,
        awards: null,
        priceFrom: null,
        priceTo: null,
      },
    }
  },
  async fetch() {
    if (process.client)
      window.scrollTo(0, 0)

    /* console.log(this.inputParameters, "this.inputParameters"); */

    this.loading = true
    // const route = this.$route
    /* console.log(route.fullPath.split("search?")[1], "SSSS"); */

    this.currentPage = this.inputParameters.page
      ? this.inputParameters.page
      : 1

    this.searchedTerm = this.inputParameters.search
      ? this.inputParameters.search
      : ''

    if (!this.inputParameters.search)
      delete this.inputParameters.search

    const query = new URLSearchParams(this.inputParameters).toString()

    let sel = '&'

    if (this.inputParameters.sel) {
      sel += this.inputParameters.sel
        .split(',')
        .map(el => `${el}=true`)
        .join('&')
    }

    const stores = {
      CMW: 1,
      CMW_UK: 2,
      WILDVIGNERON: 3,
    }

    const activeStoreID = stores[this.$config.STORE]

    const elastic_url
      = `${this.$config.ELASTIC_URL
    }products/search?stores=${
      activeStoreID
    }&locale=${
      this.$i18n.locale
    }&`

    const searchResult = await fetch(`${elastic_url}${query}${sel}`)

    // const allFields = await fetch(elastic_url)
    //
    // const allFieldsJSON = await allFields.json()

    const search = await searchResult.json()

    this.search = search
    this.results = search.hits.hits

    const total = search.hits.total.value
    this.total = total

    if (total === 0)
      this.loading = false

    this.totalPages = Math.ceil(total / 50)

    const belong_filters = [
      'areas',
      'brands',
      'regions',
      'countries',
      'vintages',
      'sizes',
      'boxes',
      'dosagecontents',
      'bodystyles',
    ]

    belong_filters.forEach((el) => {
      let buckets = search.aggregations[`agg-${el}`][`agg-${el}`].buckets.map(
        (x) => {
          return {
            key: x.key.split('|'),
            key_as_string: x.key,
            doc_count: x.doc_count,
          }
        },
      )

      buckets = buckets.filter(bucket => !bucket.key.includes('not specified'))

      this[`${el}`] = buckets

      const filterId = this.inputParameters[el]

      this.view[el] = filterId
        ? {
            key: filterId,
            name: buckets.find(x => x.key[0] == filterId).key[1],
            field: el,
          }
        : null
    })

    const relation_filters = [
      'awards',
      'agings',
      'categories',
      'philosophies',
      'winelists',
      'pairings',
    ]

    relation_filters.forEach((el) => {
      const data = search.aggregations[`agg-${el}`].inner.result.buckets.map((el) => {
        return {
          key: [el.key, el.name.buckets[0].key],
          key_as_string: `${el.key}|${el.name.buckets[0].key}`,
          doc_count: el.doc_count,
        }
      })
      this[el] = data

      const filterId = this.inputParameters[el]
      this.view[el] = filterId
        ? {
            key: filterId,
            name: data.find(x => x.key[0] == filterId).key[1],
            field: el,
          }
        : null
    })

    // macro categories
    /* console.clear(); */
    const macro = search.aggregations['agg-macros'].inner.result.buckets.map(
      (el) => {
        return {
          name: el.name.buckets[0].key,
          id: el.key,
        }
      },
    )
    this.macrocategories = macro

    const priceFrom = this.inputParameters.price_from
    const priceTo = this.inputParameters.price_to

    const allSelections = [
      'favourite',
      'artisanal',
      'isnew',
      'inpromotion',
      'topsale',
      'foreveryday',
      'organic',
      'togift',
      'unusualvariety',
      'rarewine',
    ]

    const activeSelections = Object.keys(this.inputParameters).filter(el =>
      allSelections.includes(el),
    )
    this.activeSelections = activeSelections

    // const activeMacroCategories = this.inputParameters.macrocategories
    // if (activeMacroCategories)
    //   this.activeMacroCategories = activeMacroCategories
    // console.log(activeMacroCategories, 'activeMacroCategories')

    this.view.priceFrom = priceFrom
      ? {
          key: 'priceFrom',
          name: `From ${priceFrom}`,
          field: 'price_from',
        }
      : null
    this.view.priceTo = priceTo
      ? {
          key: 'priceTo',
          name: `To ${priceTo}`,
          field: 'price_to',
        }
      : null

    this.maxPrice
      = priceTo
      || Math.round(+search.aggregations.max_price['agg-max-price'].value)
    this.minPrice
      = priceFrom
      || Math.round(+search.aggregations.min_price['agg-min-price'].value)

    this.loading = false
  },
  computed: {},
  watch: {
    '$route.query': '$fetch',
    '$i18n.locale': '$fetch',
  },

  methods: {
    changePage(page) {
      const query = Object.assign({}, this.inputParameters)
      query.page = page

      this.$router.push({
        path: 'catalog',
        query,
      })
    },
    showModal() {
      this.$refs.modalFilter.show()
    },
    hideModal() {
      this.$refs.modalFilter.hide()
    },
    resetFilter() {
      this.$router.push({
        path: 'catalog',
        query: null,
      })
    },
    removeSelectionFromQuery(selection) {
      const query = Object.assign({}, this.inputParameters)

      delete query[selection]

      this.$router.push({
        path: 'catalog',
        query,
      })
    },
    removeFromQuery(obj) {
      const query = Object.assign({}, this.inputParameters)

      delete query[obj.field]

      this.$router.push({
        path: 'catalog',
        query,
      })
    },
    sortBy(field, direction) {
      const query = Object.assign({}, this.inputParameters)
      query.sort = field
      query.direction = direction
      this.$router.push({
        path: 'catalog',
        query,
      })
    },
    forward() {
      const query = Object.assign({}, this.inputParameters)

      this.currentPage++
      query.page = this.currentPage

      this.$router.push({
        path: 'catalog',
        query,
      })
    },
    backward() {
      const query = Object.assign({}, this.inputParameters)

      if (this.currentPage === 1)
        return

      this.currentPage--
      query.page = this.currentPage

      this.$router.push({
        path: 'catalog',
        query,
      })
    },
  },
}
</script>

<template>
  <div class="container-fluid px-md-5 cmw-mt-4">
    <div class="row">
      <div class="col-12">
        <div v-if="searchedTerm" class="">
          <h2 class="font-weight-bold">
            "{{ searchedTerm }}"
          </h2>
          <p class="h3">
            I risultati della tua ricerca
          </p>
        </div>
        <div class="h3">
          {{ view.regions?.name }} {{ view.vintages?.name }}
          {{ view.pairing?.name }} {{ view.brands?.name }}
          {{ view.agings?.name }} {{ view.philosophies?.name }}
          {{ view.sizes?.name }} {{ view.dosagecontents?.name }}
          {{ view.categories?.name }}
          {{ view.winelists?.name }}
          {{ view.awards?.name }}
          <span v-for="selection in activeSelections" :key="selection">
            {{ $t(`selections.${selection}`) }}
          </span>
          <!-- {{ view }} -->

          <!-- {{ Object.entries(view).filter((el) => el[1] !== null) }} -->
        </div>
        <!-- <p class="h3">
          {{ total }}
        </p> -->
      </div>
    </div>

    <!--      <div v-if="macrocategories" class="row">
      <div class="col-12">
        <MacroCategories
          :macrocategories="macrocategories"
          keyword="macros"
          :active-macro-categories="activeMacroCategories"
        />
      </div>
    </div> -->

    <div v-if="results" class="row mt-5">
      <div class="d-none d-md-block col-md-3">
        <div>
          <div
            v-if="
              (activeSelections && activeSelections.length > 0)
                || Object.values(view).filter((el) => el != null).length > 0
            "
          >
            <p class="lead">
              {{ $t("search.activeFilters") }}
            </p>
            <div>
              <!-- selections -->
              <span
                v-for="item in activeSelections"
                :key="item"
                class="badge badge-pill badge-light-secondary mx-1"
                @click="removeSelectionFromQuery(item)"
              >
                {{ $t(`selections.${item}`) }}
                <i class="fal fa-times ml-1" />
              </span>
              <!-- other filters -->

              <span
                v-for="(item, ind) in Object.entries(view).filter(
                  (el) => el[1] !== null,
                )"
                :key="ind"
                class="badge badge-pill badge-light-secondary mx-1"
                @click="removeFromQuery(item[1])"
              >
                {{ item[1].name }}
                <i class="fal fa-times ml-1" />
              </span>
            </div>

            <button
              class="btn btn-small ml-auto d-block"
              style="font-size: 12px"
              @click="resetFilter"
            >
              <i class="fal fa-times" /> {{ $t("search.removeAll") }}
            </button>
          </div>

          <DropdownSelections
            :label="$t('search.selections')"
            :items="null"
            keyword="selections"
            :search="search"
            :input-parameters="inputParameters"
          />
          <Dropdown
            v-if="categories && categories.length"
            :label="$t('search.categories')"
            :items="categories"
            keyword="categories"
            :input-parameters="inputParameters"
          />
          <Dropdown
            v-if="winelists && winelists.length"
            :label="$t('search.winelists')"
            :items="winelists"
            keyword="winelists"
            :input-parameters="inputParameters"
          />
          <Dropdown
            v-if="pairings && pairings.length"
            :label="$t('search.pairings')"
            :items="pairings"
            keyword="pairings"
            :input-parameters="inputParameters"
          />
          <Dropdown
            v-if="dosagecontents && dosagecontents.length"
            :label="$t('search.dosagecontents')"
            :items="dosagecontents"
            keyword="dosagecontents"
            :input-parameters="inputParameters"
          />
          <Dropdown
            v-if="bodystyles && bodystyles.length"
            :label="$t('search.bodystyles')"
            :items="bodystyles"
            keyword="bodystyles"
            :input-parameters="inputParameters"
          />
          <Dropdown
            v-if="boxes && boxes.length"
            :label="$t('search.boxes')"
            :items="boxes"
            keyword="boxes"
            :input-parameters="inputParameters"
          />
          <Dropdown
            v-if="areas && areas.length"
            :label="$t('search.areas')"
            :items="areas"
            keyword="areas"
            :input-parameters="inputParameters"
          />
          <Dropdown
            v-if="regions && regions.length"
            :label="$t('search.provenience')"
            :items="regions"
            keyword="regions"
            :input-parameters="inputParameters"
          />
          <Dropdown
            v-if="brands && brands.length"
            :label="$t('search.brands')"
            :items="brands"
            keyword="brands"
            :input-parameters="inputParameters"
          />
          <Dropdown
            v-if="countries && countries.length"
            :label="$t('search.countries')"
            :items="countries"
            keyword="countries"
            :input-parameters="inputParameters"
          />
          <Dropdown
            v-if="sizes && sizes.length"
            :label="$t('search.sizes')"
            :items="sizes"
            keyword="sizes"
            :input-parameters="inputParameters"
          />
          <Dropdown
            v-if="vintages && vintages.length"
            :label="$t('search.vintages')"
            :items="vintages"
            keyword="vintages"
            :input-parameters="inputParameters"
          />
          <Dropdown
            v-if="awards && awards.length"
            :label="$t('search.awards')"
            :items="awards"
            keyword="awards"
            :input-parameters="inputParameters"
          />
          <Dropdown
            v-if="agings && agings.length"
            :label="$t('search.agings')"
            :items="agings"
            keyword="agings"
            :input-parameters="inputParameters"
          />
          <Dropdown
            v-if="philosophies && philosophies.length"
            :label="$t('search.philosophies')"
            :items="philosophies"
            keyword="philosophies"
            :input-parameters="inputParameters"
          />

          <DropdownRange
            :label="$t('search.price')"
            :min="minPrice"
            :max="maxPrice"
            :input-parameters="inputParameters"
          />
        </div>
      </div>
      <div v-if="results.length > 0" class="col-12 col-md-9 px-md-0">
        <div class="row align-items-center mb-5">
          <div
            class="col-12 col-md-4 d-flex justify-content-between justify-content-md-start"
          >
            <span class="mr-3"><strong>{{ total }}</strong> {{ $t("search.results") }}</span>
            <div class="cmw-hidden cmw-items-center cmw-gap-2 lg:cmw-flex">
              <div
                v-for="layout in availableLayouts"
                :key="layout"
                class="cmw-relative"
              >
                <input
                  :id="layout"
                  v-model="selectedLayout"
                  :aria-label="`select ${layout}`"
                  class="peer cmw-appearance-none cmw-absolute cmw-w-full cmw-h-full cmw-z-dante"
                  type="radio"
                  name="layout"
                  :value="layout"
                >
                <label
                  :for="layout"
                  class="
              cmw-flex cmw-rounded-sm cmw-shadow cmw-p-[0.40rem] cmw-mb-0 cmw-bg-white cmw-cursor-pointer
              peer-checked:(cmw-bg-gray-lightest cmw-shadow-none)"
                >
                  <VueSvgIcon
                    class="cmw-m-auto"
                    :data="require(`@/assets/svg/layout-${layout}.svg`)"
                    width="20"
                    height="20"
                    color="#992545"
                  />
                </label>
              </div>
            </div>
          </div>
          <div class="d-none d-md-block col-4" />
          <div class="col-12 col-md-4 text-right">
            <div>
              <!-- {{ this.$router }} -->
              <b-dropdown id="sorting" variant="null" right class="" no-caret>
                <template #button-content>
                  {{ $t("search.sortBy") }}
                  <i class="fal fa-chevron-down text-light-secondary ml-3" />
                </template>
                <div class="shadow br-10" style="width: 300px">
                  <button
                    class="btn py-3 btn-sort-by w-100 text-left d-block"
                    @click="sortBy('price', 'desc')"
                  >
                    {{ $t("search.highestPrice") }}
                  </button>
                  <button
                    class="btn py-3 btn-sort-by w-100 text-left d-block"
                    @click="sortBy('price', 'asc')"
                  >
                    {{ $t("search.lowestPrice") }}
                  </button>
                  <button
                    class="btn py-3 btn-sort-by w-100 text-left d-block"
                    @click="sortBy('awardcount', 'desc')"
                  >
                    {{ $t("search.mostAwarded") }}
                  </button>
                  <button
                    class="btn py-3 btn-sort-by w-100 text-left d-block"
                    @click="sortBy('brandname', 'asc')"
                  >
                    Brand (A-Z)
                  </button>
                  <button
                    class="btn py-3 btn-sort-by w-100 text-left d-block"
                    @click="sortBy('brandname', 'desc')"
                  >
                    Brand (Z-A)
                  </button>
                </div>
              </b-dropdown>
            </div>
          </div>
        </div>
        <div
          v-if="selectedLayout === 'list' && isDesktop"
        >
          <div
            v-for="result in results"
            :key="result._id"
            class="cmw-mb-4"
          >
            <ProductBoxHorizontalElastic :product="result" :horizontal="true" />
          </div>
        </div>
        <div
          v-else class="cmw-grid cmw-grid-cols-1 cmw-gap-4 phone-md:(cmw-grid-cols-2 cmw-gap-2)
         sm:(cmw-grid-cols-2 cmw-gap-3) lg:(cmw-grid-cols-3 cmw-gap-4) desktop-wide:cmw-grid-cols-4"
        >
          <div
            v-for="result in results"
            :key="`desktop${result._id}`"
            class="d-none d-lg-block "
          >
            <ProductBoxVerticalElastic :product="result" />
          </div>
          <div
            v-for="result in results"
            :key="`mobile${result._id}`"
            class="d-lg-none"
          >
            <ProductBoxVerticalElastic :product="result" />
          </div>
        </div>
      </div>
      <div v-else class="col-12 col-md-9">
        <p class="lead mt-5">
          {{ $t("search.noResultsAlert") }}
        </p>
        <div v-html="$t('search.noResultsMessage')" />
      </div>
    </div>

    <div class="row">
      <div class="col-4 text-right">
        <span v-if="+currentPage > 4" class="d-inline-flex">
          <button
            class="btn btn-outline-dark-secondary btn-small"
            @click="changePage(1)"
          >
            Prima
          </button>
        </span>
      </div>
      <div class="col-4 text-center">
        <span v-for="i in 3" :key="`${i}prev`" class="d-inline-flex">
          <button
            v-if="+currentPage - 4 + i > 0 && +currentPage - 4 + i < totalPages"
            class="btn btn-outline-dark-secondary btn-small"
            @click="changePage(+currentPage - 4 + i)"
          >
            {{ +currentPage - 4 + i }}
          </button>
        </span>
        <span class="d-inline-flex">
          <button class="btn btn-dark-secondary btn-small disabled">
            {{ currentPage }}
          </button>
        </span>
        <span v-for="i in 3" :key="`${i}next`" class="d-inline-flex">
          <button
            v-if="+currentPage + i > 0 && +currentPage + i < totalPages"
            class="btn btn-outline-dark-secondary btn-small"
            @click="changePage(+currentPage + i)"
          >
            {{ +currentPage + i }}
          </button>
        </span>
      </div>
      <div class="col-4 text-left">
        <span v-if="+currentPage < totalPages" class="d-inline-flex">
          <button
            class="btn btn-outline-dark-secondary btn-small"
            @click="changePage(totalPages)"
          >
            Ultima
          </button>
        </span>
      </div>
    </div>

    <Loader v-if="loading" />

    <div
      class="row w-100 d-lg-none"
      style="position: fixed; bottom: 30px; z-index: 10"
    >
      <div class="col-12 text-center">
        <button
          class="btn text-center br-10 px-5"
          style="background: #db4865; color: white"
          @click="showModal"
        >
          <i class="fal fa-bars mr-2" /> {{ $t("search.showFilters") }}
          <span
            v-if="
              activeSelections
                && (activeSelections.length > 0
                  || Object.values(view).filter((el) => el != null).length > 0)
            "
          >
            ({{
              activeSelections.length
                + Object.values(view).filter((el) => el != null).length
            }})
          </span>
        </button>
      </div>
    </div>

    <b-modal
      ref="modalFilter"
      size="xl"
      scrollable
      centered
      hide-header
      title=""
    >
      <div class="mt-4">
        <div class="text-right" @click="hideModal">
          <i class="fal fa-times fa-2x text-light-secondary" />
        </div>

        <div
          v-if="
            (activeSelections && activeSelections.length > 0)
              || Object.values(view).filter((el) => el != null).length > 0
          "
        >
          <p class="lead">
            {{ $t("search.activeFilters") }}
          </p>
          <div v-if="activeSelections">
            <!-- selections -->
            <span
              v-for="item in activeSelections"
              :key="item"
              class="badge badge-pill badge-light-secondary mx-1"
              @click="removeSelectionFromQuery(item)"
            >
              {{ $t(`selections.${item}`) }}
              <i class="fal fa-times ml-1" />
            </span>
            <!-- other filters -->
            <span
              v-for="(item, ind) in Object.entries(view).filter(
                (el) => el[1] !== null,
              )"
              :key="ind"
              class="badge badge-pill badge-light-secondary mx-1"
              @click="removeFromQuery(item[1])"
            >
              {{ item[1].name }}
              <i class="fal fa-times ml-1" />
            </span>
          </div>

          <button
            class="btn btn-small ml-auto d-block"
            style="font-size: 12px"
            @click="resetFilter"
          >
            <i class="fal fa-times" /> {{ $t("search.removeAll") }}
          </button>
        </div>

        <Dropdown
          v-if="categories && !!categories.length"
          :label="$t('search.categories')"
          :items="categories"
          keyword="categories"
          :input-parameters="inputParameters"
        />
        <Dropdown
          v-if="winelists && !!winelists.length"
          :label="$t('search.winelists')"
          :items="winelists"
          keyword="winelists"
          :input-parameters="inputParameters"
        />
        <Dropdown
          v-if="pairings && !!pairings.length"
          :label="$t('search.pairings')"
          :items="pairings"
          keyword="pairings"
          :input-parameters="inputParameters"
        />
        <Dropdown
          v-if="dosagecontents && !!dosagecontents.length"
          :label="$t('search.dosagecontents')"
          :items="dosagecontents"
          keyword="dosagecontents"
          :input-parameters="inputParameters"
        />
        <Dropdown
          v-if="bodystyles && !!bodystyles.length"
          :label="$t('search.bodystyles')"
          :items="bodystyles"
          keyword="bodystyles"
          :input-parameters="inputParameters"
        />
        <Dropdown
          v-if="boxes && !!boxes.length"
          :label="$t('search.boxes')"
          :items="boxes" keyword="boxes"
          :input-parameters="inputParameters"
        />
        <Dropdown
          v-if="areas && !!areas.length"
          :label="$t('search.areas')" :items="areas" keyword="areas"
          :input-parameters="inputParameters"
        />
        <Dropdown
          v-if="regions && !!regions.length"
          :label="$t('search.provenience')"
          :items="regions"
          keyword="regions"
          :input-parameters="inputParameters"
        />
        <Dropdown
          v-if="brands && !!brands.length"
          :label="$t('search.brands')"
          :items="brands"
          keyword="brands"
          :input-parameters="inputParameters"
        />
        <Dropdown
          v-if="countries && !!countries.length"
          :label="$t('search.countries')"
          :items="countries"
          keyword="countries"
          :input-parameters="inputParameters"
        />
        <Dropdown
          v-if="sizes && !!sizes.length"
          :label="$t('search.sizes')" :items="sizes" keyword="sizes"
          :input-parameters="inputParameters"
        />
        <Dropdown
          v-if="vintages && !!vintages.length"
          :label="$t('search.vintages')"
          :items="vintages"
          keyword="vintages"
          :input-parameters="inputParameters"
        />
        <Dropdown
          v-if="awards && !!awards.length"
          :label="$t('search.awards')"
          :items="awards"
          keyword="awards"
          :input-parameters="inputParameters"
        />
        <Dropdown
          v-if="agings && !!agings.length"
          :label="$t('search.agings')"
          :items="agings"
          keyword="agings"
          :input-parameters="inputParameters"
        />
        <Dropdown
          v-if="philosophies && !!philosophies.length"
          :label="$t('search.philosophies')"
          :items="philosophies"
          keyword="philosophies"
          :input-parameters="inputParameters"
        />

        <DropdownRange
          :label="$t('search.price')"
          :min="minPrice"
          :max="maxPrice"
        />

        <SelectionsBoxMobile
          label="selections"
          :items="null"
          keyword="selections"
          :search="search"
        />
      </div>

      <template #modal-footer>
        <div class="w-100 text-center">
          <button
            class="btn view-results text-uppercase px-5"
            @click="hideModal"
          >
            {{ $t("search.showResults") }} ({{ total }})
          </button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<style scoped>
.view-results {
  border: 2px solid #d94965;
  border-radius: 12px;
  background-color: #d94965;
  color: white;
}

.btn-sort-by:hover {
  background: #fae4e8;
}

:deep(.dropdown-menu.dropdown-menu-right.show) {
  padding-top: 0px;
  padding-bottom: 0px;
  border: 0px;
}

.badge {
  border-radius: 2rem !important;
  padding: 0.25em 1em;
  font-weight: normal;
  cursor: pointer;
}
</style>
