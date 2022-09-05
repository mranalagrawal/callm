<template>
  <div class="container-fluid px-md-5 mt-5">
    <div class="row pt-5">
      <div class="col-12 col-md-3">
        <!-- <h1>{{ results.length }}</h1> -->
      </div>
      <div class="col-12 col-md-9">
        <div class="h3">
          <!-- {{ view.region?.name }} {{ view.pairing?.name }}
          {{ view.brand?.name }} {{ view.aging?.name }}
          {{ view.philosophy?.name }} {{ view.size?.name }}
          {{ view.dosagecontent?.name }} {{ view.category?.name }}
          {{ view.winelists?.name }}
          {{ view.award?.name }} -->
          <!-- {{ view }} -->

          <!-- {{ Object.entries(view).filter((el) => el[1] !== null) }} -->
          <button
            class="btn btn-dark-red mx-2"
            v-for="(item, ind) in Object.entries(view).filter(
              (el) => el[1] !== null
            )"
            :key="ind"
            @click="removeFromQuery(item[1])"
          >
            {{ item[1].name }}
          </button>
        </div>
        <p class="h3">
          {{ total }}
        </p>
      </div>
    </div>

    <div class="row mt-5 d-none">
      <div class="col-12">
        <p class="font-weight-bold">Filtra per:</p>
        <hr class="mb-2" />
      </div>
      <div class="col-12">
        <dropdown-range label="Prezzo" min="0" max="999" />

        <div class="float-right">
          <b-button
            v-b-toggle.more-filters
            variant="danger"
            class="bg-transparent border-0"
          >
            <span class="small text-dark-red"
              >Altri filtri <i class="fal fa-plus ml-3"></i
            ></span>
          </b-button>
        </div>
      </div>
    </div>
    <div class="row d-none">
      <b-collapse class="col-12" id="more-filters">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aliquam quod
        unde cum cumque dolorum totam accusantium magni aperiam, facilis odio!
      </b-collapse>
    </div>
    <div class="row">
      <div class="col-12">
        <hr />
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <button @click="backward">pagina prima</button>
        <button @click="forward">pagina dopo</button>
      </div>
    </div>

    <div class="row mt-5" v-if="results">
      <div class="col-12 col-md-3">
        <dropdown label="categories" :items="categories" keyword="categories" />
        <dropdown label="winelists" :items="winelists" keyword="winelists" />
        <dropdown label="pairings" :items="pairings" keyword="pairings" />
        <dropdown
          label="dosagecontents"
          :items="dosagecontents"
          keyword="dosagecontent"
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
      </div>
      <div class="col-12 col-md-9">
        <div class="row">
          <div
            class="col-12 col-md-6 col-lg-3 mb-3"
            v-for="result in results"
            :key="result._id"
          >
            <div class="card shadow">
              <p>
                {{ result._source.shortName }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="loader" v-if="loading">
      <div class="wrapper shadow">
        <!-- <i class="fas fa-spinner fa-spin fa-3x text-muted"></i> -->

        <div class="bottle">
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            width="26.81px"
            height="106.124px"
            viewBox="0 0.5 26.81 106.124"
            enable-background="new 0 0.5 26.81 106.124"
            xml:space="preserve"
          >
            <defs>
              <pattern
                id="water_fill"
                width=".25"
                height="1.1"
                patternContentUnits="objectBoundingBox"
              >
                <path
                  fill="#992645"
                  d="M0.25,1H0c0,0,0-0.659,0-0.916c0.083-0.303,0.158,0.334,0.25,0C0.25,0.327,0.25,1,0.25,1z"
                />
              </pattern>
              <path
                id="bottle"
                d="M17.905,38.109V9.734c0,0,1.75-3.125,1.375-5.5s-5.875-2.232-5.875-2.232s-5.5-0.143-5.875,2.232
	s1.375,5.5,1.375,5.5v28.375c0,0-7.405,1.311-7.405,16.03s0,40.72,0,45.47s5.515,5.515,5.515,5.515h6.39h6.39
	c0,0,5.515-0.765,5.515-5.515s0-30.75,0-45.47S17.905,38.109,17.905,38.109z"
              />
              <mask id="bottle_mask">
                <use
                  x="0"
                  y="0"
                  xlink:href="#bottle"
                  opacity="1"
                  fill="#ffffff"
                />
              </mask>
            </defs>
            <rect
              class="bottle-fill"
              mask="url(#bottle_mask)"
              fill="url(#water_fill)"
              x="-400"
              y="0"
              width="1600"
              height="120"
            />
            <path
              id="btl-out"
              fill="none"
              stroke="#333"
              stroke-width="3"
              stroke-miterlimit="10"
              d="M17.905,38.109V9.734
	c0,0,1.75-3.125,1.375-5.5s-5.875-2.232-5.875-2.232s-5.5-0.143-5.875,2.232s1.375,5.5,1.375,5.5v28.375
	c0,0-7.405,1.311-7.405,16.03s0,40.72,0,45.47s5.515,5.515,5.515,5.515h6.39h6.39c0,0,5.515-0.765,5.515-5.515s0-30.75,0-45.47
	S17.905,38.109,17.905,38.109z"
            />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Dropdown from "../components/UI/Dropdown.vue";
import DropdownRange from "../components/UI/DropdownRange.vue";

export default {
  watch: {
    "$route.query": "$fetch",
  },
  components: {
    Dropdown,
    DropdownRange,
  },
  data() {
    return {
      loading: null,
      brands: null,
      regions: null,
      pairings: null,
      agings: null,
      philosophies: null,
      sizes: null,
      dosagecontents: null,
      categories: null,
      winelists: null,
      awards: null,
      results: null,
      total: null,
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
      },
    };
  },
  computed: {},

  methods: {
    removeFromQuery(obj) {
      console.log(obj);
      const query = Object.assign({}, this.$route.query);

      delete query[obj.field];

      this.$router.push({
        path: "search",
        query: query,
      });
    },
    forward() {
      const query = Object.assign({}, this.$route.query);

      this.currentPage++;
      query["page"] = this.currentPage;

      this.$router.push({
        path: "search",
        query: query,
      });
    },
    backward() {
      const query = Object.assign({}, this.$route.query);

      if (this.currentPage == 1) return;

      this.currentPage--;
      query["page"] = this.currentPage;

      this.$router.push({
        path: "search",
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
    this.loading = true;
    let route = this.$route;
    /* console.log(route.fullPath.split("search?")[1], "SSSS"); */

    this.currentPage = this.$route.query["page"];

    let query = route.fullPath.split("search?")[1];
    const searchResult = await fetch(
      "http://callmewine-api.dojo.sh/api/products/search?" + query
    );

    const search = await searchResult.json();
    /* console.log(search); */

    this.results = search.hits.hits;

    const total = search.hits.total.value;
    this.total = total;

    const regions = search.aggregations["agg-regions"]["agg-regions"].buckets;
    console.log(regions);
    this.regions = regions;

    const brands = search.aggregations["agg-brands"]["agg-brands"].buckets;
    this.brands = brands;

    const vintages =
      search.aggregations["agg-vintages"]["agg-vintages"].buckets;
    this.vintages = vintages;

    const sizes = search.aggregations["agg-sizes"]["agg-sizes"].buckets;
    this.sizes = sizes;

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

    const dosagecontents = search.aggregations["agg-dosagecontent"][
      "agg-dosagecontent"
    ]["buckets"].map((el) => {
      return {
        key: [el.key, el.key],
        key_as_string: `${el.key}|${el.key}`,
        doc_count: el.doc_count,
      };
    });
    this.dosagecontents = dosagecontents;

    console.log(dosagecontents, "dosagecontents");
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

    const brandId = this.$route.query.brands;
    const regionId = this.$route.query.regions;
    const pairingId = this.$route.query.pairings;
    const agingId = this.$route.query.agings;
    const philosophyId = this.$route.query.philosophies;
    const sizeId = this.$route.query.sizes;
    const dosagecontentId = this.$route.query.dosagecontent;
    const categoryId = this.$route.query.categories;
    const winelistsId = this.$route.query.winelists;
    const awardId = this.$route.query.awards;

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

    this.view.winelists = winelistsId
      ? {
          key: winelistsId,
          name: winelists.find((x) => x.key[0] == winelistsId).key[1],
          field: "winelists",
        }
      : null;

    this.view.award = awardId
      ? {
          key: awardId,
          name: awards.find((x) => x.key[0] == awardId).key[1],
          field: "awards",
        }
      : null;

    /* 
        
        pairing: null,
        aging: null,
        philosophy: null,
        size: null,
        dosagecontent: null,
        category: null,
        winelists: null,
        award: null, */

    this.loading = false;
  },
};
</script>

<style scoped>
.badge {
  border-radius: 2rem !important;
  padding: 0.25em 1em;
  font-weight: normal;
}

.loader {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;
  z-index: 999;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

.wrapper {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
}

.bottle-fill {
  animation: waves 2500ms infinite linear, fill 2500ms infinite forwards;
}

.bottle {
  opacity: 1;
  width: 40px;
  text-align: center;
  position: absolute;
  display: inline-block;
  vertical-align: bottom;

  animation: move 1500ms linear infinite;
}

@keyframes waves {
  0% {
    x: -200px;
  }
  25% {
    x: -100px;
  }
  50% {
    x: -200px;
  }
  75%,
  100% {
    x: -40px;
  }
}
@keyframes fill {
  0% {
    height: 0;
    y: 125px;
  }
  30%,
  100% {
    height: 100px;
    y: 25px;
  }
}

@keyframes move {
  0% {
    transform: rotateZ(-30deg);
  }
  100% {
    transform: rotateZ(30deg);
  }
}
</style>
