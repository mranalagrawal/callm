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
// noinspection ES6UnusedImports
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as MetaFieldTypeType from '~/types/metaField'
import { pick } from '@/utilities/arrays'
import { isObject, regexRules } from '~/utilities/validators'
import { getLocaleFromCurrencyCode } from '~/utilities/currency'
import { SweetAlertToast } from '~/utilities/Swal'
// noinspection JSUnusedGlobalSymbols
export default {
  name: 'ProductBoxVertical',
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
    const isHovering = ref(false)

    return { wishlistArr, heartIcon, heartFullIcon, cartIcon, emailIcon, addIcon, subtractIcon, features, isOpen, isHovering, handleWishlist }
  },
  computed: {
    ...mapState('userCart', {
      userCart: 'userCart',
    }),
    backofficeId() {
      // Get the proper tag 🤦🏻
      return this.product.product.tags.find(tag => new RegExp(regexRules('isProduct')).test(tag))
    },
    isOnCart() {
      return this.userCart.find(lineItem => lineItem.productVariantId === this.product.product.variants.nodes[0].id)
    },
    cartQuantity() {
      return this.isOnCart ? this.isOnCart.quantity : 0
    },
    isOnFavourite() {
      return this.wishlistArr.includes(this.backofficeId)
    },
    /** @Type: {MetaFieldType.MetaField} */
    metaField() {
      return JSON.parse(this.product.product.metafield.value)
    },
    availableFeatures() {
      /* Todo: Definitely we need to use some enums here ... */
      let features = pick(this.metaField, this.features)

      features = Object.keys(features)
        .reduce((o, key) => {
          features[key] === true && (o[key] = features[key])

          return o
        }, {})

      return Object.keys(features).slice(0, 4)
    },
    isOnSale() {
      return Number(this.product.compareAtPriceV2.amount) > Number(this.product.priceV2.amount) || this.availableFeatures.includes('inpromotion')
    },
    canAddMore() {
      return this.product.quantityAvailable - this.cartQuantity > 0
    },
  },
  methods: {
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

      const productVariantId = this.product.product.variants.nodes[0].id
      const amount = Number(this.product.product.variants.nodes[0].price)
      const amountFullPrice = Number(
        this.product.product.variants.nodes[0].compareAtPriceV2.amount,
      )
      const tag = this.product.product.tags[0]
      const image = this.product.product.images.nodes[0].url
      const title = this.product.product.title
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
        message: `${this.product.product.title} è stato aggiunto al carrello!`,
        icon: this.product.product.images.nodes[0].url,
        iconClass: 'bg-transparent ',
        time: 8000,
        blockClass: 'add-product-notification',
      })
    },
    async removeFromUserCart() {
      const productVariantId = this.product.product.variants.nodes[0].id
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
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
  >
    <div class="c-productBox__grid cmw-grid cmw-h-full">
      <div class="c-productBox__features cmw-py-2 cmw-pl-2">
        <div class="cmw-flex cmw-flex-col cmw-gap-y-1 cmw-w-max">
          <ProductBoxFeature v-for="feature in availableFeatures" :key="feature" :feature="feature" />
        </div>
      </div>
      <div class="c-productBox__awards cmw-place-self-end">
        <div
          v-for="(award) in metaField.awards.slice(0, 4)"
          :key="award.id"
          class="cmw-flex cmw-gap-1 cmw-items-center cmw-pr-1.5"
        >
          <ProductBoxAward :award="award" />
        </div>
      </div>
      <div class="c-productBox__image">
        <NuxtLink :to="localePath(`/${product.product.handle}-${backofficeId}`)">
          <img
            class="cmw-transition-lazy-image cmw-filter hover:cmw-contrast-150 cmw-max-h-[150px] cmw-mx-auto cmw-mt-8 lg:cmw-max-h-[270px]"
            :class="{ 'cmw-opacity-50': !product.availableForSale }"
            :src="product.image.url"
            :alt="product.image.altText"
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
          <NuxtLink
            :to="localePath(`/${product.product.handle}-${backofficeId}`)"
            class="cmw-text-body hover:(cmw-text-primary-400 cmw-no-underline)"
          >
            {{ product.title || product.product.title }}
          </NuxtLink>
        </div>
      </div>
      <div class="c-productBox__price cmw-justify-self-start cmw-self-end">
        <div class="cmw-flex cmw-flex-col cmw-ml-4 cmw-mb-4">
          <span
            v-if="isOnSale"
            class="cmw-line-through cmw-text-gray cmw-text-sm"
          >
            {{
              $n(Number(product.compareAtPriceV2.amount), 'currency', getLocaleFromCurrencyCode(product.compareAtPriceV2.currencyCode))
            }}
          </span>
          <i18n-n
            class="cmw-inline-block" :value="Number(product.priceV2.amount)" :format="{ key: 'currency' }"
            :locale="getLocaleFromCurrencyCode(product.priceV2.currencyCode)"
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
        <div v-if="product.availableForSale" class="cmw-mr-4 cmw-mb-4 cmw-relative">
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
              class="cmw-flex cmw-transition-colors cmw-w-[40px] cmw-h-[40px] cmw-bg-primary-400 cmw-rounded-t-sm
               hover:(cmw-bg-primary)
               disabled:(cmw-bg-primary-100 cmw-cursor-not-allowed)"
              :disabled="!canAddMore"
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
      v-if="!product.availableForSale && isHovering"
      class="cmw-absolute cmw-transform cmw-bg-black/70 cmw-rounded cmw-top-1/3 cmw-left-1/2 cmw-translate-y-[-50%] cmw-translate-x-[-50%]
       cmw-py-4 cmw-px-4 cmw-overline-2 cmw-uppercase cmw-text-white"
      v-text="$t('product.notAvailable2')"
    />
  </div>
</template>

<style scoped>
.c-productBox {
  container: product-box / inline-size;
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
