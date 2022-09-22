<template>
  <div
    v-if="data && metafields"
    class="container-fluid"
    :class="metafields.isPartner ? 'partner' : ''"
  >
    <div class="container">
      <div class="row align-items-center mt-5">
        <div class="col-12 mb-3 mt-5 bg-white pt-2">
          <div v-if="metafields.isPartner" class="ribbon">
            <img
              :src="require(`@/assets/images/selections/favourite.svg`)"
              class="svg-favourite"
              style="width: 20px"
            />
            <span class="small">Consigliato da Callmewine</span>
          </div>
          <h1>{{ data.title }}</h1>
          <p>{{ metafields.subtitle }}</p>
        </div>
        <div class="col-12 col-md-5 h-100 bg-white">
          <img :src="data.image.url" alt="" class="d-block mx-auto" />
        </div>
        <div class="col-12 col-md-7 h-100 bg-white">
          <div class="row">
            <div class="col-12">
              <div class="row py-3 bg-light">
                <div class="col-6 font-weight-bold">Vini Principali</div>
                <div class="col-6"></div>
              </div>
              <div class="row py-3">
                <div class="col-6 font-weight-bold">Anno di fondazione</div>
                <div class="col-6">{{ metafields.year }}</div>
              </div>
              <div class="row py-3 bg-light">
                <div class="col-6 font-weight-bold">Ettari vitati</div>
                <div class="col-6">{{ metafields.hectares }}</div>
              </div>
              <div class="row py-3">
                <div class="col-6 font-weight-bold">Uve di proprietà</div>
                <div class="col-6">
                  {{ metafields.ownedGrapes }}
                </div>
              </div>
              <div class="row py-3 bg-light">
                <div class="col-6 font-weight-bold">Produzione annua</div>
                <div class="col-6">
                  {{ metafields.annualProduction }}
                </div>
              </div>
              <div class="row py-3">
                <div class="col-6 font-weight-bold">Enologo</div>
                <div class="col-6"></div>
              </div>
              <div class="row py-3 bg-light">
                <div class="col-6 font-weight-bold">Indirizzo</div>
                <div class="col-6">{{ metafields.address }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-5" v-html="data.contentHtml"></div>
    </div>
  </div>
</template>

<script>
/* import { queryProductByHandle } from "../../utilities/productQueries"; */

import { getBrand } from "../utilities/brandForProduct";
export default {
  props: ["brandId"],
  data() {
    return {
      data: null,
      metafields: null,
    };
  },
  async fetch() {
    const domain = this.$config.DOMAIN;
    const access_token = this.$config.STOREFRONT_ACCESS_TOKEN;

    const data = await getBrand(domain, access_token, this.brandId);

    console.log(data);
    this.data = data;
    this.metafields = JSON.parse(data.details.value);
    console.log(this.metafields);
  },
};
</script>

<style scoped>
.ribbon {
  background: var(--dark-green);
  color: white;
  position: relative;
  display: inline-block;
  padding: 0px 32px 0px 32px;
  height: 24px;
}

.ribbon::before {
  position: absolute;
  content: "";
  width: 0;
  height: 0;
  top: 0px;
  left: 0px;
  border-top: 12px solid transparent;
  border-bottom: 12px solid transparent;
  border-left: 12px solid white;
}

.ribbon::after {
  position: absolute;
  content: "";
  width: 0;
  height: 0;
  top: 0px;
  right: 0px;
  border-top: 12px solid transparent;
  border-bottom: 12px solid transparent;
  border-right: 12px solid white;
}

.svg-favourite {
  filter: brightness(100);
}

.partner {
  background: url("assets/images/selections/red.svg");
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center top;
}
</style>
