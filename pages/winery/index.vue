<template>
  <div class="container-fluid px-md-5 mt-5">
    <div class="row" v-if="data">
      <div class="col-12 col-md-3">filtri</div>
      <div class="col-12 col-md-9">
        <div class="row">
          <div class="col-12">
            <button
              class="btn btn-outline-light-red"
              v-if="links.prev"
              @click="fetchPrev"
            >
              Prev
            </button>
            <button
              class="btn btn-outline-light-red"
              v-if="links.next"
              @click="fetchNext"
            >
              next
            </button>
          </div>
        </div>
        <div class="row">
          <div
            class="col-12 col-md-6 col-lg-4 mb-3"
            v-for="brand in data"
            :key="brand.brandId"
          >
            <nuxt-link
              :to="
                localePath('/winery' + '/' + brand.name + '-B' + brand.brandId)
              "
              class="card shadow h-100 p-3 text-decoration-none text-dark"
            >
              <img
                v-if="brand.url"
                :src="brand.url"
                alt=""
                width="40%"
                class="mx-auto d-block"
              />
              <p class="mt-5 text-center font-weight-bold">{{ brand.name }}</p>
              <p class="text-center">
                {{ brand.subtitle }}
              </p>
              <p class="text-center text-light-green pb-5">
                {{ brand.country }}
              </p>
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: null,
      links: null,
    };
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
  },
  async fetch() {
    const data = await fetch("http://callmewine-api.dojo.sh/api/brands");
    const dataJSON = await data.json();
    console.log(dataJSON);
    this.data = dataJSON.brands.data;
    this.links = dataJSON.links;
  },
};
</script>
