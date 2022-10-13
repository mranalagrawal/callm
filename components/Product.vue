<template>
  <div>
    <div class="container-fluid px-md-5" v-if="data && brandMetafields">
      <div class="row px-3">
        <div class="col-12 col-md-4 position-relative">
          <div
            class="position-absolute"
            style="left: 20px; top: 10px; z-index: 10"
          >
            <img
              title="Favoriti"
              v-if="metafield.favourite"
              :src="require(`@/assets/images/selections/favourite.svg`)"
              class="selection-svg d-block mb-3"
            />
            <img
              title="Every day"
              v-if="metafield.foreveryday"
              :src="require(`@/assets/images/selections/foreveryday.svg`)"
              class="selection-svg d-block mb-3"
            />
            <img
              title="Novità"
              v-if="metafield.isnew"
              :src="require(`@/assets/images/selections/isnew.svg`)"
              class="selection-svg d-block mb-3 ml-1"
            />
            <img
              title="Novità"
              v-if="metafield.artisanal"
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
              <h1 class="font-weight-bold">{{ data.title }}</h1>

              <div class="mb-5">
                <nuxt-link
                  class="h3 font-weight-bold text-dark"
                  :to="`winery/${data.vendor}-B${brandMetafields.brandId}`"
                  >{{ data.vendor }}</nuxt-link
                >
              </div>
              <div v-html="metafield.shortDescription"></div>
            </div>
            <div class="col-12 col-md-4">
              <span style="font-size: 2.5rem; font-weight: 900">{{
                price.split(".")[0]
              }}</span
              >,<span style="font-size: 16px">{{ price.split(".")[1] }}€</span>
            </div>
            <div class="col-12 col-md-6 offset-md-2 text-center">
              <div class="d-flex align-items-end justify-content-center">
                <div>
                  <p v-if="data.totalInventory > 0" class="text-light-green">
                    Disponibilità immediata ({{ data.totalInventory }})
                  </p>
                  <p v-else class="text-light-red">Non disponibile</p>
                  <button
                    class="btn p-2 px-3 text-uppercase text-white d-inline-flex align-items-center br-10"
                    style="background: #da4865"
                    :class="data.totalInventory > 0 ? '' : 'disabled'"
                  >
                    <!-- <i class="fal fa-shopping-cart fa-2x mr-2"></i> -->
                    <img
                      :src="require(`~/assets/images/cart.svg`)"
                      class="mr-2"
                      alt=""
                    />
                    <span class="font-weight-bold">Aggiungi al carrello</span>
                  </button>
                </div>
                <button class="btn ml-2">
                  <i
                    class="text-light-red"
                    :class="
                      isInWishList
                        ? 'fas fa-heart fa-2x'
                        : 'fal fa-heart fa-2x '
                    "
                    @click="toggleWishlist"
                  ></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row mt-5">
        <div class="col-12 col-md-8 pt-5">
          <div class="pt-2">
            <b-tabs content-class="mt-4" justified>
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
                      <th style="" scope="col">ANNATA</th>

                      <th style="" scope="col">PUNTEGGIO</th>

                      <th style="border-radius: 0px 15px 0px 0px" scope="col">
                        CITAZIONE
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(award, i) in metafield.awards" :key="i">
                      <td scope="row">
                        <!-- <img
                          :src="
                            require(`@/assets/images/awards/${award.id}.svg`)
                          "
                          class="award-img pr-2"
                          width="24px"
                        /> -->

                        <strong>{{ award.title }}</strong>
                      </td>
                      <td>{{ award.year }}</td>
                      <td>
                        <strong>{{ award.value }}</strong> /
                        {{ award.maxValue }}
                      </td>
                      <td>
                        <em>
                          {{ award.quote }}
                        </em>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </b-tab>
              <b-tab :title="$t('Produttore')">
                <div v-if="brand">
                  <div v-if="brandMetafields.isPartner" class="ribbon">
                    <img
                      :src="require(`@/assets/images/selections/favourite.svg`)"
                      class="svg-favourite"
                      style="width: 20px"
                    />
                    <span class="small">Consigliato da Callmewine</span>
                  </div>
                  <h3 class="text-light-red">{{ brand.title }}</h3>
                  <div class="row">
                    <div class="col-12 col-md-8">
                      <div class="row py-3 bg-light">
                        <div class="col-6 font-weight-bold">
                          Vini Principali
                        </div>
                        <div class="col-6"></div>
                      </div>
                      <div class="row py-3">
                        <div class="col-6 font-weight-bold">
                          Anno di fondazione
                        </div>
                        <div class="col-6">{{ brandMetafields.year }}</div>
                      </div>
                      <div class="row py-3 bg-light">
                        <div class="col-6 font-weight-bold">Ettari vitati</div>
                        <div class="col-6">{{ brandMetafields.hectares }}</div>
                      </div>
                      <div class="row py-3">
                        <div class="col-6 font-weight-bold">
                          Uve di proprietà
                        </div>
                        <div class="col-6">
                          {{ brandMetafields.ownedGrapes }}
                        </div>
                      </div>
                      <div class="row py-3 bg-light">
                        <div class="col-6 font-weight-bold">
                          Produzione annua
                        </div>
                        <div class="col-6">
                          {{ brandMetafields.annualProduction }}
                        </div>
                      </div>
                      <div class="row py-3">
                        <div class="col-6 font-weight-bold">Enologo</div>
                        <div class="col-6"></div>
                      </div>
                      <div class="row py-3 bg-light">
                        <div class="col-6 font-weight-bold">Indirizzo</div>
                        <div class="col-6">{{ brandMetafields.address }}</div>
                      </div>
                    </div>
                    <div class="col-12 col-md-4">
                      <img :src="brand.image.url" alt="" />
                    </div>
                  </div>
                  <!-- <img :src="brand.image.url" alt="" />
                  <div v-html="brand.contentHtml"></div> -->
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

      <RecentProducts />

      <!-- ok -->
      <VendorProducts :vendor="brand.title" />

      <!-- ok -->
      <RecommendedProducts :product="data.id" />
    </div>
  </div>
