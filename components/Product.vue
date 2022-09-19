<template>
  <div>
    <div class="container-fluid px-md-5" v-if="data">
      <div class="row px-3">
        <!-- {{ JSON.parse(data.metafield1.value).countryName }} -->
        <div class="col-12 col-md-4 position-relative">
          <div
            class="position-absolute"
            style="left: 20px; top: 10px; z-index: 10"
          >
            <img
              title="Favoriti"
              v-if="true"
              :src="require(`@/assets/images/selections/favourite.svg`)"
              class="selection-svg d-block mb-3"
            />
            <img
              title="Every day"
              v-if="true"
              :src="require(`@/assets/images/selections/foreveryday.svg`)"
              class="selection-svg d-block mb-3"
            />
            <img
              title="Novità"
              v-if="true"
              :src="require(`@/assets/images/selections/isnew.svg`)"
              class="selection-svg d-block mb-3 ml-1"
            />
            <img
              title="Novità"
              v-if="true"
              :src="require(`@/assets/images/selections/artisanal.svg`)"
              class="selection-svg d-block mb-3"
            />
          </div>
          <img
            v-if="!data.images.nodes[0].url"
            :src="require(`~/assets/images/img-test.jpeg`)"
            class="d-block mx-auto"
            alt=""
            style="height: 500px"
          />
          <img
            v-else
            :src="data.images.nodes[0].url"
            class="d-block mx-auto"
            alt=""
            style="height: 500px"
          />
        </div>
        <div class="col-12 col-md-8">
          <div class="row">
            <div class="col-12 mb-5">
              <h1>{{ data.title }}</h1>
              <p class="lead text-light-red">{{ data.vendor }}</p>
              <div v-html="metafield.shortDescription"></div>
            </div>
            <div class="col-4">
              <span style="font-size: 2.5rem; font-weight: 900">{{
                price.split(".")[0]
              }}</span
              >.<span style="font-size: 16px">{{ price.split(".")[1] }} €</span>
            </div>
            <div class="col-8 text-center">
              <div class="d-flex align-items-end justify-content-center">
                <div>
                  <p v-if="data.totalInventory > 0" class="text-light-green">
                    Disponibilità immediata ({{ data.totalInventory }})
                  </p>
                  <button
                    class="btn btn-light-red text-uppercase d-inline-flex align-items-center"
                    :class="data.totalInventory > 0 ? '' : 'disabled'"
                  >
                    <i class="fal fa-shopping-cart fa-2x mr-2"></i>
                    <span>Aggiungi al carrello</span>
                  </button>
                </div>
                <button class="btn ml-2">
                  <i class="fal fa-heart text-light-red fa-2x"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row px-3 mt-5">
        <div class="col-12 col-md-8 pt-5">
          <div class="pt-5">
            <b-tabs content-class="mt-5" justified>
              <b-tab :title="$t('Descrizione')">
                <div v-html="data.descriptionHtml"></div>
              </b-tab>
              <b-tab :title="$t('Per gustarlo al meglio')">
                <div>
                  <h3 class="mb-5">Per gustarlo al meglio</h3>

                  <div class="mb-5">
                    <h4 class="font-weight-bold">Temp. servizio</h4>
                    <p>{{ metafield.servingTemperature }}</p>
                  </div>

                  <div class="mb-5">
                    <h4 class="font-weight-bold">Quando bere</h4>
                    <p>{{ metafield.drinkNotesDrinkingTitle }}</p>
                    <p>{{ metafield.drinkNotesServingDescription }}</p>
                    <p>{{ metafield.drinkNotesDrinkingLongevity }}</p>
                  </div>

                  <div class="mb-5">
                    <h4 class="font-weight-bold">{{ metafield.glassTitle }}</h4>
                    <p>{{ metafield.glassDescription }}</p>
                  </div>
                </div>
              </b-tab>
              <b-tab :title="$t('Premi e riconoscimenti')">
                <table class="table table-striped">
                  <thead>
                    <tr class="bg-dark-green text-white">
                      <th style="border-radius: 15px 0px 0px 0px" scope="col">
                        GUIDA
                      </th>
                      <th scope="col">ANNATA</th>
                      <th scope="col">PUNTEGGIO</th>
                      <th style="border-radius: 0px 15px 0px 0px" scope="col">
                        CITAZIONE
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(award, i) in metafield.awards" :key="i">
                      <th scope="row">
                        <strong>{{ award.title }}</strong>
                      </th>
                      <td>XXX</td>
                      <td>
                        <strong>{{ award.value }}</strong> /
                        {{ award.maxValue }}
                      </td>
                      <td>XXX</td>
                    </tr>
                  </tbody>
                </table>
              </b-tab>
              <b-tab :title="$t('Produttore')">
                <div v-if="brand">
                  <h3 class="mb-5">{{ brand.title }}</h3>
                  <img :src="brand.image.url" alt="" />
                  <div v-html="brand.contentHtml"></div>
                </div>
              </b-tab>
              <b-tab :title="$t('Abbinamenti')">
                <!-- {{ metafield.foodPairings }} -->
                <h3 class="mb-5">Perfetto da bere con</h3>

                <div class="row">
                  <div
                    class="col-6 col-md-4 col-lg-3"
                    v-for="pairing in metafield.foodPairings"
                    :key="pairing.id"
                  >
                    <img
                      :src="pairing.image"
                      class="img-fluid"
                      style="border-radius: 10px"
                    />
                    <p>{{ pairing.name }}</p>
                  </div>
                </div>
              </b-tab>
            </b-tabs>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <div style="width: 80%" class="bg-light p-3 mx-auto">
            <h3 class="mb-5">Caratteristiche</h3>

            <div v-if="metafield.denomination">
              <p class="font-weight-bold mb-0">Denominazione</p>
              <p class="mb-4">{{ metafield.denomination }}</p>
              <hr />
            </div>
            <div v-if="metafield.grapes">
              <p class="font-weight-bold mb-0">Vitigni</p>
              <p class="mb-4">{{ metafield.grapes }}</p>
              <hr />
            </div>

            <div v-if="metafield.countryName || metafield.countryRegionName">
              <p class="font-weight-bold mb-0">Regione</p>
              <p class="mb-4">
                {{ metafield.countryRegionName }} ({{ metafield.countryName }})
              </p>
              <hr />
            </div>
            <div v-if="metafield.alcoholContent">
              <p class="font-weight-bold mb-0">Gradazione alcolica</p>
              <p class="mb-4">{{ metafield.alcoholContent }}%</p>
              <hr />
            </div>
            <div v-if="metafield.size">
              <p class="font-weight-bold mb-0">Formato</p>
              <p class="mb-4">{{ metafield.size }}</p>
              <hr />
            </div>
            <div v-if="metafield.winemaking">
              <p class="font-weight-bold mb-0">Vinificazione</p>
              <p class="mb-4">
                {{ metafield.winemaking }}
              </p>
              <hr />
            </div>
            <div v-if="metafield.agingDescription">
              <p class="font-weight-bold mb-0">Affinamento</p>
              <p class="mb-4">
                {{ metafield.agingDescription }}
              </p>
              <hr />
            </div>
            <div v-if="metafield.productInformations">
              <p class="font-weight-bold mb-0">Note aggiuntive</p>
              <p class="mb-4">{{ metafield.productInformations }}</p>
            </div>
          </div>
        </div>
      </div>
      {{ metafield }}
    </div>
  </div>
