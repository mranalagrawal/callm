<script>
import { computed, ref, useContext, useFetch, useRoute } from '@nuxtjs/composition-api'
import addIcon from 'assets/svg/add.svg'
import cartIcon from 'assets/svg/cart.svg'
import heartFullIcon from 'assets/svg/heart-full.svg'
import heartIcon from 'assets/svg/heart.svg'
import subtractIcon from 'assets/svg/subtract.svg'
import { storeToRefs } from 'pinia'
import { mapState } from 'vuex'
import { SweetAlertToast } from '@/utilities/Swal'
import { productFeatures } from '@/utilities/mappedProduct'
import { getLocaleFromCurrencyCode, getPercent } from '@/utilities/currency'
import { pick } from '@/utilities/arrays'
import { useRecentProductsStore } from '@/store/recent'
import { useCustomer } from '@/store/customer'
import favouriteIcon from '~/assets/svg/selections/favourite.svg'
import getArticles from '~/graphql/queries/getArticles'

export default {
  layout(context) {
    return context.$config.STORE
  },
  setup() {
    const { $sentry } = useContext()
    const customerStore = useCustomer()
    const recentProductsStore = useRecentProductsStore()
    const { recentProducts } = storeToRefs(recentProductsStore)

    const {
      wishlistArr,
      getCustomerType,
    } = storeToRefs(customerStore)
    const { handleWishlist } = customerStore
    const { $http, $config, i18n, $graphql, $cmwRepo, error, redirect } = useContext()
    const route = useRoute()
    const isOpen = ref(false)
    const product = ref({
      details: '',
      handle: '',
      variants: { nodes: [] },
    })
    const productVariant = ref()
    const productDetails = ref({
      brandId: '',
      canonical: '',
      feId: '',
      shortDescription: '',
      awards: [],
      priceLists: {},
    })
    const breadcrumb = ref({
      parent_category_name: '',
      category_name: '',
      region_name: '',
      category_handle: '',
      region_handle: '',
      region_id: '',
      category_id: '',
      winelist_name: '',
      winelist_handle: '',
      winelist_id: '',
    })
    const brandMetaFields = ref({
      key: '',
      subtitle: '',
      images: [],
      hrefLang: {},
      isPartner: false,
    })

    const brand = ref({
      title: '',
      contentHtml: '',
      seo: {
        description: '',
        title: '',
      },
      image: {
        url: '',
      },
    })

    useFetch(async () => {
      const { data } = await $http.$get(`${$config.ELASTIC_URL}product/${route.value.params.id}?lang=${i18n.locale}`, {
        method: 'POST',
      })
      breadcrumb.value = data

      await $cmwRepo.products.getAll({
        first: 1,
        query: `tag:P${route.value.params.id}`,
      })
        .then(async ({ products = { edges: [] } }) => {
          if (!!products.edges.length && products.edges[0].node.handle) {
            product.value = products.edges[0].node
            productVariant.value = products.edges[0].node.variants.edges[0].node
            productDetails.value = JSON.parse(products.edges[0].node.details.value)

            if (route.value.params.pathMatch !== product.value.handle)
              return redirect(301, `/${product.value.handle}-${productDetails.value.key}.htm`)

            // if (!productDetails.value.pricelists[$config.SALECHANNEL])
            //   return redirect(301, 'urlFromBackend')

            // if (!productDetails.value.enabled)
            //   return redirect(301, productDetails.value.canonicalProductId ||
            //   `/winery/${product.value.vendor.replace(' ', '-').toLowerCase()}-B-${productDetails.value.brandId}.htm`)

            recentProductsStore.$patch({
              recentProducts: recentProducts.value?.length > 11
                ? [...new Set([...recentProducts.value, productDetails.value.key])].slice(-12)
                : [...new Set([...recentProducts.value, productDetails.value.key])],
            })

            const { articles } = await $graphql.default.request(getArticles, {
              lang: i18n.locale.toUpperCase(),
              first: 1,
              query: `tag:B${productDetails.value.brandId}`, // route.value.params.handle,
            })

            if (articles.nodes[0]) {
              brand.value = articles.nodes[0]
              brandMetaFields.value = articles.nodes[0].details && JSON.parse(articles.nodes[0].details.value)
            }
          } else {
            return error({ statusCode: 404, message: 'No results' })
          }
        }).catch((err) => {
          $sentry.captureException(new Error(`Something went wrong ${err}`))
        })
    })

    const availableFeatures = computed(() => {
      let features = pick(productDetails.value, productFeatures)

      features = Object.keys(features)
        .reduce((o, key) => {
          if (typeof features[key] === 'object')
            !!features[key][$config.SALECHANNEL] && (o[key] = features[key])
          else
            features[key] === true && (o[key] = features[key])

          return o
        }, {})

      return Object.keys(features).slice(0, 4)
    })

    const isOnSale = computed(() => {
      if (!productVariant.value)
        return false

      return availableFeatures.value.includes('isInPromotion')
    })

    const strippedContent = computed(() => {
      if (productDetails.value.shortDescription[i18n.locale]) {
        return productDetails.value.shortDescription[i18n.locale]
          .replace('href', '')
          .replace('style', '')
      }

      return 'No description available.'
    })

    const finalPrice = computed(() => {
      if (!productDetails.value.feId)
        return false
      return productDetails.value.priceLists[$config.SALECHANNEL][getCustomerType.value]
    })

    const isOnFavourite = computed(() => {
      return [...wishlistArr.value].includes(`P${productDetails.value.feId}`)
    })

    const generateMetaLink = (arr = []) => {
      const hrefLangArr = !!arr.length && arr.map(el => ({
        hid: `alternate-${el[0]}`,
        rel: 'alternate',
        href: el[1],
        hreflang: el[0],
      }))

      return [
        ...hrefLangArr,
        {
          rel: 'canonical',
          href: productDetails.value.canonical,
        },
      ]
    }

    return {
      product,
      productVariant,
      productDetails,
      availableFeatures,
      isOnSale,
      isOnFavourite,
      finalPrice,
      strippedContent,
      breadcrumb,
      wishlistArr,
      brandMetaFields,
      brand,
      getCustomerType,
      isOpen,
      cartIcon,
      addIcon,
      subtractIcon,
      heartIcon,
      heartFullIcon,
      favouriteIcon,
      handleWishlist,
      generateMetaLink,
    }
  },
  head() {
    return {
      title: this.product?.seo?.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.product?.seo?.description,
        },
      ],
      link: this.productDetails
        && this.productDetails.hrefLang
        && Object.keys(this.productDetails.hrefLang).length
        && this.generateMetaLink(Object.entries(this.productDetails.hrefLang)),
    }
  },
  computed: {
    ...mapState('userCart', {
      userCart: 'userCart',
    }),
    isOnCart() {
      return this.userCart.find(lineItem => lineItem.productVariantId === this.productVariant.id)
    },
    cartQuantity() {
      return this.isOnCart ? this.isOnCart.quantity : 0
    },
    canAddMore() {
      return this.product.totalInventory - this.cartQuantity > 0
    },
  },
  methods: {
    getPercent,
    getLocaleFromCurrencyCode,
    async addToUserCart() {
      this.isOpen = true

      if (!this.canAddMore) {
        await SweetAlertToast.fire({
          icon: 'warning',
          text: this.$i18n.t('common.feedback.KO.addToCartReachLimit'),
        })
        return
      }

      const totalInventory = this.product.totalInventory
      const productVariantId = this.productVariant.id
      const amount = this.finalPrice
      const amountFullPrice = Number(
        this.productVariant.compareAtPriceV2.amount,
      )

      /* data.variants.nodes[0].compareAtPriceV2 */
      const tag = this.product.tags[0]
      const image = this.product.images.nodes[0].url
      const title = this.product.title
      this.$store.commit('userCart/addProduct', {
        productVariantId,
        singleAmount: amount,
        singleAmountFullPrice: amountFullPrice,
        tag,
        image,
        title,
        totalInventory,
      })
      this.flashMessage.show({
        status: '',
        message: `${this.product.title} è stato aggiunto al carrello!`,
        icon: this.product.images.nodes[0].url,
        iconClass: 'bg-transparent ',
        time: 8000,
        blockClass: 'add-product-notification',
      })
    },
    async removeFromUserCart() {
      this.$store.commit('userCart/removeProduct', this.productVariant.id)
    },
  },
}
</script>

