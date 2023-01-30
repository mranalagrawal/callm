<script>
import { storeToRefs } from 'pinia'
import { markRaw, ref } from '@nuxtjs/composition-api'
import { mapState } from 'vuex'
import cartIcon from 'assets/svg/cart.svg'
import addIcon from 'assets/svg/add.svg'
import subtractIcon from 'assets/svg/subtract.svg'
import heartIcon from 'assets/svg/heart.svg'
import heartFullIcon from 'assets/svg/heart-full.svg'
import { getLocaleFromCurrencyCode, getPercent } from '../utilities/currency'
import { queryProductByIdAsTag } from '~/utilities/productQueries'
import { getBrand } from '~/utilities/brandForProduct'
import favouriteIcon from '~/assets/svg/selections/favourite.svg'
import forEveryDayIcon from '~/assets/svg/selections/foreveryday.svg'
import isNewIcon from '~/assets/svg/selections/isnew.svg'
import artisanalIcon from '~/assets/svg/selections/artisanal.svg'
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'
import { useCustomer } from '~/store/customer'
import { pick } from '~/utilities/arrays'

export default {
  props: ['product'],
  setup() {
    const customerStore = useCustomer()
    const { wishlistArr } = storeToRefs(customerStore)
    const { handleWishlist } = customerStore
    const features = markRaw(['favourite', 'isnew', 'inpromotion', 'foreveryday', 'togift', 'unusualvariety', 'rarewine', 'artisanal', 'organic', 'topsale'])
    const isOpen = ref(false)

    return { wishlistArr, features, isOpen, cartIcon, addIcon, subtractIcon, heartIcon, heartFullIcon, handleWishlist }
  },
  data() {
    return {
      favouriteIcon,
      forEveryDayIcon,
      isNewIcon,
      artisanalIcon,
      data: null,
      price: null,
      metaField: null,
      brand: null,
      brandMetafields: null,
      breadcrumb: null,
    }
  },
  async fetch() {
    // breadcrumb
    const elastic_url = this.$config.ELASTIC_URL
    const urls = await fetch(
      `${elastic_url}product/${this.product.substring(1)}`,
    ).then(r => r.json())

    this.breadcrumb = urls.data

    this.$store.commit('recent/addRecent', this.product)

    const domain = this.$config.DOMAIN
    const access_token = this.$config.STOREFRONT_ACCESS_TOKEN

    const productQuery = queryProductByIdAsTag(this.product)

    const GRAPHQL_BODY = {
      async: true,
      crossDomain: true,
      method: 'POST',
      headers: {
        'X-Shopify-Storefront-Access-Token': access_token,
        'Content-Type': 'application/graphql',
      },
      body: productQuery,
    }
    const data = await fetch(domain, GRAPHQL_BODY).then(res => res.json())

    /* return; */
    this.data = data.data.products.edges[0].node

    this.price = this.data.variants.nodes[0].price
    this.metaField = JSON.parse(this.data.metafield1.value)

    const brandId = this.metaField.brandId

    const dataBrand = await getBrand(domain, access_token, `B${brandId}`)
    this.brand = dataBrand

    this.brandMetafields = JSON.parse(dataBrand.details.value)
  },
  head() {
    return {
      title: `${this.title} - ${this.$config.STORE}`,
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: this.canonical,
        },
      ],
    }
  },
  computed: {
    ...mapState('userCart', {
      userCart: 'userCart',
    }),
    strippedContent() {
      if (this.metaField.shortDescription[this.$i18n.locale]) {
        return this.metaField.shortDescription[this.$i18n.locale]
          .replace('href', '')
          .replace('style', '')
      }

      return 'No description available.'
    },
    title() {
      return this.data ? this.data.title : 'CallMeWine'
    },
    canonical() {
      return this.metaField ? this.metaField.canonical : 'CallMeWine'
    },
    isOnCart() {
      return this.userCart.find(lineItem => lineItem.productVariantId === this.data.variants.nodes[0].id)
    },
    cartQuantity() {
      return this.isOnCart ? this.isOnCart.quantity : 0
    },
    isOnFavourite() {
      return this.wishlistArr.includes(this.product)
    },
    availableFeatures() {
      let features = pick(this.metaField, this.features)

      features = Object.keys(features)
        .reduce((o, key) => {
          features[key] === true && (o[key] = features[key])

          return o
        }, {})

      return Object.keys(features).slice(0, 4)
    },
    isOnSale() {
      return Number(this.data.variants.nodes[0].compareAtPriceV2.amount) > Number(this.data.variants.nodes[0].priceV2.amount) || this.availableFeatures.includes('inpromotion')
    },
  },
  methods: {
    getPercent,
    getLocaleFromCurrencyCode,
    async addToUserCart() {
      this.isOpen = true
      const productVariantId = this.data.variants.nodes[0].id
      const amount = Number(this.data.variants.nodes[0].price)
      const amountFullPrice = Number(
        this.data.variants.nodes[0].compareAtPriceV2.amount,
      )

      /* data.variants.nodes[0].compareAtPriceV2 */
      const tag = this.data.tags[0]
      const image = this.data.images.nodes[0].url
      const title = this.data.title
      this.$store.commit('userCart/addProduct', {
        productVariantId,
        singleAmount: amount,
        singleAmountFullPrice: amountFullPrice,
        tag,
        image,
        title,
      })
      this.flashMessage.show({
        status: '',
        message: `${this.data.title} è stato aggiunto al carrello!`,
        icon: this.data.images.nodes[0].url,
        iconClass: 'bg-transparent ',
        time: 8000,
        blockClass: 'add-product-notification',
      })
    },
    async removeFromUserCart() {
      const productVariantId = this.data.variants.nodes[0].id
      this.$store.commit('userCart/removeProduct', productVariantId)
    },
  },

}
</script>

