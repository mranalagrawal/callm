<template>
  <div class="container-fluid px-md-5 mt-5">
    <div class="row pt-5">
      <div class="col-12">
        <div class="" v-if="searchedTerm">
          <h2 class="font-weight-bold">"{{ searchedTerm }}"</h2>
          <p class="h3">I risultati della tua ricerca</p>
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

    <div class="row mt-5" v-if="results">
      <div class="d-none d-md-block col-md-3">
        <div>
          <div
            v-if="
              (activeSelections && activeSelections.length > 0) ||
              Object.values(view).filter((el) => el != null).length > 0
            "
          >
            <p class="lead">{{ $t("search.activeFilters") }}</p>
            <div v-if="activeSelections">
              <!-- selections -->
              <span
                v-for="item in activeSelections"
                :key="item"
                class="badge badge-pill badge-light-red mx-1"
                @click="removeSelectionFromQuery(item)"
              >
                {{ $t(`selections.${item}`) }}
                <i class="fal fa-times ml-1"></i>
              </span>
              <!-- other filters -->
              <span
                class="badge badge-pill badge-light-red mx-1"
                v-for="(item, ind) in Object.entries(view).filter(
                  (el) => el[1] !== null
                )"
                :key="ind"
                @click="removeFromQuery(item[1])"
              >
                {{ item[1].name }}
                <i class="fal fa-times ml-1"></i>
              </span>
            </div>

            <button
              class="btn btn-small ml-auto d-block"
              style="font-size: 12px"
              @click="resetFilter"
            >
              <i class="fal fa-times"></i> {{ $t("search.removeAll") }}
            </button>
          </div>

          <dropdown-selections
            :label="$t('search.selections')"
            :items="null"
            keyword="selections"
            :search="search"
          />
          <dropdown
            :label="$t('search.categories')"
            :items="categories"
            keyword="categories"
          />
          <dropdown
            :label="$t('search.winelists')"
            :items="winelists"
            keyword="winelists"
          />
          <dropdown
            :label="$t('search.pairings')"
            :items="pairings"
            keyword="pairings"
          />
          <dropdown
            :label="$t('search.dosagecontents')"
            :items="dosagecontents"
            keyword="dosagecontents"
          />
          <dropdown
            :label="$t('search.bodystyles')"
            :items="bodystyles"
            keyword="bodystyles"
          />
          <dropdown
            :label="$t('search.boxes')"
            :items="boxes"
            keyword="boxes"
          />
          <dropdown
            :label="$t('search.areas')"
            :items="areas"
            keyword="areas"
          />
          <dropdown
            :label="$t('search.provenience')"
            :items="regions"
            keyword="regions"
          />
          <dropdown
            :label="$t('search.brands')"
            :items="brands"
            keyword="brands"
          />
          <dropdown
            :label="$t('search.countries')"
            :items="countries"
            keyword="countries"
          />
          <dropdown
            :label="$t('search.sizes')"
            :items="sizes"
            keyword="sizes"
          />
          <dropdown
            :label="$t('search.vintages')"
            :items="vintages"
            keyword="vintages"
          />
          <dropdown
            :label="$t('search.awards')"
            :items="awards"
            keyword="awards"
          />
          <dropdown
            :label="$t('search.agings')"
            :items="agings"
            keyword="agings"
          />
          <dropdown
            :label="$t('search.philosophies')"
            :items="philosophies"
            keyword="philosophies"
          />

          <dropdown-range
            :label="$t('search.price')"
            :min="minPrice"
            :max="maxPrice"
          />
        </div>
      </div>
      <div class="col-12 col-md-9 px-md-0" v-if="results.length > 0">
        <div class="row align-items-center mb-5">
          <div
            class="col-12 col-md-4 d-flex justify-content-between justify-content-md-start"
          >
            <span class="mr-3"
              ><strong>{{ total }}</strong> {{ $t("search.results") }}</span
            >
            <div>
              <div
                class="btn text-dark-red br-10 btn-sort mr-1"
                :class="column ? 'bg-gray' : 'shadow'"
                @click="column = true"
              >
                <i class="fas fa-th-large"></i>
              </div>
              <div
                class="btn text-dark-red br-10 btn-sort"
                @click="column = false"
                :class="!column ? 'bg-light' : 'shadow'"
              >
                <i class="fal fa-bars"></i>
              </div>
            </div>
          </div>
          <div class="d-none d-md-block col-4"></div>
          <div class="col-12 col-md-4 text-right">
            <div>
              <!-- {{ this.$router }} -->
              <b-dropdown id="sorting" variant="null" right class="" no-caret>
                <template #button-content>
                  {{ $t("search.sortBy") }}
                  <i class="fal fa-chevron-down text-light-red ml-3"></i>
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
        <div class="row" v-if="column">
          <div
            class="col-6 col-md-6 col-lg-4 col-xl-3 mb-3 px-0 px-md-2"
            v-for="result in results"
            :key="result._id"
          >
            <vertical-search :product="result" :horizontal="false" />
          </div>
        </div>
        <div class="row" v-else>
          <div
            class="d-none d-lg-block col-12 mb-1"
            v-for="result in results"
            :key="'desktop' + result._id"
          >
            <vertical-search :product="result" :horizontal="true" />
          </div>
          <div
            class="d-lg-none col-12 mb-1"
            v-for="result in results"
            :key="'mobile' + result._id"
          >
            <vertical-search :product="result" :horizontal="false" />
          </div>
        </div>
      </div>
      <div class="col-12 col-md-9" v-else>
        <p class="lead mt-5">{{ $t("search.noResultsAlert") }}</p>
        <div v-html="$t('search.noResultsMessage')"></div>
      </div>
    </div>

    <div class="row">
      <div class="col-4 text-right">
        <span class="d-inline-flex" v-if="+currentPage > 4">
          <button
            class="btn btn-outline-dark-red btn-small"
            @click="changePage(1)"
          >
            Prima
          </button>
        </span>
      </div>
      <div class="col-4 text-center">
        <span class="d-inline-flex" v-for="i in 3" :key="i + 'prev'">
          <button
            class="btn btn-outline-dark-red btn-small"
            v-if="+currentPage - 4 + i > 0 && +currentPage - 4 + i < totalPages"
            @click="changePage(+currentPage - 4 + i)"
          >
            {{ +currentPage - 4 + i }}
          </button>
        </span>
        <span class="d-inline-flex">
          <button class="btn btn-dark-red btn-small disabled">
            {{ currentPage }}
          </button>
        </span>
        <span class="d-inline-flex" v-for="i in 3" :key="i + 'next'">
          <button
            class="btn btn-outline-dark-red btn-small"
            v-if="+currentPage + i > 0 && +currentPage + i < totalPages"
            @click="changePage(+currentPage + i)"
          >
            {{ +currentPage + i }}
          </button>
        </span>
      </div>
      <div class="col-4 text-left">
        <span class="d-inline-flex" v-if="+currentPage < totalPages">
          <button
            class="btn btn-outline-dark-red btn-small"
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
          <i class="fal fa-bars mr-2"></i> Mostra filtri
          <span
            v-if="
              activeSelections &&
              (activeSelections.length > 0 ||
                Object.values(view).filter((el) => el != null).length > 0)
            "
          >
            ({{
              activeSelections.length +
              Object.values(view).filter((el) => el != null).length
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
          <i class="fal fa-times fa-2x text-light-red"></i>
        </div>

        <div
          v-if="
            (activeSelections && activeSelections.length > 0) ||
            Object.values(view).filter((el) => el != null).length > 0
          "
        >
          <p class="lead">{{ $t("search.activeFilters") }}</p>
          <div v-if="activeSelections">
            <!-- selections -->
            <span
              v-for="item in activeSelections"
              :key="item"
              class="badge badge-pill badge-light-red mx-1"
              @click="removeSelectionFromQuery(item)"
            >
              {{ $t(`selections.${item}`) }}
              <i class="fal fa-times ml-1"></i>
            </span>
            <!-- other filters -->
            <span
              class="badge badge-pill badge-light-red mx-1"
              v-for="(item, ind) in Object.entries(view).filter(
                (el) => el[1] !== null
              )"
              :key="ind"
              @click="removeFromQuery(item[1])"
            >
              {{ item[1].name }}
              <i class="fal fa-times ml-1"></i>
            </span>
          </div>

          <button
            class="btn btn-small ml-auto d-block"
            style="font-size: 12px"
            @click="resetFilter"
          >
            <i class="fal fa-times"></i> {{ $t("search.removeAll") }}
          </button>
        </div>

        <dropdown
          :label="$t('search.categories')"
          :items="categories"
          keyword="categories"
        />
        <dropdown
          :label="$t('search.winelists')"
          :items="winelists"
          keyword="winelists"
        />
        <dropdown
          :label="$t('search.pairings')"
          :items="pairings"
          keyword="pairings"
        />
        <dropdown
          :label="$t('search.dosagecontents')"
          :items="dosagecontents"
          keyword="dosagecontents"
        />
        <dropdown
          :label="$t('search.bodystyles')"
          :items="bodystyles"
          keyword="bodystyles"
        />
        <dropdown :label="$t('search.boxes')" :items="boxes" keyword="boxes" />
        <dropdown :label="$t('search.areas')" :items="areas" keyword="areas" />
        <dropdown
          :label="$t('search.provenience')"
          :items="regions"
          keyword="regions"
        />
        <dropdown
          :label="$t('search.brands')"
          :items="brands"
          keyword="brands"
        />
        <dropdown
          :label="$t('search.countries')"
          :items="countries"
          keyword="countries"
        />
        <dropdown :label="$t('search.sizes')" :items="sizes" keyword="sizes" />
        <dropdown
          :label="$t('search.vintages')"
          :items="vintages"
          keyword="vintages"
        />
        <dropdown
          :label="$t('search.awards')"
          :items="awards"
          keyword="awards"
        />
        <dropdown
          :label="$t('search.agings')"
          :items="agings"
          keyword="agings"
        />
        <dropdown
          :label="$t('search.philosophies')"
          :items="philosophies"
          keyword="philosophies"
        />

        <dropdown-range
          :label="$t('search.price')"
          :min="minPrice"
          :max="maxPrice"
        />

        <selections-box-mobile
          label="selections"
          :items="null"
          keyword="selections"
          :search="search"
        />
      </div>

      <template #modal-footer class="border-0">
        <div class="w-100 text-center">
          <button
            class="btn view-results text-uppercase px-5"
            @click="hideModal"
          >
            Mostra {{ total }} risultati
          </button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
import Dropdown from "./UI/Dropdown.vue";
import DropdownRange from "./UI/DropdownRange.vue";
import DropdownSelections from "./UI/DropdownSelections.vue";
import SelectionsBoxMobile from "./UI/SelectionsBoxMobile.vue";
import VerticalSearch from "./VerticalSearch.vue";
import Loader from "../components/UI/Loader.vue";

export default {
  scrollToTop: true,
  watch: {
    "$route.query": "$fetch",
  },
  props: ["inputParameters"],
  components: {
    Dropdown,
    DropdownSelections,
    DropdownRange,
    SelectionsBoxMobile,
    VerticalSearch,
    Loader,
  },
  data() {
    return {
      minPrice: null,
      maxPrice: null,
      searchedTerm: "",
      loading: null,
      column: true,
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
    };
  },
  computed: {},

  methods: {
    changePage(page) {
      const query = Object.assign({}, this.inputParameters);
      query["page"] = page;

      this.$router.push({
        path: "catalog",
        query: query,
      });
    },
    showModal() {
      this.$refs["modalFilter"].show();
    },
    hideModal() {
      this.$refs["modalFilter"].hide();
    },
    resetFilter() {
      this.$router.push({
        path: "catalog",
        query: null,
      });
    },
    removeSelectionFromQuery(selection) {
      const query = Object.assign({}, this.inputParameters);

      delete query[selection];

      this.$router.push({
        path: "catalog",
        query: query,
      });
    },
    removeFromQuery(obj) {
      const query = Object.assign({}, this.inputParameters);

      delete query[obj.field];

      this.$router.push({
        path: "catalog",
        query: query,
      });
    },
    sortBy(field, direction) {
      const query = Object.assign({}, this.inputParameters);
      query["sort"] = field;
      query["direction"] = direction;
      this.$router.push({
        path: "catalog",
        query: query,
      });
    },
    forward() {
      const query = Object.assign({}, this.inputParameters);

      this.currentPage++;
      query["page"] = this.currentPage;

      this.$router.push({
        path: "catalog",
        query: query,
      });
    },
    backward() {
      const query = Object.assign({}, this.inputParameters);

      if (this.currentPage == 1) return;

      this.currentPage--;
      query["page"] = this.currentPage;

      this.$router.push({
        path: "catalog",
        query: query,
      });
    },
  },
  /* computed: {
    currentPage(){
      return
    }
  }, */
  async fetch() {
    if (process.client) window.scrollTo(0, 0);

    /* console.log(this.inputParameters, "this.inputParameters"); */

    this.loading = true;
    let route = this.$route;
    /* console.log(route.fullPath.split("search?")[1], "SSSS"); */

    this.currentPage = this.inputParameters["page"]
      ? this.inputParameters["page"]
      : 1;

    this.searchedTerm = this.inputParameters["search"]
      ? this.inputParameters["search"]
      : "";

    if (!this.inputParameters.search) delete this.inputParameters.search;

    let query = new URLSearchParams(this.inputParameters).toString();

    let sel = "&";

    if (this.inputParameters.sel) {
      sel += this.inputParameters.sel
        .split(",")
        .map((el) => el + "=true")
        .join("&");
    }

    const elastic_url = this.$config.ELASTIC_URL;
    const searchResult = await fetch(elastic_url + query + sel);

    const allFields = await fetch(elastic_url);
    const allFieldsJSON = await allFields.json();

    const search = await searchResult.json();

    this.search = search;
    this.results = search.hits.hits;

    const total = search.hits.total.value;
    this.total = total;

    this.totalPages = Math.ceil(total / 50);

    const belong_filters = [
      "areas",
      "brands",
      "regions",
      "countries",
      "vintages",
      "sizes",
      "boxes",
      "dosagecontents",
      "bodystyles",
    ];

    belong_filters.forEach((el) => {
      const buckets = search.aggregations[`agg-${el}`][`agg-${el}`].buckets.map(
        (x) => {
          return {
            key: x.key.split("|"),
            key_as_string: x.key,
            doc_count: x.doc_count,
          };
        }
      );

      this[`${el}`] = buckets;

      const filterId = this.inputParameters[el];

      this.view[el] = filterId
        ? {
            key: filterId,
            name: buckets.find((x) => x.key[0] == filterId).key[1],
            field: el,
          }
        : null;
    });

    const relation_filters = [
      "awards",
      "agings",
      "categories",
      "philosophies",
      "winelists",
      "pairings",
    ];

    relation_filters.forEach((el) => {
      const data = search.aggregations[`agg-${el}`]["inner"]["result"][
        "buckets"
      ].map((el) => {
        return {
          key: [el.key, el.name.buckets[0].key],
          key_as_string: `${el.key}|${el.name.buckets[0].key}`,
          doc_count: el.doc_count,
        };
      });
      this[el] = data;

      const filterId = this.inputParameters[el];
      this.view[el] = filterId
        ? {
            key: filterId,
            name: data.find((x) => x.key[0] == filterId).key[1],
            field: el,
          }
        : null;
    });

    const priceFrom = this.inputParameters.price_from;
    const priceTo = this.inputParameters.price_to;

    const allSelections = [
      "favourite",
      "artisanal",
      "isnew",
      "inpromotion",
      "topsale",
      "foreveryday",
      "organic",
      "togift",
      "unusualvariety",
      "rarewine",
    ];

    const activeSelections = Object.keys(this.inputParameters).filter((el) =>
      allSelections.includes(el)
    );

    this.activeSelections = activeSelections;

    this.view.priceFrom = priceFrom
      ? {
          key: "priceFrom",
          name: "From " + priceFrom,
          field: "price_from",
        }
      : null;
    this.view.priceTo = priceTo
      ? {
          key: "priceTo",
          name: "To " + priceTo,
          field: "price_to",
        }
      : null;

    this.maxPrice =
      priceTo ||
      Math.round(+search.aggregations.max_price["agg-max-price"].value);
    this.minPrice =
      priceFrom ||
      Math.round(+search.aggregations.min_price["agg-min-price"].value);

    this.loading = false;
  },
};
</script>

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

.btn-sort {
  padding: 4px 8px !important;
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