<template>
  <div class="cmw-mt-4 cmw-max-w-screen-xl cmw-mx-auto <md:cmw-px-4">
    <div v-if="$fetchState.error" class="cmw-relative cmw-text-center cmw-mt-12">
      <div class="md:(cmw-grid cmw-grid-cols-2 cmw-items-center)">
        <img
          class="cmw-w-3/4 cmw-mx-auto" :src="require('assets/images/wine-stain.png')"
          alt="empty-bottles"
        >
        <div class="cmw-text-left">
          <h2 class="cmw-h1 cmw-text-secondary" v-text="$t('notFoundTitle')" />
          <p class="cmw-mb-8 md:cmw-w-3/5" v-text="$t('notFoundLine')" />
        </div>
      </div>
    </div>
    <template v-else>
      <div v-if="product.title && brandMetaFields">
        <div v-if="breadcrumb" class="<md:cmw-hidden md:(cmw-flex cmw-items-center) cmw-my-2 cmw-font-sans cmw-text-sm">
          <NuxtLink class="cmw-text-primary-400" :to="localePath(`/catalog`)" rel="nofollow">
            {{ breadcrumb.parent_category_name }}
          </NuxtLink>
          <VueSvgIcon class="cmw-mx-1" width="12" height="12" :data="require(`@/assets/svg/chevron-right.svg`)" />
          <NuxtLink
            class="cmw-text-primary-400"
            :to="localePath(`/${breadcrumb.category_handle}-${breadcrumb.category_id}.htm`)" rel="nofollow"
          >
            {{ breadcrumb.category_name }}
          </NuxtLink>
          <VueSvgIcon class="cmw-mx-1" width="12" height="12" :data="require(`@/assets/svg/chevron-right.svg`)" />
          <NuxtLink
            class="cmw-text-primary-400"
            :to=" localePath(`/${breadcrumb.category_handle}-${breadcrumb.region_handle}-${breadcrumb.category_id}${breadcrumb.region_id}.htm`)"
            rel="nofollow"
          >
            {{ breadcrumb.region_name }}
          </NuxtLink>
          <VueSvgIcon class="cmw-mx-1" width="12" height="12" :data="require(`@/assets/svg/chevron-right.svg`)" />
          <NuxtLink
            class="cmw-text-primary-400"
            :to=" localePath(`/${breadcrumb.winelist_handle}-${breadcrumb.winelist_id}.htm`)"
            rel="nofollow"
          >
            {{ breadcrumb.winelist_name }}
          </NuxtLink>
          <VueSvgIcon class="cmw-mx-1" width="12" height="12" :data="require(`@/assets/svg/chevron-right.svg`)" />
          <span class="cmw-text-body">{{ breadcrumb.name }}</span>
        </div>
        <div class="md:(cmw-grid cmw-grid-cols-[40%_60%] cmw-max-h-[550px] cmw-my-4)">
          <!-- Image Section -->
          <div class="cmw-relative">
            <LoadingImage
              class="cmw-h-full"
              img-classes="cmw-max-h-[350px] md:cmw-max-h-[550px] cmw-mx-auto cmw-object-contain"
              :thumbnail="{
                url: product.images.nodes[0] ? `${product.images.nodes[0].url}?&width=20&height=36`
                  : 'https://cdn.shopify.com/s/files/1/0578/7497/2719/files/no-product-image-400x400_6.png?v=1680253923&width=20&height=36',
                width: 20,
                height: 36,
                altText: product.title,
              }"
              :source="{
                url: product.images.nodes[0] ? `${product.images.nodes[0].url}?&width=400&height=719&crop=center`
                  : 'https://cdn.shopify.com/s/files/1/0578/7497/2719/files/no-product-image-400x400_6.png?v=1680253923&width=400&height=719&crop=center',
                width: 400,
                height: 719,
                altText: product.title,
              }"
            />
            <div class="cmw-absolute cmw-top-4 cmw-left-2">
              <ProductBoxFeature v-for="feature in availableFeatures" :key="feature" :feature="feature" />
            </div>
            <div class="cmw-absolute cmw-bottom-0 cmw-left-2">
              <div
                v-for="(award, i) in productDetails.awards.slice(0, 4)"
                :key="`${award.id}-${i}`"
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
            <h1 class="cmw-text-secondary <md:cmw-pt-8" v-text="product.title" />
            <NuxtLink
              class="h3 cmw-w-max font-weight-bold cmw-text-primary-400 hover:cmw-text-primary-400"
              :to="localePath({ name: 'winery-handle', params: { handle: `${brand.handle}-${brandMetaFields.key}.htm` } })"
            >
              {{ product.vendor }}
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
                      $n(Number(productVariant.compareAtPriceV2.amount),
                         'currency',
                         getLocaleFromCurrencyCode(productVariant.compareAtPriceV2.currencyCode))
                    }}
                  </span>
                  <CmwChip
                    color="secondary"
                    shape="rounded"
                    :label="`-${getPercent(finalPrice, productVariant.compareAtPriceV2.amount)}%`"
                  />
                </div>
                <i18n-n
                  class="cmw-inline-block" :value="Number(finalPrice)"
                  :format="{ key: 'currency' }"
                  :locale="getLocaleFromCurrencyCode(productVariant.priceV2.currencyCode)"
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
                    v-if="product.totalInventory > 0" class="cmw-text-success cmw-text-center"
                    :class="{ 'cmw-hidden': product.totalInventory > 6 }"
                  >
                    {{ $t('product.available', { quantity: product.totalInventory }) }}
                  </p>
                  <p v-else class="text-light-secondary">
                    {{ $t('product.notAvailable') }}
                  </p>
                  <div v-if="product.availableForSale" class="cmw-relative">
                    <Button
                      class="cmw-gap-2 cmw-pl-2 cmw-pr-3 cmw-py-2"
                      :aria-label="$t('enums.accessibility.role.ADD_TO_CART')"
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
                        :aria-label="$t('enums.accessibility.role.REMOVE_FROM_CART')"
                        @click="removeFromUserCart"
                      >
                        <VueSvgIcon class="cmw-m-auto" :data="subtractIcon" width="14" height="14" color="white" />
                      </button>
                      <div class="cmw-flex cmw-h-[40px] cmw-bg-primary-400 cmw-text-white text-center">
                        <span class="cmw-m-auto cmw-text-sm">{{ cartQuantity }}</span>
                      </div>
                      <button
                        class="cmw-flex cmw-transition-colors cmw-w-[50px] cmw-h-[50px] cmw-bg-primary-400 cmw-rounded-r
                        hover:(cmw-bg-primary)
                        disabled:(cmw-bg-primary-100 cmw-cursor-not-allowed)"
                        :disabled="!canAddMore"
                        :aria-label="!canAddMore ? '' : $t('enums.accessibility.role.ADD_TO_CART')"
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
                :aria-label="isOnFavourite ? $t('enums.accessibility.role.REMOVE_FROM_WISHLIST') : $t('enums.accessibility.role.ADD_TO_WISHLIST')"
                @click="handleWishlist({ id: `P${productDetails.feId}`, isOnFavourite })"
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
                  v-if="product.descriptionHtml !== ''"
                  :title="$t('product.description')"
                >
                  <div v-html="product.descriptionHtml" />
                </b-tab>
                <b-tab :title="$t('product.toEnjoyBetter')">
                  <div>
                    <h3 class="mb-5">
                      {{ $t('product.toEnjoyBetter') }}
                    </h3>

                    <div class="mb-5">
                      <h4 class="font-weight-bold">
                        {{ $t('product.temperature') }}
                      </h4>
                      <p>{{ productDetails.servingTemperature }}</p>
                    </div>

                    <div class="mb-5">
                      <h4 class="font-weight-bold">
                        {{ $t('product.whenDrink') }}
                      </h4>
                      <p>{{ productDetails.drinkNotesDrinkingTitle[$i18n.locale] }}</p>
                      <p>
                        {{ productDetails.drinkNotesServingDescription[$i18n.locale] }}
                      </p>
                      <p>
                        {{ productDetails.drinkNotesDrinkingLongevity[$i18n.locale] }}
                      </p>
                    </div>

                    <div class="mb-5">
                      <h4 class="font-weight-bold">
                        {{ productDetails.glassTitle[$i18n.locale] }}
                      </h4>
                      <p>{{ productDetails.glassDescription[$i18n.locale] }}</p>
                    </div>
                  </div>
                </b-tab>
                <b-tab
                  v-if="$config.STORE !== 'WILDVIGNERON'"
                  :title="$t('product.awardsAndAcknowledgments')"
                >
                  <table
                    v-if="productDetails.awards.length > 0"
                    class="table table-striped"
                  >
                    <thead>
                      <tr class="bg-dark-primary text-white">
                        <th style="border-radius: 15px 0px 0px 0px" scope="col">
                          {{ $t('product.guide') }}
                        </th>
                        <th style="" scope="col">
                          {{ $t('product.year') }}
                        </th>

                        <th style="" scope="col">
                          {{ $t('product.score') }}
                        </th>

                        <th style="border-radius: 0px 15px 0px 0px" scope="col">
                          {{ $t('product.quote') }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(award, i) in productDetails.awards" :key="i">
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
                    <div v-if="brandMetaFields.isPartner" class="ribbon cmw-flex cmw-items-center">
                      <!-- TODO: This will use the new lapel component -->
                      <VueSvgIcon
                        :data="favouriteIcon"
                        class="svg-favourite"
                        width="20" height="auto"
                      />
                      <span class="small !cmw-top-0">{{
                        $t('product.recommendedByCallmewine')
                      }}</span>
                    </div>
                    <h3 class="text-light-secondary">
                      {{ brand.title }}
                    </h3>
                    <div class="row">
                      <div class="col-12 col-md-8">
                        <div class="row py-3 bg-light">
                          <div class="col-6 font-weight-bold">
                            {{ $t('product.mainWines') }}
                          </div>
                          <div class="col-6" />
                        </div>
                        <div class="row py-3">
                          <div class="col-6 font-weight-bold">
                            {{ $t('product.foundation') }}
                          </div>
                          <div class="col-6">
                            {{ brandMetaFields.year }}
                          </div>
                        </div>
                        <div class="row py-3 bg-light">
                          <div class="col-6 font-weight-bold">
                            {{ $t('product.vineyardHectares') }}
                          </div>
                          <div class="col-6">
                            {{ brandMetaFields.hectares }}
                          </div>
                        </div>
                        <div class="row py-3">
                          <div class="col-6 font-weight-bold">
                            {{ $t('product.ownGrapes') }}
                          </div>
                          <div class="col-6">
                            {{ brandMetaFields.ownedGrapes }} %
                          </div>
                        </div>
                        <div class="row py-3 bg-light">
                          <div class="col-6 font-weight-bold">
                            {{ $t('product.annualProduction') }}
                          </div>
                          <div class="col-6">
                            {{ brandMetaFields.annualProduction }}
                          </div>
                        </div>
                        <div class="row py-3">
                          <div class="col-6 font-weight-bold">
                            {{ $t('product.winemaker') }}
                          </div>
                          <div class="col-6" />
                        </div>
                        <div class="row py-3 bg-light">
                          <div class="col-6 font-weight-bold">
                            {{ $t('product.address') }}
                          </div>
                          <div class="col-6">
                            {{ brandMetaFields.address }}
                          </div>
                        </div>
                      </div>
                      <div class="col-12 col-md-4">
                        <img :src="brand.image.url" alt="">
                      </div>
                    </div>
                    <!-- <img :src="search.image.url" alt="" />
                    <div v-html="search.contentHtml"></div> -->
                  </div>
                </b-tab>
                <b-tab :title="$t('product.pairings')">
                  <!-- {{ metaField.foodPairings }} -->
                  <h3 class="mb-5">
                    {{ $t('product.pairings') }}
                  </h3>

                  <div class="row">
                    <div
                      v-for="pairing in productDetails.foodPairings"
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
                {{ $t('product.features') }}
              </h3>

              <div v-if="productDetails.denomination[$i18n.locale]">
                <p class="font-weight-bold mb-0">
                  {{ $t('product.denomination') }}
                </p>
                <p class="mb-4">
                  {{ productDetails.denomination[$i18n.locale] }}
                </p>
                <hr>
              </div>
              <div v-if="productDetails.grapes[$i18n.locale]">
                <p class="font-weight-bold mb-0">
                  {{ $t('product.vines') }}
                </p>
                <p class="mb-4">
                  {{ productDetails.grapes[$i18n.locale] }}
                </p>
                <hr>
              </div>

              <div
                v-if="
                  productDetails.countryName[$i18n.locale]
                    || productDetails.countryRegionName
                "
              >
                <p class="font-weight-bold mb-0">
                  {{ $t('product.region') }}
                </p>
                <p class="mb-4">
                  {{ productDetails.countryRegionName }}
                  {{ productDetails.countryName[$i18n.locale] }}
                </p>
                <hr>
              </div>
              <div v-if="productDetails.alcoholContent">
                <p class="font-weight-bold mb-0">
                  {{ $t('product.alcoholContent') }}
                </p>
                <p class="mb-4">
                  {{ productDetails.alcoholContent }}%
                </p>
                <hr>
              </div>
              <div v-if="productDetails.size[$i18n.locale]">
                <p class="font-weight-bold mb-0">
                  {{ $t('product.format') }}
                </p>
                <p class="mb-4">
                  {{ productDetails.size[$i18n.locale] }}
                </p>
                <hr>
              </div>
              <div v-if="productDetails.winemaking[$i18n.locale]">
                <p class="font-weight-bold mb-0">
                  {{ $t('product.vinification') }}
                </p>
                <p class="mb-4">
                  {{ productDetails.winemaking[$i18n.locale] }}
                </p>
                <hr>
              </div>
              <div v-if="productDetails.agingDescription[$i18n.locale]">
                <p class="font-weight-bold mb-0">
                  {{ $t('product.refinement') }}
                </p>
                <p class="mb-4">
                  {{ productDetails.agingDescription[$i18n.locale] }}
                </p>
                <hr>
              </div>
              <div v-if="productDetails.productInformations[$i18n.locale]">
                <p class="font-weight-bold mb-0">
                  {{ $t('product.additionalNotes') }}
                </p>
                <p class="mb-4">
                  {{ productDetails.productInformations[$i18n.locale] }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <ClientOnly>
          <RecentProducts />
          <VendorProducts :vendor="brand.title" />
          <RecommendedProducts :id="product.id" />
        </ClientOnly>
      </div>
    </template>
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
