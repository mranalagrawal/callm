<template>
  <div class="container-fluid px-md-5 mt-5">
    <div class="row" v-if="data">
      <div class="col-12 col-md-3" v-if="filters">
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
            class="mb-3"
            :class="
              brand.isPartner ? 'col-12 px-4' : 'col-12 col-md-6 col-lg-4'
            "
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
              v-if="!brand.isPartner"
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
              <p class="text-center text-light-primary pb-2 mt-auto">
                {{ brand.country }} {{ brand.region }}
              </p>
            </nuxt-link>
            <div
              class="card row shadow flex-row"
              v-else
              style="height: 350px; overflow: hidden; border: 2px solid darkred"
            >
              <div class="col-6">
                <img
                  src="../../assets/images/isPartner.png"
                  alt=""
                  class="img-fluid d-block ml-auto"
                />
              </div>
              <div class="col-6">
                <nuxt-link
                  :to="
                    localePath(
                      '/winery' + '/' + brand.handle + '-B' + brand.brandId
                    )
                  "
                  class="text-decoration-none text-dark"
                >
                  <img
                    v-if="brand.url"
                    :src="brand.url"
                    alt=""
                    width="40%"
                    class="mx-auto d-block mt-5"
                  />
                  <p class="mt-5 text-center font-weight-bold">
                    {{ brand.name }}
                  </p>
                  <p class="text-center">
                    {{ brand.subtitle }}
                  </p>
                  <p class="text-center text-light-primary pb-2 mt-auto">
                    {{ brand.country }} {{ brand.region }}
                  </p>
                </nuxt-link>
              </div>
            </div>
          </div>
        </div>

        <div v-if="data" class="row justify-content-between">
          <button
            class="btn text-light-secondary"
            v-if="links.prev"
            @click="fetchPrev"
          >
            Pagina Precedente
          </button>
          <button
            class="btn text-light-secondary"
            v-if="links.next"
            @click="fetchNext"
          >
            Pagina successiva
          </button>
        </div>
      </div>
    </div>
    <Loader v-if="loading" />
  </div>
</template>

<script>
import DropdownWinery from "../../components/UI/DropdownWinery.vue";
import Loader from "../../components/UI/Loader.vue";

export default {
  components: { DropdownWinery, Loader },
  data() {
    return {
      data: null,
      links: null,
      filters: null,
      loading: null,
      baseURL: "https://callmewine-api.dojo.sh/api/brands",
    };
  },
  created() {
    this.$nuxt.$on("changeregions", (event) => {
      this.fetchRegions(event);
    });
    this.$nuxt.$on("changeproductionTypes", (event) => {
      this.fetchProductionTypes(event);
    });
    this.$nuxt.$on("changecountries", (event) => {
      this.fetchCountries(event);
    });
  },
  methods: {
    async fetchNext() {
      const data = await fetch(this.links.next);
      const dataJSON = await data.json();

      this.data = dataJSON.brands.data;
      this.links = dataJSON.links;
    },
    async fetchPrev() {
      const data = await fetch(this.links.prev);
      const dataJSON = await data.json();

      this.data = dataJSON.brands.data;
      this.links = dataJSON.links;
    },
    async fetchRegions(id) {
      const data = await fetch(this.baseURL + `?region=${id}`);
      const dataJSON = await data.json();

      this.data = dataJSON.brands.data;
      this.links = dataJSON.links;
    },
    async fetchProductionTypes(id) {
      const data = await fetch(this.baseURL + `?type=${id}`);
      const dataJSON = await data.json();

      this.data = dataJSON.brands.data;
      this.links = dataJSON.links;
    },
    async fetchCountries(id) {
      const data = await fetch(this.baseURL + `?country=${id}`);
      const dataJSON = await data.json();

      this.data = dataJSON.brands.data;
      this.links = dataJSON.links;
    },
  },
  async fetch() {
    this.loading = true;
    const data = await fetch(this.baseURL);
    const dataJSON = await data.json();

    console.log(dataJSON.brands.data);

    this.data = dataJSON.brands.data.sort((a, b) => b.isPartner - a.isPartner);
    this.links = dataJSON.links;
    this.filters = dataJSON.brands.filters;

    this.loading = false;
  },
};
</script>

<style scoped>
/* .partner {
  background-image: url("../../assets/images/isPartner.svg") !important;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border: 2px solid darkred;
} */
</style>
