<template>
  <div class="container-fluid px-md-5 mt-5">
    <div class="row pt-5">
      <div class="col-12">
        <div class="" v-if="searchedTerm">
          <h2 class="font-weight-bold">"{{ searchedTerm }}"</h2>
          <p class="h3">I risultati della tua ricerca</p>
        </div>
        <div class="h3">
          {{ view.region?.name }} {{ view.pairing?.name }}
          {{ view.brand?.name }} {{ view.aging?.name }}
          {{ view.philosophy?.name }} {{ view.size?.name }}
          {{ view.dosagecontent?.name }} {{ view.category?.name }}
          {{ view.winelists?.name }}
          {{ view.award?.name }}
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
            label="selections"
            :items="null"
            keyword="selections"
            :search="search"
          />
          <dropdown
            label="categories"
            :items="categories"
            keyword="categories"
          />
          <dropdown label="winelists" :items="winelists" keyword="winelists" />
          <dropdown label="pairings" :items="pairings" keyword="pairings" />
          <dropdown
            label="dosagecontents"
            :items="dosagecontents"
            keyword="dosagecontents"
          />
          <dropdown label="Provenienza" :items="regions" keyword="regions" />
          <dropdown label="Brands" :items="brands" keyword="brands" />
          <dropdown label="sizes" :items="sizes" keyword="sizes" />
          <dropdown label="vintages" :items="vintages" keyword="vintages" />
          <dropdown label="awards" :items="awards" keyword="awards" />
          <dropdown label="agings" :items="agings" keyword="agings" />
          <dropdown
            label="philosophies"
            :items="philosophies"
            keyword="philosophies"
          />

          <dropdown-range label="Prezzo" :min="minPrice" :max="maxPrice" />
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
                  <button
                    class="btn py-3 btn-sort-by w-100 text-left d-block"
                    @click="sortBy('awardcount', 'desc')"
                  >
                    Più premiati
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

        <dropdown label="categories" :items="categories" keyword="categories" />
        <dropdown label="winelists" :items="winelists" keyword="winelists" />
        <dropdown label="pairings" :items="pairings" keyword="pairings" />
        <dropdown
          label="dosagecontents"
          :items="dosagecontents"
          keyword="dosagecontents"
        />
        <dropdown label="Provenienza" :items="regions" keyword="regions" />
        <dropdown label="Brands" :items="brands" keyword="brands" />
        <dropdown label="sizes" :items="sizes" keyword="sizes" />
        <dropdown label="vintages" :items="vintages" keyword="vintages" />
        <dropdown label="awards" :items="awards" keyword="awards" />
        <dropdown label="agings" :items="agings" keyword="agings" />
        <dropdown
          label="philosophies"
          :items="philosophies"
          keyword="philosophies"
        />
        <!--         <dropdown-range
          label="Prezzo"
          :min="minPrice"
          :max="maxPrice"
          :choosenMin="minPrice"
          :choosenMax="maxPrice"
        /> -->
        <dropdown-range label="Prezzo" :min="minPrice" :max="maxPrice" />

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
      categories: null,
      winelists: null,
      awards: null,
      vintages: null,
      results: null,
      activeSelections: null,
      total: null,
      totalPages: null,
      currentPage: 1,
      view: {
        brand: null,
        region: null,
        pairing: null,
        aging: null,
        philosophy: null,
        size: null,
        dosagecontent: null,
        category: null,
        winelists: null,
        award: null,
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

    let query = new URLSearchParams(this.inputParameters).toString();
    /* console.clear();
    console.log(this.inputParameters, "SS"); */
    let sel = "&";

    if (this.inputParameters.sel) {
      sel += this.inputParameters.sel
        .split(",")
        .map((el) => el + "=true")
        .join("&");
    }

    const searchResult = await fetch(
      "https://callmewine-api.dojo.sh/api/products/search?" + query + sel
    );

    const allFields = await fetch(
      "https://callmewine-api.dojo.sh/api/products/search?"
    );
    const allFieldsJSON = await allFields.json();

    const search = await searchResult.json();

    this.search = search;
    this.results = search.hits.hits;

    /*     console.clear();
    console.log("min", this.minPrice);
    console.log("max", this.maxPrice); */

    const total = search.hits.total.value;
    this.total = total;

    this.totalPages = Math.ceil(total / 50);

    const typeA = ["regions", "brands", "vintages", "sizes", "dosagecontents"];

    typeA.forEach((el) => {
      const buckets = search.aggregations[`agg-${el}`][`agg-${el}`].buckets;
      this[`${el}`] = buckets;
    });

    const regions = search.aggregations["agg-regions"]["agg-regions"].buckets;
    this.regions = regions;

    const brands = search.aggregations["agg-brands"]["agg-brands"].buckets;
    this.brands = brands;

    const vintages =
      search.aggregations["agg-vintages"]["agg-vintages"].buckets;
    this.vintages = vintages;

    const sizes = search.aggregations["agg-sizes"]["agg-sizes"].buckets;
    this.sizes = sizes;

    const dosagecontents =
      search.aggregations["agg-dosagecontents"]["agg-dosagecontents"].buckets;
    this.dosagecontents = dosagecontents;

    const awards = search.aggregations["agg-awards"]["inner"]["result"][
      "buckets"
    ].map((el) => {
      return {
        key: [el.key, el.name.buckets[0].key],
        key_as_string: `${el.key}|${el.name.buckets[0].key}`,
        doc_count: el.doc_count,
      };
    });
    this.awards = awards;

    const agings = search.aggregations["agg-agings"]["inner"]["result"][
      "buckets"
    ].map((el) => {
      return {
        key: [el.key, el.name.buckets[0].key],
        key_as_string: `${el.key}|${el.name.buckets[0].key}`,
        doc_count: el.doc_count,
      };
    });
    this.agings = agings;

    const categories = search.aggregations["agg-categories"]["inner"]["result"][
      "buckets"
    ].map((el) => {
      return {
        key: [el.key, el.name.buckets[0].key],
        key_as_string: `${el.key}|${el.name.buckets[0].key}`,
        doc_count: el.doc_count,
      };
    });
    this.categories = categories;

    const philosophies = search.aggregations["agg-philosophies"]["inner"][
      "result"
    ]["buckets"].map((el) => {
      return {
        key: [el.key, el.name.buckets[0].key],
        key_as_string: `${el.key}|${el.name.buckets[0].key}`,
        doc_count: el.doc_count,
      };
    });
    this.philosophies = philosophies;

    const winelists = search.aggregations["agg-winelists"]["inner"]["result"][
      "buckets"
    ].map((el) => {
      return {
        key: [el.key, el.name.buckets[0].key],
        key_as_string: `${el.key}|${el.name.buckets[0].key}`,
        doc_count: el.doc_count,
      };
    });

    this.winelists = winelists;

    const pairings = search.aggregations["agg-pairings"]["inner"]["result"][
      "buckets"
    ].map((el) => {
      return {
        key: [el.key, el.name.buckets[0].key],
        key_as_string: `${el.key}|${el.name.buckets[0].key}`,
        doc_count: el.doc_count,
      };
    });
    this.pairings = pairings;

    const brandId = this.inputParameters.brands;
    const regionId = this.inputParameters.regions;
    const pairingId = this.inputParameters.pairings;
    const agingId = this.inputParameters.agings;
    const philosophyId = this.inputParameters.philosophies;
    const sizeId = this.inputParameters.sizes;
    const dosagecontentId = this.inputParameters.dosagecontents;
    const categoryId = this.inputParameters.categories;
    const winelistsId = this.inputParameters.winelists;
    const awardId = this.inputParameters.awards;
    const vintageId = this.inputParameters.vintages;
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

    this.view.winelists = winelistsId
      ? {
          key: winelistsId,
          name: winelists.find((x) => x.key[0] == winelistsId).key[1],
          field: "winelists",
        }
      : null;

    this.view.brand = brandId
      ? {
          key: brandId,
          name: brands.find((x) => x.key[0] == brandId).key[1],
          field: "brands",
        }
      : null;
    this.view.region = regionId
      ? {
          key: regionId,
          name: regions.find((x) => x.key[0] == regionId).key[1],
          field: "regions",
        }
      : null;

    this.view.pairing = pairingId
      ? {
          key: pairingId,
          name: pairings.find((x) => x.key[0] == pairingId).key[1],
          field: "pairings",
        }
      : null;
    this.view.aging = agingId
      ? {
          key: agingId,
          name: agings.find((x) => x.key[0] == agingId).key[1],
          field: "agings",
        }
      : null;

    this.view.philosophy = philosophyId
      ? {
          key: philosophyId,
          name: philosophies.find((x) => x.key[0] == philosophyId).key[1],
          field: "philosophies",
        }
      : null;
    this.view.size = sizeId
      ? {
          key: sizeId,
          name: sizes.find((x) => x.key[0] == sizeId).key[1],
          field: "sizes",
        }
      : null;

    this.view.dosagecontent = dosagecontentId
      ? {
          key: dosagecontentId,
          name: dosagecontents.find((x) => x.key[0] == dosagecontentId).key[1],
          field: "dosagecontents",
        }
      : null;

    this.view.category = categoryId
      ? {
          key: categoryId,
          name: categories.find((x) => x.key[0] == categoryId).key[1],
          field: "categories",
        }
      : null;

    this.view.award = awardId
      ? {
          key: awardId,
          name: awards.find((x) => x.key[0] == awardId).key[1],
          field: "awards",
        }
      : null;
    this.view.vintage = vintageId
      ? {
          key: vintageId,
          name: vintages.find((x) => x.key[0] == vintageId).key[1],
          field: "vintages",
        }
      : null;
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
