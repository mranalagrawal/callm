<script>
import { markRaw, ref } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'
import heartIcon from 'assets/svg/heart.svg'
import heartFullIcon from 'assets/svg/heart-full.svg'
import cartIcon from 'assets/svg/cart.svg'
import addIcon from 'assets/svg/add.svg'
import subtractIcon from 'assets/svg/subtract.svg'
import emailIcon from 'assets/svg/email.svg'
import { mapState } from 'vuex'
import { useCustomer } from '~/store/customer'
import { pick } from '@/utilities/arrays'
import { isObject } from '~/utilities/validators'
import { getLocaleFromCurrencyCode } from '~/utilities/currency'
// noinspection JSUnusedGlobalSymbols
export default {
  name: 'ProductBoxVerticalElastic',
  props: {
    /** @Type: {ProductVariantType.ProductVariant} */
    product: {
      required: true,
      validator(value) {
        return isObject(value)
      },
    },
  },
  setup() {
    const customerStore = useCustomer()
    const { wishlistArr } = storeToRefs(customerStore)
    const { handleWishlist } = customerStore

    const features = markRaw(['favourite', 'isnew', 'inpromotion', 'foreveryday', 'togift', 'unusualvariety', 'rarewine', 'artisanal', 'organic', 'topsale'])
    const isOpen = ref(false)

    return {
      wishlistArr,
      heartIcon,
      heartFullIcon,
      cartIcon,
      emailIcon,
      addIcon,
      subtractIcon,
      features,
      isOpen,
      handleWishlist,
    }
  },
  computed: {
    ...mapState('userCart', {
      userCart: 'userCart',
    }),
    backofficeId() {
      // Get the proper tag 🤦🏻
      return `P${this.product._source.id}`
    },
    isAvailableForSale() {
      return this.product._source.quantity[this.$config.STORE] > 0
    },
    isOnCart() {
      return this.userCart.find(lineItem => lineItem.productVariantId === `gid://shopify/ProductVariant/${this.product._source.variantId[this.$config.STORE]}`)
    },
    cartQuantity() {
      return this.isOnCart ? this.isOnCart.quantity : 0
    },
    isOnFavourite() {
      return this.wishlistArr.includes(this.backofficeId)
    },
    availableFeatures() {
      /* Todo: Definitely we need to use some enums here ... */
      let features = pick(this.product._source, this.features)

      features = Object.keys(features)
        .reduce((o, key) => {
          features[key] === true && (o[key] = features[key])

          return o
        }, {})

      return Object.keys(features).slice(0, 4)
    },
    awardsMapped() {
      return this.product._source.awards.slice(0, 4).map(award => ({
        ...award,
        title: award[`name_${this.$i18n.locale}`],
        quote: {
          it: award.quote_it,
          en: award.quote_en,
          fr: award.quote_fr,
          de: award.quote_de,
        },
      }))
    },
    isOnSale() {
      return (this.product._source.saleprice[this.$config.SALECHANNEL] > this.product._source.price[this.$config.SALECHANNEL])
      || this.product._source.inpromotion
    },
  },
  methods: {
    getLocaleFromCurrencyCode,
    async addToUserCart() {
      this.isOpen = true
      const productVariantId
         = `gid://shopify/ProductVariant/${
         this.product._source.variantId[this.$config.STORE]}`
      const amount = Number(this.product._source.saleprice[this.$config.SALECHANNEL])
      const amountFullPrice = Number(
        this.product._source.price[this.$config.SALECHANNEL],
      )

      const tag = `P${this.product._source.id}`
      const image = this.product._source.shopifyImageUrl[this.$config.STORE]
      const title = this.product._source.shortName
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
        message: `${this.product._source.shortName} aggiunto!`,
        icon: this.product._source.shopifyImageUrl[this.$config.STORE],
        iconClass: 'bg-transparent ',
        time: 1000,
        blockClass: 'add-product-notification',
      })
    },
    async removeFromUserCart() {
      const productVariantId = `gid://shopify/ProductVariant/${this.product._source.variantId[this.$config.STORE]}`
      this.$store.commit('userCart/removeProduct', productVariantId)
    },
  },
}
</script>

