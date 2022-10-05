<template>
  <div class="container-fluid px-0 mt-n5" v-if="data && metafields">
    <div class="container-fluid px-0" v-if="metafields.isPartner">
      <div class="container-fluid partner-bg px-md-5">
        <div class="row text-white">
          <div class="col-12">
            <div class="ribbon mt-5">
              <img
                :src="require(`@/assets/images/selections/favourite.svg`)"
                class="svg-favourite"
                style="width: 20px"
              />
              <span class="small">Consigliato da Callmewine</span>
            </div>
            <h1 class="py-3">{{ data.title }}</h1>
            <p>{{ metafields.subtitle }}</p>
          </div>
          <div class="row mb-5 w-100">
            <div class="col-12">
              <BrandCarouselVue />
              <!-- <img
                src="https://picsum.photos/1920/540"
                class="img-fluid"
                alt=""
              /> -->
            </div>
          </div>
        </div>
      </div>
      <div class="container-fluid px-md-5 mt-5">
        <div class="row">
          <div class="col-12 col-md-8">
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
          <div class="col-12 col-md-4">
            <img :src="data.image.url" alt="" />
          </div>
        </div>
      </div>
      <div class="container-fluid px-md-5">
        <div class="row">
          <div class="col-12">
            <div class="mt-5" v-html="data.contentHtml"></div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="container-fluid px-md-5">
      <div class="row">
        <div class="col-12 mt-5">
          <h1 class="pt-3 font-weight-bold">{{ data.title }}</h1>
          <p class="h3">{{ metafields.subtitle }}</p>
        </div>
        <div class="col-12 col-md-6">
          <BrandCarouselVue />
          <!-- <VueSlickCarousel
            ref="c1"
            :asNavFor="$refs.c2"
            :focusOnSelect="true"
            v-bind="settingsMain"
          >
            >
            <div v-for="i in 10" :key="i">
              <img
                :src="`https://picsum.photos/id/${i}/400/250`"
                alt=""
                class="mx-auto d-block img-fluid w-100"
              />
            </div>
          </VueSlickCarousel>

          <div class="mt-3">
            <VueSlickCarousel
              v-bind="settingsNav"
              ref="c2"
              :asNavFor="$refs.c1"
              :focusOnSelect="true"
            >
              <div v-for="i in 10" :key="i">
                <img
                  :src="`https://picsum.photos/id/${i}/120/60`"
                  alt=""
                  class="mx-auto d-block"
                />
              </div>
            </VueSlickCarousel>
          </div> -->
          <!-- {{ data }} -->
          <div class="mt-5" v-html="data.contentHtml"></div>
        </div>
        <div class="col-12 col-md-6">
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
          <div class="row py-3">
            <div class="col-12">
              <img :src="data.image.url" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* import { queryProductByHandle } from "../../utilities/productQueries"; */

import { getBrand } from "../utilities/brandForProduct";
import BrandCarouselVue from "./UI/BrandCarousel.vue";

export default {
  props: ["brandId"],
  components: { BrandCarouselVue },
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
:deep(.slick-arrow.slick-prev) {
  width: 48px;
  height: 48px;
  background: white;
  box-shadow: 0 0.5rem 1rem rgba(102, 101, 101, 0.5) !important;
  background-image: url("../assets/images/chevron-left.svg") !important;
  background-size: 75%;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;
  left: 10px;
}
:deep(.slick-arrow.slick-next) {
  width: 48px;
  height: 48px;
  background: white;
  box-shadow: 0 0.5rem 1rem rgba(102, 101, 101, 0.5) !important;
  background-image: url("../assets/images/chevron-right.svg") !important;
  background-size: 75%;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;
  right: 10px;
}
:deep(.slick-prev::before) {
  color: red;
  /* content: "\2039"; */
  content: "";
  font-size: 60px;
  line-height: unset;
}
:deep(.slick-next::before) {
  color: red;
  /* content: "\203A"; */
  content: "";
  font-size: 60px;
  line-height: unset;
}

.partner-bg {
  background: linear-gradient(transparent, transparent 70%, white),
    url("assets/images/selections/red.svg");
  background-size: cover;
  background-repeat: no-repeat;
}

.partner-bg {
  background: url("assets/images/onda.svg"),
    url("assets/images/selections/red.svg");
  background-size: cover;
  background-repeat: no-repeat;
}

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
  border-left: 12px solid var(--dark-red);
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
  border-right: 12px solid var(--dark-red);
}

.svg-favourite {
  filter: brightness(100);
}
</style>