</template>

<script>
/* import { queryProductByIdAsTag } from "../../utilities/productQueries"; */

import { queryProductByIdAsTag } from "../utilities/productQueries";
import { getBrandForProduct } from "../utilities/brandForProduct";

export default {
  props: ["product"],
  data() {
    return {
      data: null,
      price: null,
      metafield: null,
      brand: null,
    };
  },
  async fetch() {
    console.log(this.product, "product QUA");

    const domain = this.$config.DOMAIN;
    const access_token = this.$config.STOREFRONT_ACCESS_TOKEN;

    const productQuery = queryProductByIdAsTag(this.product);

    const GRAPHQL_BODY = {
      async: true,
      crossDomain: true,
      method: "POST",
      headers: {
        "X-Shopify-Storefront-Access-Token": access_token,
        "Content-Type": "application/graphql",
      },
      body: productQuery,
    };
    const data = await fetch(domain, GRAPHQL_BODY).then((res) => res.json());
    this.data = data.data.products.edges[0].node;

    /* return; */

    this.price = this.data.variants.nodes[0].price;
    this.metafield = JSON.parse(this.data.metafield1.value);

    const brandId = this.metafield.brandId;
    alert("qui c'è un brand statico, cambialo!");
    const dataBrand = await getBrandForProduct(
      domain,
      access_token,
      "B" + brandId
    );
    this.brand = dataBrand;
    console.log(dataBrand, "brand");
  },
};
</script>

<style scoped>
.selection-svg {
  filter: brightness(0.7);
  width: 36px;
}
:deep(.nav-tabs .nav-link) {
  margin-bottom: -1px;
  border: none;
  color: #666;
  width: 200px;
}

:deep(.nav-tabs) {
  border-bottom: 1px solid #ddd;
}

:deep(.nav-tabs .nav-link.active, .nav-tabs .nav-item.show .nav-link) {
  color: var(--dark-red);
  /* font-weight: bold; */
  background-color: #fff;
  border-bottom: 4px solid var(--dark-red);
}
:deep(ul.nav.nav-tabs.nav-justified) {
  flex-wrap: nowrap;
  overflow-x: scroll;
}
</style>