<template>
  <div
    class="
    c-productBox cmw-relative cmw-bg-white cmw-rounded-sm cmw-border cmw-border-gray-light
    hover:cmw-shadow-elevation"
  >
    <div class="c-productBox__grid cmw-grid cmw-h-full">
      <div class="c-productBox__features cmw-py-2 cmw-pl-2">
        <div class="cmw-flex cmw-flex-col cmw-gap-y-1 cmw-w-max">
          <ProductBoxFeature v-for="feature in availableFeatures" :key="feature" :feature="feature" />
        </div>
      </div>
      <div class="c-productBox__awards cmw-place-self-end">
        <div
          v-for="(award) in awardsMapped"
          :key="award.id"
          class="cmw-flex cmw-gap-1 cmw-items-center cmw-pr-1.5"
        >
          <ProductBoxAward :award="award" />
        </div>
      </div>
      <div class="c-productBox__image">
        <NuxtLink :to="localePath(`/${product._source.handle}-P${product._source.id}`)">
          <img
            class="cmw-transition-lazy-image cmw-filter hover:cmw-contrast-150 cmw-max-h-[150px] cmw-mx-auto cmw-mt-8 cmw-text-xxs lg:cmw-max-h-[270px]"
            :class="{ 'cmw-opacity-50': !isAvailableForSale }"
            :src="product._source.shopifyImageUrl[$config.STORE]"
            :alt="product._source.shortName"
          >
        </NuxtLink>
      </div>
      <div class="c-productBox__wishlist cmw-place-self-end cmw-relative">
        <ButtonIcon
          :icon="isOnFavourite ? heartFullIcon : heartIcon"
          class="cmw-mr-4 z-baseLow" :variant="isOnFavourite ? 'icon-primary' : 'icon'"
          @click.native="handleWishlist({ id: backofficeId, isOnFavourite })"
        />
      </div>
      <div class="c-productBox__title">
        <div class="cmw-mx-4 cmw-mt-4">
          {{ product._source.shortName }}
        </div>
      </div>
      <div class="c-productBox__price cmw-justify-self-start cmw-self-end">
        <div class="cmw-flex cmw-flex-col cmw-ml-4 cmw-mb-4">
          <span
            v-if="isOnSale"
            class="cmw-line-through cmw-text-gray cmw-text-sm"
          >
            <!-- Note: can we get product.compareAtPriceV2.currencyCode from elastic? -->
            {{ $n(product._source.saleprice[$config.SALECHANNEL], 'currency', getLocaleFromCurrencyCode($config.STORE === "CMW_UK" ? "GBP" : "EUR")) }}
          </span>
          <i18n-n
            class="cmw-inline-block" :value="Number(product._source.price[$config.SALECHANNEL])" :format="{ key: 'currency' }"
            :locale="getLocaleFromCurrencyCode($config.STORE === 'CMW_UK' ? 'GBP' : 'EUR')"
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
      </div>
      <div class="c-productBox__cart cmw-place-self-end">
        <div v-if="isAvailableForSale" class="cmw-mr-4 cmw-mb-4 cmw-relative">
          <ButtonIcon
            :icon="cartIcon"
            @click.native="addToUserCart"
          />
          <Badge
            v-show="cartQuantity && !isOpen"
            class="cmw-absolute cmw-top-0 cmw-left-full cmw-transform cmw-translate-x-[-50%] cmw-translate-y-[-50%]"
            bg-color="primary-400" :qty="cartQuantity"
          />
          <div
            v-show="isOpen"
            class="cmw-absolute cmw-w-full cmw-h-[120px] cmw-bottom-0 cmw-left-0"
            @mouseleave="isOpen = false"
          >
            <button
              class="cmw-flex cmw-transition-colors cmw-w-[40px] cmw-h-[40px] cmw-bg-primary-400 cmw-rounded-t-sm hover:(cmw-bg-primary)"
              @click="addToUserCart"
            >
              <VueSvgIcon class="cmw-m-auto" :data="addIcon" width="14" height="14" color="white" />
            </button>
            <div class="cmw-flex cmw-w-[40px] cmw-h-[40px] cmw-bg-primary-400 cmw-text-white text-center">
              <span class="cmw-m-auto cmw-text-sm">{{ cartQuantity }}</span>
            </div>
            <button
              class="cmw-flex cmw-transition-colors cmw-w-[40px] cmw-h-[40px] cmw-bg-primary-400 cmw-rounded-b-sm hover:(cmw-bg-primary)"
              @click="removeFromUserCart"
            >
              <VueSvgIcon class="cmw-m-auto" :data="subtractIcon" width="14" height="14" color="white" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="c-productBox__lapel cmw-absolute cmw-top-$lapel-top cmw-right-10">
      <CardLapel v-if="isOnSale" />
    </div>
    <div
      v-if="!isAvailableForSale"
      class="cmw-absolute cmw-transform cmw-bg-black/70 cmw-rounded cmw-top-1/3 cmw-left-1/2 cmw-translate-y-[-50%] cmw-translate-x-[-50%]
       cmw-py-4 cmw-px-4 cmw-overline-2 cmw-uppercase cmw-text-white"
      v-text="$t('product.notAvailable2')"
    />
  </div>
</template>

<style scoped>
.c-productBox {
  container: product-box / inline-size;
  height: 100%;
}

.c-productBox__grid {
  grid-template-columns: 60px auto auto 60px;
  grid-template-rows: auto auto auto 110px;
  grid-template-areas:
  "features image image wishlist"
  "awards image image wishlist"
  "title title title title"
  "price price cart cart";
}

.c-productBox__features {
  grid-area: features;
}

.c-productBox__awards {
  grid-area: awards;
}

.c-productBox__image {
  grid-area: image;
}

.c-productBox__wishlist {
  grid-area: wishlist;
}

.c-productBox__title {
  grid-area: title;
}

.c-productBox__price {
  grid-area: price;
}

.c-productBox__cart {
  grid-area: cart;
}

.c-productBox__lapel {
  --lapel-top: -6px;
}

/* We are handling this piece skipping mobile-first to reduce the amount of CSS  */
@container product-box (max-width: 250px) {
  .c-productBox__lapel {
    --lapel-top: -5px;
  }

  :deep(.c-lapel) {
    --lapel-height: 26px;
    --lapel-edge-width: 22px;
    --lapel-edge-left: -22px;
    --lapel-swg-width: 18px;
  }

  :deep(.c-lapel__label) {
    display: none;
  }
}
</style>
