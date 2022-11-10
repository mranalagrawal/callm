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
              <span class="small">
                {{ $t("product.recommendedByCallmewine") }}
              </span>
            </div>
            <h1 class="py-3">{{ data.title }}</h1>
            <p>{{ metafields.subtitle }}</p>
          </div>
          <div class="col-12">
            <div class="row mb-5">
              <div class="col-12">
                <BrandCarouselVue
                  v-if="images && images.length > 0"
                  :images="images"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="container-fluid px-md-5 mt-5">
        <div class="row">
          <div class="col-12 col-md-8">
            <div class="row py-3 bg-light">
              <div class="col-6 font-weight-bold">
                {{ $t("product.mainWines") }}
              </div>
              <div class="col-6"></div>
            </div>
            <div class="row py-3">
              <div class="col-6 font-weight-bold">
                {{ $t("product.foundation") }}
              </div>
              <div class="col-6">{{ metafields.year }}</div>
            </div>
            <div class="row py-3 bg-light">
              <div class="col-6 font-weight-bold">
                {{ $t("product.vineyardHectares") }}
              </div>
              <div class="col-6">{{ metafields.hectares }}</div>
            </div>
            <div class="row py-3">
              <div class="col-6 font-weight-bold">
                {{ $t("product.ownGrapes") }}
              </div>
              <div class="col-6">
                {{ metafields.ownedGrapes }}
              </div>
            </div>
            <div class="row py-3 bg-light">
              <div class="col-6 font-weight-bold">
                {{ $t("product.annualProduction") }}
              </div>
              <div class="col-6">
                {{ metafields.annualProduction }}
              </div>
            </div>
            <div class="row py-3">
              <div class="col-6 font-weight-bold">
                {{ $t("product.winemaker") }}
              </div>
              <div class="col-6"></div>
            </div>
            <div class="row py-3 bg-light">
              <div class="col-6 font-weight-bold">
                {{ $t("product.address") }}
              </div>
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
          <BrandCarouselVue
            v-if="images && images.length > 0"
            :images="images"
          />

          <!-- {{ data }} -->
          <div class="pt-5 pt-md-0 mt-5" v-html="data.contentHtml"></div>
        </div>
        <div class="col-12 col-md-6">
          <div class="row py-3 bg-light">
            <div class="col-6 font-weight-bold">
              {{ $t("product.mainWines") }}
            </div>
            <div class="col-6"></div>
          </div>
          <div class="row py-3">
            <div class="col-6 font-weight-bold">
              {{ $t("product.foundation") }}
            </div>
            <div class="col-6">{{ metafields.year }}</div>
          </div>
          <div class="row py-3 bg-light">
            <div class="col-6 font-weight-bold">
              {{ $t("product.vineyardHectares") }}
            </div>
            <div class="col-6">{{ metafields.hectares }}</div>
          </div>
          <div class="row py-3">
            <div class="col-6 font-weight-bold">
              {{ $t("product.ownGrapes") }}
            </div>
            <div class="col-6">
              {{ metafields.ownedGrapes }}
            </div>
          </div>
          <div class="row py-3 bg-light">
            <div class="col-6 font-weight-bold">
              {{ $t("product.annualProduction") }}
            </div>
            <div class="col-6">
              {{ metafields.annualProduction }}
            </div>
          </div>
          <div class="row py-3">
            <div class="col-6 font-weight-bold">
              {{ $t("product.winemaker") }}
            </div>
            <div class="col-6"></div>
          </div>
          <div class="row py-3 bg-light">
            <div class="col-6 font-weight-bold">
              {{ $t("product.address") }}
            </div>
            <div class="col-6">{{ metafields.address }}</div>
          </div>
          <div class="row py-3">
            <div class="col-12">
              <img :src="data.image.url" alt="" class="d-block mx-auto" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="data">
      <VendorProductsInBrand :vendor="data.title" />
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
      images: null,
    };
  },
  async fetch() {
    const domain = this.$config.DOMAIN;
    const access_token = this.$config.STOREFRONT_ACCESS_TOKEN;

    const data = await getBrand(domain, access_token, this.brandId);

    this.data = data;
    this.metafields = JSON.parse(data.details.value);
    this.images = this.metafields.images;
  },
};
</script>

<style scoped>
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
  background: var(--dark-primary);
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
  border-left: 12px solid var(--dark-secondary);
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
  border-right: 12px solid var(--dark-secondary);
}

.svg-favourite {
  filter: brightness(100);
}
</style>