<template>
  <div class="cmw-mt-4 cmw-max-w-screen-xl cmw-mx-auto <md:cmw-px-4">
    <div v-if="data && brandMetafields">
      <div v-if="breadcrumb" class="<md:cmw-hidden md:(cmw-flex cmw-items-center) cmw-my-2 cmw-font-sans cmw-text-sm">
        <NuxtLink class="cmw-text-primary-400" :to="localePath(`/catalog`)">
          {{ breadcrumb.parent_category_name }}
        </NuxtLink>
        <VueSvgIcon class="cmw-mx-1" width="12" height="12" :data="require(`@/assets/svg/chevron-right.svg`)" />
        <NuxtLink class="cmw-text-primary-400" :to="localePath(`/${breadcrumb.category_handle}-${breadcrumb.category_id}`)">
          {{ breadcrumb.category_name }}
        </NuxtLink>
        <VueSvgIcon class="cmw-mx-1" width="12" height="12" :data="require(`@/assets/svg/chevron-right.svg`)" />
        <NuxtLink
          class="cmw-text-primary-400" :to=" localePath(`/${breadcrumb.category_handle}-${breadcrumb.region_handle}-${breadcrumb.category_id}${breadcrumb.region_id}`)"
        >
          {{ breadcrumb.region_name }}
        </NuxtLink>
        <VueSvgIcon class="cmw-mx-1" width="12" height="12" :data="require(`@/assets/svg/chevron-right.svg`)" />
        <NuxtLink class="cmw-text-primary-400" :to=" localePath(`/${breadcrumb.winelist_handle}-${breadcrumb.winelist_id}`)">
          {{ breadcrumb.winelist_name }}
        </NuxtLink>
        <VueSvgIcon class="cmw-mx-1" width="12" height="12" :data="require(`@/assets/svg/chevron-right.svg`)" />
        <span class="cmw-text-body">{{ breadcrumb.name }}</span>
      </div>
      <div class="md:(cmw-grid cmw-grid-cols-[40%_60%] cmw-max-h-[550px] cmw-my-4)">
        <!-- Image Section -->
        <div class="cmw-relative">
          <img
            :src="data.images.nodes[0].url"
            class="cmw-max-h-[350px] md:cmw-max-h-[550px] cmw-mx-auto cmw-object-contain"
            :alt="data.title"
          >
          <div class="cmw-absolute cmw-top-4 cmw-left-2">
            <ProductBoxFeature v-for="feature in availableFeatures" :key="feature" :feature="feature" />
          </div>
          <div class="cmw-absolute cmw-bottom-0 cmw-left-2">
            <div
              v-for="(award) in metaField.awards.slice(0, 4)"
              :key="award.id"
              class="cmw-flex cmw-gap-1 cmw-items-center cmw-pr-1.5"
            >
              <ProductBoxAward :award="award" />
            </div>
          </div>
          <div class="cmw-absolute cmw-transform cmw-top-4 cmw-right-8">
            <CardLapel v-if="isOnSale" variant="simple" />
          </div>
        </div>
        <!-- Content Section -->
        <div class="cmw-flex cmw-flex-col">
          <h1 class="cmw-text-secondary <md:cmw-pt-8">
            {{ data.title }}
          </h1>
          <NuxtLink
            class="h3 cmw-w-max font-weight-bold cmw-text-primary-400 hover:cmw-text-primary-400"
            :to="`winery/${data.vendor}-B${brandMetafields.brandId}`"
          >
            {{ data.vendor }}
          </NuxtLink>
          <div v-html="strippedContent" />
          <div
            class="
            <md:(cmw-fixed cmw-bottom-0 cmw-left-0 cmw-w-full cmw-bg-white cmw-z-content cmw-shadow-elevation cmw-px-3 cmw-py-4)
            cmw-mt-auto cmw-flex cmw-items-end
            md:cmw-mb-8
