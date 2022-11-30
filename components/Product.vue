<template>
  <div class="mt-5">
    <div class="container-fluid px-md-5" v-if="data && brandMetafields">
      <div class="row mb-3" v-if="breadcrumb">
        <div class="col-12">
          <nuxt-link
            class="text-light-secondary"
            :to="localePath(`/catalog`)"
            >{{ breadcrumb.parent_category_name }}</nuxt-link
          >
          <i class="fal fa-chevron-right small px-1"></i>
          <nuxt-link
            class="text-light-secondary"
            :to="
              localePath(
                `/${breadcrumb.category_handle}-${breadcrumb.category_id}`
              )
            "
            >{{ breadcrumb.category_name }}</nuxt-link
          >
          <i class="fal fa-chevron-right small px-1"></i>
          <nuxt-link
            class="text-light-secondary"
            :to="
              localePath(
                `/${breadcrumb.category_handle}-${breadcrumb.region_handle}-${breadcrumb.category_id}${breadcrumb.region_id}`
              )
            "
            >{{ breadcrumb.region_name }}</nuxt-link
          >
          <i class="fal fa-chevron-right small px-1"></i>
          <nuxt-link
            class="text-light-secondary"
            :to="
              localePath(
                `/${breadcrumb.winelist_handle}-${breadcrumb.winelist_id}`
              )
            "
            >{{ breadcrumb.winelist_name }}</nuxt-link
          >
          <i class="fal fa-chevron-right small px-1"></i>
          <span class="text-dark">{{ breadcrumb.name }}</span>
        </div>
      </div>
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
              <div v-html="strippedContent"></div>
              <!-- <div>
                {{ metafield.shortDescription }}
              </div> -->
            </div>
            <div class="col-12 col-md-4">
              <span style="font-size: 2.5rem; font-weight: 900">{{
                price.split(".")[0]
              }}</span
              >,<span style="font-size: 16px"
                >{{ price.split(".")[1] }}
                <!-- {{ data.variants.nodes[0].compareAtPriceV2.currencyCode }} -->
              </span>
            </div>
            <div class="col-12 col-md-6 offset-md-2 text-center">
              <div class="d-flex align-items-end justify-content-center">
                <div>
                  <p v-if="data.totalInventory > 0" class="text-light-primary">
                    {{ $t("product.available") }} ({{ data.totalInventory }})
                  </p>
                  <p v-else class="text-light-secondary">
                    {{ $t("product.notAvailable") }}
                  </p>
                  <button
                    class="btn p-2 px-3 bg-light-secondary text-uppercase text-white d-inline-flex align-items-center br-10"
                    :class="data.totalInventory > 0 ? '' : 'disabled'"
                    @click="addToUserCart()"
                  >
                    <!-- <i class="fal fa-shopping-cart fa-2x mr-2"></i> -->
                    <img
                      :src="require(`~/assets/images/cart.svg`)"
                      class="mr-2"
                      alt=""
                    />
                    <span class="font-weight-bold">{{
                      $t("product.addToCart")
                    }}</span>
                  </button>
                </div>
                <button class="btn ml-2">
                  <i
                    class="text-light-secondary"
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
              <b-tab :title="$t('product.description')">
                <div v-html="data.descriptionHtml"></div>
              </b-tab>
              <b-tab :title="$t('product.toEnjoyBetter')">
                <div>
                  <h3 class="mb-5">{{ $t("product.toEnjoyBetter") }}</h3>

                  <div class="mb-5">
                    <h4 class="font-weight-bold">
                      {{ $t("product.temperature") }}
                    </h4>
                    <p>{{ metafield.servingTemperature }}</p>
                  </div>

                  <div class="mb-5">
                    <h4 class="font-weight-bold">
                      {{ $t("product.whenDrink") }}
                    </h4>
                    <p>{{ metafield.drinkNotesDrinkingTitle[$i18n.locale] }}</p>
                    <p>
                      {{ metafield.drinkNotesServingDescription[$i18n.locale] }}
                    </p>
                    <p>
                      {{ metafield.drinkNotesDrinkingLongevity[$i18n.locale] }}
                    </p>
                  </div>

                  <div class="mb-5">
                    <h4 class="font-weight-bold">
                      {{ metafield.glassTitle[$i18n.locale] }}
                    </h4>
                    <p>{{ metafield.glassDescription[$i18n.locale] }}</p>
                  </div>
                </div>
              </b-tab>
              <b-tab
                v-if="$config['STORE'] != 'WILDVIGNERON'"
                :title="$t('product.awardsAndAcknowledgments')"
              >
                <table
                  class="table table-striped"
                  v-if="metafield.awards.length > 0"
                >
                  <thead>
                    <tr class="bg-dark-primary text-white">
                      <th style="border-radius: 15px 0px 0px 0px" scope="col">
                        {{ $t("product.guide") }}
                      </th>
                      <th style="" scope="col">{{ $t("product.year") }}</th>

                      <th style="" scope="col">{{ $t("product.score") }}</th>

                      <th style="border-radius: 0px 15px 0px 0px" scope="col">
                        {{ $t("product.quote") }}
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
                          {{ award.quote[$i18n.locale] }}
                        </em>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </b-tab>
              <b-tab :title="$t('product.producer')">
                <div v-if="brand">
                  <div v-if="brandMetafields.isPartner" class="ribbon">
                    <img
                      :src="require(`@/assets/images/selections/favourite.svg`)"
                      class="svg-favourite"
                      style="width: 20px"
                    />
                    <span class="small">{{
                      $t("product.recommendedByCallmewine")
                    }}</span>
                  </div>
                  <h3 class="text-light-secondary">{{ brand.title }}</h3>
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
                        <div class="col-6">{{ brandMetafields.year }}</div>
                      </div>
                      <div class="row py-3 bg-light">
                        <div class="col-6 font-weight-bold">
                          {{ $t("product.vineyardHectares") }}
                        </div>
                        <div class="col-6">{{ brandMetafields.hectares }}</div>
                      </div>
                      <div class="row py-3">
                        <div class="col-6 font-weight-bold">
                          {{ $t("product.ownGrapes") }}
                        </div>
                        <div class="col-6">
                          {{ brandMetafields.ownedGrapes }} %
                        </div>
                      </div>
                      <div class="row py-3 bg-light">
                        <div class="col-6 font-weight-bold">
                          {{ $t("product.annualProduction") }}
                        </div>
                        <div class="col-6">
                          {{ brandMetafields.annualProduction }}
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
              <b-tab :title="$t('product.pairings')">
                <!-- {{ metafield.foodPairings }} -->
                <h3 class="mb-5">{{ $t("product.pairings") }}</h3>

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
                    <p>{{ pairing.name[$i18n.locale] }}</p>
                  </div>
                </div>
              </b-tab>
            </b-tabs>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <div style="width: 80%" class="bg-light p-3 mx-auto">
            <h3 class="mb-5">{{ $t("product.features") }}</h3>

            <div v-if="metafield.denomination[$i18n.locale]">
              <p class="font-weight-bold mb-0">
                {{ $t("product.denomination") }}
              </p>
              <p class="mb-4">{{ metafield.denomination[$i18n.locale] }}</p>
              <hr />
            </div>
            <div v-if="metafield.grapes[$i18n.locale]">
              <p class="font-weight-bold mb-0">
                {{ $t("product.vines") }}
              </p>
              <p class="mb-4">{{ metafield.grapes[$i18n.locale] }}</p>
              <hr />
            </div>

            <div
              v-if="
                metafield.countryName[$i18n.locale] ||
                metafield.countryRegionName
              "
            >
              <p class="font-weight-bold mb-0">{{ $t("product.region") }}</p>
              <p class="mb-4">
                {{ metafield.countryRegionName }}
                {{ metafield.countryName[$i18n.locale] }}
              </p>
              <hr />
            </div>
            <div v-if="metafield.alcoholContent">
              <p class="font-weight-bold mb-0">
                {{ $t("product.alcoholContent") }}
              </p>
              <p class="mb-4">{{ metafield.alcoholContent }}%</p>
              <hr />
            </div>
            <div v-if="metafield.size[$i18n.locale]">
              <p class="font-weight-bold mb-0">
                {{ $t("product.format") }}
              </p>
              <p class="mb-4">{{ metafield.size[$i18n.locale] }}</p>
              <hr />
            </div>
            <div v-if="metafield.winemaking[$i18n.locale]">
              <p class="font-weight-bold mb-0">
                {{ $t("product.vinification") }}
              </p>
              <p class="mb-4">
                {{ metafield.winemaking[$i18n.locale] }}
              </p>
              <hr />
            </div>
            <div v-if="metafield.agingDescription[$i18n.locale]">
              <p class="font-weight-bold mb-0">
                {{ $t("product.refinement") }}
              </p>
              <p class="mb-4">
                {{ metafield.agingDescription[$i18n.locale] }}
              </p>
              <hr />
            </div>
            <div v-if="metafield.productInformations[$i18n.locale]">
              <p class="font-weight-bold mb-0">
                {{ $t("product.additionalNotes") }}
              </p>
              <p class="mb-4">
                {{ metafield.productInformations[$i18n.locale] }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!--     <RecentProducts />

      <VendorProducts :vendor="brand.title" />

      <RecommendedProducts :product="data.id" /> -->
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
  head() {
    return {
      title: this.title + " - " + this.$config.STORE,
      link: [
        {
          hid: "canonical",
          rel: "canonical",
          href: this.canonical,
        },
      ],
    };
  },
  data() {
    return {
      data: null,
      price: null,
      metafield: null,
      brand: null,
      brandMetafields: null,
      breadcrumb: null,
    };
  },
  computed: {
    strippedContent() {
      console.log(this.metafield.shortDescription);
      if (this.metafield.shortDescription[this.$i18n.locale]) {
        return this.metafield.shortDescription[this.$i18n.locale]
          .replace("href", "")
          .replace("style", "");
      }

      return "No description available.";
    },
    title() {
      return this.data ? this.data.title : "CallMeWine";
    },
    canonical() {
      return this.metafield ? this.metafield.canonical : "CallMeWine";
    },
    isInWishList() {
      if (!this.$store.state.user.user) return null;
      let wishlist = this.$store.state.user.user.customer.wishlist;

      if (wishlist) {
        return JSON.parse(wishlist.value).includes(this.data.tags[0]);
      }

      return null;
    },
  },
  async fetch() {
    // breadcrumb
    const elastic_url = this.$config.ELASTIC_URL;
    const urls = await fetch(
      elastic_url + `product/${this.product.substring(1)}`
    ).then((r) => r.json());

    this.breadcrumb = urls.data;

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

    /* return; */
    this.data = data.data.products.edges[0].node;
    console.clear();
    console.log(this.data);

    this.price = this.data.variants.nodes[0].price;
    this.metafield = JSON.parse(this.data.metafield1.value);

    const brandId = this.metafield.brandId;

    const dataBrand = await getBrand(domain, access_token, "B" + brandId);
    this.brand = dataBrand;
    console.log(this.metafield, "meta");
    this.brandMetafields = JSON.parse(dataBrand.details.value);
    console.log(this.metafield, "met");
  },
  methods: {
    async addToUserCart() {
      const productVariantId = this.data.variants.nodes[0].id;
      const amount = Number(this.data.variants.nodes[0].price);
      const amountFullPrice = Number(
        this.data.variants.nodes[0].compareAtPrice
      );
      const tag = this.data.tags[0];
      const image = this.data.images.nodes[0].url;
      const title = this.data.title;
      this.$store.commit("userCart/addProduct", {
        productVariantId: productVariantId,
        singleAmount: amount,
        singleAmountFullPrice: amountFullPrice,
        tag: tag,
        image: image,
        title: title,
      });
      this.flashMessage.show({
        status: "",
        message: `${this.data.title} è stato aggiunto al carrello!`,
        icon: this.data.images.nodes[0].url,
        iconClass: "bg-transparent ",
        time: 8000,
        blockClass: "add-product-notification",
      });
    },
    async toggleWishlist() {
      if (!this.$store.state.user.user) {
        this.$router.push("/login");
        return;
      }

      const userId =
        this.$store.state.user.user.customer.id.split("Customer/")[1];

      const variantId =
        this.data.variants.edges[0].node.id.split("ProductVariant/")[1];

      const elastic_url = this.$config.ELASTIC_URL;
      const STORE = this.$config.STORE;
      const response = await fetch(
        elastic_url +
          `customers/${STORE}/${userId}/wishlist/${this.data.tags[0]}`,
        { async: true, crossDomain: true, method: "POST" }
      );
      const updatedWishlist = await response.text();

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
  /* async fetch() {
    console.log("ok");
    const domain = this.$config.DOMAIN;
    const access_token = this.$config.STOREFRONT_ACCESS_TOKEN;

    const countriesQuery = `query {
      localization {
        availableCountries {
          name
          isoCode
        }
      }
    }`;

    const GRAPHQL_BODY = {
      async: true,
      crossDomain: true,
      method: "POST",
      headers: {
        "X-Shopify-Storefront-Access-Token": access_token,
        "Content-Type": "application/graphql",
      },
      body: countriesQuery,
    };
    const data = await fetch(domain, GRAPHQL_BODY).then((res) => res.json());
    console.log(data.data.localization, "countries");
  }, */
};
</script>

<style scoped>
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
  color: var(--dark-secondary);
  /* font-weight: bold; */
  background-color: #fff;
  border-bottom: 4px solid var(--dark-secondary);
}
:deep(ul.nav.nav-tabs.nav-justified) {
  flex-wrap: nowrap;
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