</template>

<script>
import {
  queryProductByIdAsTag,
  productRecommendations,
} from "../utilities/productQueries";
import { getBrand } from "../utilities/brandForProduct";
import VueSlickCarousel from "vue-slick-carousel";
import "vue-slick-carousel/dist/vue-slick-carousel-theme.css";
import ProductCardVertical from "./ProductCardVertical.vue";

export default {
  props: ["product"],
  components: { ProductCardVertical, VueSlickCarousel },
  data() {
    return {
      data: null,
      price: null,
      metafield: null,
      brand: null,
      brandMetafields: null,
    };
  },
  computed: {
    isInWishList() {
      if (!this.$store.state.user.user) return null;
      let wishlist = this.$store.state.user.user.customer.wishlist;

      console.log(this.data);

      // wishlist is null by default
      if (wishlist) {
        return JSON.parse(wishlist.value).includes(
          String(
            this.data.variants.edges[0].node.id.split("ProductVariant/")[1]
          )
        );
      }

      return null;
    },
  },
  async fetch() {
    console.log(this.product, "AAAAAAAA");

    this.$store.commit("recent/addRecent", this.product);

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
    console.log(data, "D");

    this.data = data.data.products.edges[0].node;

    this.price = this.data.variants.nodes[0].price;
    this.metafield = JSON.parse(this.data.metafield1.value);

    const brandId = this.metafield.brandId;

    const dataBrand = await getBrand(domain, access_token, "B" + brandId);
    this.brand = dataBrand;

    this.brandMetafields = JSON.parse(dataBrand.details.value);
    console.log(this.metafield, "brandMetafields");
  },
  methods: {
    async toggleWishlist() {
      if (!this.$store.state.user.user) {
        this.$router.push("/login");
        return;
      }

      console.log(this.data);

      const userId =
        this.$store.state.user.user.customer.id.split("Customer/")[1];

      const variantId =
        this.data.variants.edges[0].node.id.split("ProductVariant/")[1];

      const response = await fetch(
        `https://callmewine-api.dojo.sh/api/customers/${userId}/wishlist/${variantId}`,
        { async: true, crossDomain: true, method: "POST" }
      );
      const updatedWishlist = await response.text();
      console.log(updatedWishlist);

      this.$store.commit("user/updateWishlist", updatedWishlist);

      if (this.isInWishList) {
        this.flashMessage.show({
          status: "",
          message: "Aggiunto ai preferiti!",
          time: 1000,
          blockClass: "add-product-notification",
        });
      } else {
        this.flashMessage.show({
          status: "",
          message: "Rimosso preferiti!",
          time: 1000,
          blockClass: "add-product-notification",
        });
      }
    },
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

.selection-svg {
  filter: brightness(0.7);
  width: 36px;
}
:deep(.nav-tabs .nav-link) {
  margin-bottom: -1px;
  border: none;
  color: #666;
  /* width: 200px; */
  padding-left: 0px;
  padding-right: 0px;
  font-size: 14px;
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
  /* overflow-x: scroll; */
}

@media screen and (max-width: 766px) {
  :deep(ul.nav.nav-tabs.nav-justified) {
    flex-wrap: nowrap;
    overflow-x: scroll;
  }
  :deep(.nav-tabs .nav-link) {
    width: 160px;
  }
}

.award-img {
  filter: brightness(0);
}
</style>