"
          >
            <div>
              <div
                v-if="isOnSale"
                class="cmw-flex cmw-items-center cmw-gap-2"
              >
                <span class="cmw-line-through cmw-text-gray cmw-text-sm">
                  {{
                    $n(Number(data.variants.nodes[0].compareAtPriceV2.amount), 'currency', getLocaleFromCurrencyCode(data.variants.nodes[0].compareAtPriceV2.currencyCode))
                  }}
                </span>
                <CmwChip
                  color="secondary"
                  shape="rounded"
                  :label="`-${getPercent(data.variants.nodes[0].priceV2.amount, data.variants.nodes[0].compareAtPriceV2.amount)}%`"
                />
              </div>
              <i18n-n
                class="cmw-inline-block" :value="Number(data.variants.nodes[0].priceV2.amount)"
                :format="{ key: 'currency' }"
                :locale="getLocaleFromCurrencyCode(data.variants.nodes[0].priceV2.currencyCode)"
              >
                <template #currency="slotProps">
                  <span class="cmw-text-sm md:cmw-text-base">{{ slotProps.currency }}</span>
                </template>
                <template #integer="slotProps">
                  <span class="cmw-h1 cmw-font-bold !cmw-leading-none">{{ slotProps.integer }}</span>
                </template>
                <template #group="slotProps">
                  <span class="cmw-h1 cmw-font-bold !cmw-leading-none">{{ slotProps.group }}</span>
                </template>
                <template #fraction="slotProps">
                  <span class="cmw-text-sm md:cmw-text-base">{{ slotProps.fraction }}</span>
                </template>
              </i18n-n>
            </div>
            <div class="cmw-ml-auto cmw-mr-4">
              <div class="">
                <p
                  v-if="data.totalInventory > 0" class="cmw-text-success cmw-text-center"
                  :class="{ 'cmw-hidden': data.totalInventory > 6 }"
                >
                  {{ $t("product.available", { quantity: data.totalInventory }) }}
                </p>
                <p v-else class="text-light-secondary">
                  {{ $t("product.notAvailable") }}
                </p>
                <div v-if="data.availableForSale" class="cmw-relative">
                  <Button
                    class="cmw-gap-2 cmw-pl-2 cmw-pr-3 cmw-py-2"
                    @click.native="addToUserCart"
                  >
                    <VueSvgIcon :data="cartIcon" color="white" width="30" height="auto" />
                    <span class="cmw-text-sm" v-text="$t('product.addToCart')" />
                  </Button>
                  <Badge
                    v-show="cartQuantity && !isOpen"
                    class="cmw-absolute cmw-top-0 cmw-left-full cmw-transform cmw-translate-x-[-50%] cmw-translate-y-[-50%]"
                    bg-color="primary-400" :qty="cartQuantity"
                  />
                  <div
                    v-show="isOpen"
                    class="cmw-absolute cmw-grid cmw-grid-cols-[50px_auto_50px] cmw-items-center cmw-w-full cmw-h-[50px] cmw-top-0 cmw-left-0"
                    @mouseleave="isOpen = false"
                  >
                    <button
                      class="cmw-flex cmw-transition-colors cmw-w-[50px] cmw-h-[50px] cmw-bg-primary-400 cmw-rounded-l hover:(cmw-bg-primary)"
                      @click="removeFromUserCart"
                    >
                      <VueSvgIcon class="cmw-m-auto" :data="subtractIcon" width="14" height="14" color="white" />
                    </button>
                    <div class="cmw-flex cmw-h-[40px] cmw-bg-primary-400 cmw-text-white text-center">
                      <span class="cmw-m-auto cmw-text-sm">{{ cartQuantity }}</span>
                    </div>
                    <button
                      class="cmw-flex cmw-transition-colors cmw-w-[50px] cmw-h-[50px] cmw-bg-primary-400 cmw-rounded-r hover:(cmw-bg-primary)"
                      @click="addToUserCart"
                    >
                      <VueSvgIcon class="cmw-m-auto" :data="addIcon" width="14" height="14" color="white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <button
              type="button"
              class="cmw-mb-2"
              @click="handleWishlist({ id: product, isOnFavourite })"
            >
              <VueSvgIcon
                color="#d94965"
                width="32"
                height="32"
                :data="isOnFavourite ? heartFullIcon : heartIcon"
              />
            </button>
          </div>
        </div>
      </div>

      <!-- tt -->
      <div class="row mt-5">
        <div class="col-12 col-md-8 pt-5">
          <div class="pt-2">
            <b-tabs content-class="mt-4" justified>
              <b-tab
                v-if="data.descriptionHtml != ''"
                :title="$t('product.description')"
              >
                <div v-html="data.descriptionHtml" />
              </b-tab>
              <b-tab :title="$t('product.toEnjoyBetter')">
                <div>
                  <h3 class="mb-5">
                    {{ $t("product.toEnjoyBetter") }}
                  </h3>

                  <div class="mb-5">
                    <h4 class="font-weight-bold">
                      {{ $t("product.temperature") }}
                    </h4>
                    <p>{{ metaField.servingTemperature }}</p>
                  </div>

                  <div class="mb-5">
                    <h4 class="font-weight-bold">
                      {{ $t("product.whenDrink") }}
                    </h4>
                    <p>{{ metaField.drinkNotesDrinkingTitle[$i18n.locale] }}</p>
                    <p>
                      {{ metaField.drinkNotesServingDescription[$i18n.locale] }}
                    </p>
                    <p>
                      {{ metaField.drinkNotesDrinkingLongevity[$i18n.locale] }}
                    </p>
                  </div>

                  <div class="mb-5">
                    <h4 class="font-weight-bold">
                      {{ metaField.glassTitle[$i18n.locale] }}
                    </h4>
                    <p>{{ metaField.glassDescription[$i18n.locale] }}</p>
                  </div>
                </div>
              </b-tab>
              <b-tab
                v-if="$config.STORE != 'WILDVIGNERON'"
                :title="$t('product.awardsAndAcknowledgments')"
              >
                <table
                  v-if="metaField.awards.length > 0"
                  class="table table-striped"
                >
                  <thead>
                    <tr class="bg-dark-primary text-white">
                      <th style="border-radius: 15px 0px 0px 0px" scope="col">
                        {{ $t("product.guide") }}
                      </th>
                      <th style="" scope="col">
                        {{ $t("product.year") }}
                      </th>

                      <th style="" scope="col">
                        {{ $t("product.score") }}
                      </th>

                      <th style="border-radius: 0px 15px 0px 0px" scope="col">
                        {{ $t("product.quote") }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(award, i) in metaField.awards" :key="i">
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
                  <div v-if="brandMetafields.isPartner" class="ribbon cmw-flex cmw-items-center">
                    <!-- TODO: This will use the new lapel component -->
                    <VueSvgIcon
                      :data="favouriteIcon"
                      class="svg-favourite"
                      width="20" height="auto"
                    />
                    <span class="small !cmw-top-0">{{
                      $t("product.recommendedByCallmewine")
                    }}</span>
                  </div>
                  <h3 class="text-light-secondary">
                    {{ brand.title }}
                  </h3>
                  <div class="row">
                    <div class="col-12 col-md-8">
                      <div class="row py-3 bg-light">
                        <div class="col-6 font-weight-bold">
                          {{ $t("product.mainWines") }}
                        </div>
                        <div class="col-6" />
                      </div>
                      <div class="row py-3">
                        <div class="col-6 font-weight-bold">
                          {{ $t("product.foundation") }}
                        </div>
                        <div class="col-6">
                          {{ brandMetafields.year }}
                        </div>
                      </div>
                      <div class="row py-3 bg-light">
                        <div class="col-6 font-weight-bold">
                          {{ $t("product.vineyardHectares") }}
                        </div>
                        <div class="col-6">
                          {{ brandMetafields.hectares }}
                        </div>
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
                        <div class="col-6" />
                      </div>
                      <div class="row py-3 bg-light">
                        <div class="col-6 font-weight-bold">
                          {{ $t("product.address") }}
                        </div>
                        <div class="col-6">
                          {{ brandMetafields.address }}
                        </div>
                      </div>
                    </div>
                    <div class="col-12 col-md-4">
                      <img :src="brand.image.url" alt="">
                    </div>
                  </div>
                  <!-- <img :src="brand.image.url" alt="" />
                  <div v-html="brand.contentHtml"></div> -->
                </div>
              </b-tab>
              <b-tab :title="$t('product.pairings')">
                <!-- {{ metaField.foodPairings }} -->
                <h3 class="mb-5">
                  {{ $t("product.pairings") }}
                </h3>

                <div class="row">
                  <div
                    v-for="pairing in metaField.foodPairings"
                    :key="pairing.id"
                    class="col-6 col-md-4 col-lg-3"
                  >
                    <img
                      :src="pairing.image"
                      class="img-fluid"
                      style="border-radius: 10px"
                    >
                    <p>{{ pairing.name[$i18n.locale] }}</p>
                  </div>
                </div>
              </b-tab>
            </b-tabs>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <div style="width: 80%" class="bg-light p-3 mx-auto cmw-rounded">
            <h3 class="mb-5">
              {{ $t("product.features") }}
            </h3>

            <div v-if="metaField.denomination[$i18n.locale]">
              <p class="font-weight-bold mb-0">
                {{ $t("product.denomination") }}
              </p>
              <p class="mb-4">
                {{ metaField.denomination[$i18n.locale] }}
              </p>
              <hr>
            </div>
            <div v-if="metaField.grapes[$i18n.locale]">
              <p class="font-weight-bold mb-0">
                {{ $t("product.vines") }}
              </p>
              <p class="mb-4">
                {{ metaField.grapes[$i18n.locale] }}
              </p>
              <hr>
            </div>

            <div
              v-if="
                metaField.countryName[$i18n.locale]
                  || metaField.countryRegionName
              "
            >
              <p class="font-weight-bold mb-0">
                {{ $t("product.region") }}
              </p>
              <p class="mb-4">
                {{ metaField.countryRegionName }}
                {{ metaField.countryName[$i18n.locale] }}
              </p>
              <hr>
            </div>
            <div v-if="metaField.alcoholContent">
              <p class="font-weight-bold mb-0">
                {{ $t("product.alcoholContent") }}
              </p>
              <p class="mb-4">
                {{ metaField.alcoholContent }}%
              </p>
              <hr>
            </div>
            <div v-if="metaField.size[$i18n.locale]">
              <p class="font-weight-bold mb-0">
                {{ $t("product.format") }}
              </p>
              <p class="mb-4">
                {{ metaField.size[$i18n.locale] }}
              </p>
              <hr>
            </div>
            <div v-if="metaField.winemaking[$i18n.locale]">
              <p class="font-weight-bold mb-0">
                {{ $t("product.vinification") }}
              </p>
              <p class="mb-4">
                {{ metaField.winemaking[$i18n.locale] }}
              </p>
              <hr>
            </div>
            <div v-if="metaField.agingDescription[$i18n.locale]">
              <p class="font-weight-bold mb-0">
                {{ $t("product.refinement") }}
              </p>
              <p class="mb-4">
                {{ metaField.agingDescription[$i18n.locale] }}
              </p>
              <hr>
            </div>
            <div v-if="metaField.productInformations[$i18n.locale]">
              <p class="font-weight-bold mb-0">
                {{ $t("product.additionalNotes") }}
              </p>
              <p class="mb-4">
                {{ metaField.productInformations[$i18n.locale] }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!--      <RecentProducts />

      <VendorProducts :vendor="brand.title" />

      <RecommendedProducts :product="data.id" /> -->
    </div>
  </div>
</template>

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

:deep(.nav-link:hover) {
  color: var(--dark-secondary);
  border-bottom: 4px solid var(--dark-secondary);
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
