<template>
  <div class="container-fluid px-md-5 mt-5">
    <div class="row pt-5">
      <div class="col-12 col-md-3">
        <!-- <h1>{{ results.length }}</h1> -->
      </div>
      <div class="col-12 col-md-9">
        <p class="h3">{{ view.region }} {{ view.pairing }}</p>
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
        <!-- <dropdown label="Brands" :items="brands" />
        <dropdown
          label="Selezioni"
          :items="[
            {
              label: 'Preferiti di Callmewine',
              link: 'preferiti',
            },
            {
              label: 'Artigianali',
              link: 'artigianali',
            },
            {
              label: 'Biologici e Biodinamici',
              link: 'bio',
            },
            {
              label: 'Perfetti da regalare',
              link: 'regali',
            },
            {
              label: 'Vini rari',
              link: 'rari',
            },
          ]"
        />

        <dropdown
          label="Carta vini e altri prodotti"
          :items="[
            {
              label: 'Aglianico',
              link: 'aglianico',
            },
            {
              label: 'Aglianico del Vulture',
              link: 'vulture',
            },
            {
              label: 'Aidani',
              link: 'aidani',
            },
            {
              label: 'Airén',
              link: 'airen',
            },
            {
              label: 'Albana Secco',
              link: 'albana-secco',
            },
            {
              label: 'Albarino',
              link: 'albarino',
            },
          ]"
        />

        <dropdown
          label="Filosofia produttiva"
          :items="[
            {
              label: 'Artigianali',
              link: 'artigianali',
            },
            {
              label: 'Biologici',
              link: 'biologici',
            },
            {
              label: 'Biodinamici',
              link: 'biodinamici',
            },
            {
              label: 'Lieviti indigeni',
              link: 'lieviti-indigeni',
            },
            {
              label: 'Vignaioli indipendenti',
              link: 'vignaioli-indipendenti',
            },
            {
              label: 'Triple A',
              link: 'triple-a',
            },
          ]"
        /> -->

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
        <dropdown label="Provenienza" :items="regions" keyword="regions" />
        <dropdown label="Abbinamenti" :items="pairings" keyword="pairings" />
        <dropdown label="Premi" :items="awards" keyword="awards" />
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
      awards: null,
      results: null,
      total: null,
      currentPage: 1,
      view: {
        region: null,
        pairing: null,
      },
    };
  },
  computed: {},

  methods: {
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
    console.log(search);

    const total = search.hits.total.value;
    this.total = total;

    const regions = search.aggregations["agg-regions"]["agg-regions"].buckets;
    this.regions = regions;

    const pairings =
      search.aggregations["agg-pairings"]["agg-pairings"].buckets;
    this.pairings = pairings;

    const awards = search.aggregations["agg-awards"]["agg-awards"].buckets;
    this.awards = awards;

    this.results = search.hits.hits;

    const regionId = this.$route.query.regions;
    const pairingId = this.$route.query.pairings;

    this.view.region = regionId
      ? regions.find((x) => x.key[0] == regionId).key[1]
      : null;

    this.view.pairing = pairingId
      ? pairings.find((x) => x.key[0] == pairingId).key[1]
      : null;
    /* if (regionId)
      this.view.region = regions.find((x) => x.key[0] == regionId).key[1]; */
    /* console.log(, "region"); */

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
