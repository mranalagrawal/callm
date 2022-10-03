<template>
  <div class="container-fluid px-md-5 mt-5">
    <div class="row" v-if="data">
      <div class="col-12 col-md-3" v-if="filters">
        <!-- {{ filters.countries }} -->

        <dropdown-winery
          label="Production Types"
          :items="filters.productionTypes"
          keyword="productionTypes"
        />
        <dropdown-winery
          label="Regions"
          :items="filters.regions"
          keyword="regions"
        />
        <dropdown-winery
          label="Country"
          :items="filters.countries"
          keyword="countries"
        />
      </div>
      <div class="col-12 col-md-9">
        <div class="row">
          <div
            class="col-12 col-md-6 col-lg-4 mb-3"
            v-for="brand in data"
            :key="brand.brandId"
          >
            <nuxt-link
              :to="
                localePath(
                  '/winery' + '/' + brand.handle + '-B' + brand.brandId
                )
              "
              class="card shadow h-100 p-3 text-decoration-none text-dark"
              :class="brand.isPartner ? 'partner' : ''"
            >
              <img
                v-if="brand.url"
                :src="brand.url"
                alt=""
                width="40%"
                class="mx-auto d-block mt-5"
              />
              <p class="mt-5 text-center font-weight-bold">{{ brand.name }}</p>
              <p class="text-center">
                {{ brand.subtitle }}
              </p>
              <p class="text-center text-light-green pb-2 mt-auto">
                {{ brand.country }} {{ brand.region }}
              </p>
            </nuxt-link>
          </div>
        </div>

        <div v-if="data" class="row justify-content-between">
          <button
            class="btn text-light-red"
            v-if="links.prev"
            @click="fetchPrev"
          >
            Pagina Precedente
          </button>
          <button
            class="btn text-light-red"
            v-if="links.next"
            @click="fetchNext"
          >
            Pagina successiva
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DropdownWinery from "../../components/UI/DropdownWinery.vue";

export default {
  components: { DropdownWinery },
  data() {
    return {
      data: null,
      links: null,
      filters: null,
      baseURL: "https://callmewine-api.dojo.sh/api/brands",
    };
  },
  created() {
    this.$nuxt.$on("changeregions", (event) => {
      this.fetchRegions(event);
    });
    this.$nuxt.$on("changeproductionTypes", (event) => {
      this.fetchProductionTypes(event);
      console.log(event);
    });
    this.$nuxt.$on("changecountries", (event) => {
      this.fetchCountries(event);
      console.log(event);
    });
  },
  methods: {
    async fetchNext() {
      const data = await fetch(this.links.next);
      const dataJSON = await data.json();
      console.log(dataJSON);
      this.data = dataJSON.brands.data;
      this.links = dataJSON.links;
    },
    async fetchPrev() {
      const data = await fetch(this.links.prev);
      const dataJSON = await data.json();
      console.log(dataJSON);
      this.data = dataJSON.brands.data;
      this.links = dataJSON.links;
    },
    async fetchRegions(id) {
      const data = await fetch(this.baseURL + `?region=${id}`);
      const dataJSON = await data.json();
      console.log(dataJSON);
      this.data = dataJSON.brands.data;
      this.links = dataJSON.links;
    },
    async fetchProductionTypes(id) {
      const data = await fetch(this.baseURL + `?type=${id}`);
      const dataJSON = await data.json();
      console.log(dataJSON);
      this.data = dataJSON.brands.data;
      this.links = dataJSON.links;
    },
    async fetchCountries(id) {
      const data = await fetch(this.baseURL + `?country=${id}`);
      const dataJSON = await data.json();
      console.log(dataJSON);
      this.data = dataJSON.brands.data;
      this.links = dataJSON.links;
    },
  },
  async fetch() {
    const data = await fetch(this.baseURL);
    const dataJSON = await data.json();
    console.log(dataJSON, "dataJSON");
    this.data = dataJSON.brands.data;
    this.links = dataJSON.links;
    this.filters = dataJSON.brands.filters;
  },
};
</script>

<style scoped>
.partner {
  background: linear-gradient(90deg, transparent 60px, white 60px),
    url("@/assets/images/red.svg");
  background-size: cover;
}
</style>
