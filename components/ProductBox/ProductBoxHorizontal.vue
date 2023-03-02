<script>
import { storeToRefs } from 'pinia'
import cartIcon from 'assets/svg/cart.svg'
import addIcon from 'assets/svg/add.svg'
import subtractIcon from 'assets/svg/subtract.svg'
import emailIcon from 'assets/svg/email.svg'
import heartIcon from 'assets/svg/heart.svg'
import heartFullIcon from 'assets/svg/heart-full.svg'
import { markRaw, ref } from '@nuxtjs/composition-api'
import { mapState } from 'vuex'
import { getLocaleFromCurrencyCode } from '~/utilities/currency'
import { isObject, regexRules } from '~/utilities/validators'
import { pick } from '~/utilities/arrays'
import { useCustomer } from '~/store/customer'
import { stripHtml } from '~/utilities/strings'
import { SweetAlertToast } from '~/utilities/Swal'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'ProductBoxHorizontal',
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

    return { wishlistArr, heartIcon, heartFullIcon, cartIcon, emailIcon, addIcon, subtractIcon, features, isOpen, handleWishlist, stripHtml }
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

      // FixMe: Shall we slice this? it seems that limiting this to 3 is enough, what do you think?
      //  what about redesign a bit the product box? maybe put it like the promotion tag but vertical, I'll try something on figma first
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
    class="cmw-relative cmw-transition cmw-transition-box-shadow cmw-bg-white cmw-rounded-sm cmw-border cmw-border-gray-light cmw-p-2 cmw-grid cmw-grid-cols-[220px_auto_320px]
hover:cmw-shadow-elevation"
  >
    <!-- Image Section -->
    <div class="cmw-relative cmw-p-2">
      <ClientOnly>
        <NuxtLink :to="localePath(`/${product.product.handle}-${product.product.tags[0]}`)">
          <LoadingImage
            class="cmw-filter hover:cmw-contrast-150 cmw-mx-auto cmw-mt-4"
            :class="{ 'cmw-opacity-50': !product.availableForSale }"
            :thumbnail="{
              url: `${product.image.url}&width=20&height=36`,
              width: 20,
              height: 36,
              altText: product.image.altText,
            }"
            :source="{
              url: `${product.image.url}&width=300&height=540`,
              width: 300,
              height: 540,
              altText: product.image.altText,
            }"
            img-classes="cmw-w-full cmw-h-auto"
          />
        </NuxtLink>
      </ClientOnly>
      <div class="cmw-absolute cmw-top-4 cmw-left-2 cmw-flex cmw-flex-col cmw-gap-y-1">
        <!-- Todo: create a global tooltip that change position base on mouse position -->
        <ProductBoxFeature v-for="feature in availableFeatures" :key="feature" :feature="feature" />
      </div>
      <button
        type="button"
        class="cmw-absolute cmw-top-4 cmw-right-2"
        :aria-label="isOnFavourite ? $t('enums.accessibility.role.REMOVE_FROM_WISHLIST') : $t('enums.accessibility.role.ADD_TO_WISHLIST')"
        @click="handleWishlist({ id: backofficeId, isOnFavourite })"
      >
        <VueSvgIcon
          color="#d94965"
          width="32"
          height="32"
          :data="isOnFavourite ? heartFullIcon : heartIcon"
        />
      </button>
    </div>
    <!-- Content Section -->
    <div class="cmw-p-2">
      <div class="h4 cmw-mt-4">
        <NuxtLink
          :to="localePath(`/${product.product.handle}-${product.product.tags[0]}`)"
          class="cmw-text-body hover:(cmw-text-primary-400 cmw-no-underline)"
        >
          {{ product.title || product.product.title }}
        </NuxtLink>
      </div>
      <!-- <div>TODO: RATING STARS </div> -->
      <div class="cmw-flex cmw-gap-3 cmw-my-8">
        <div
          v-for="(award, i) in metaField.awards"
          :key="award.id"
          class="cmw-flex cmw-gap-1 cmw-items-center cmw-pr-1.5"
          :class="{ 'cmw-border-r cmw-border-r-gray': ((i + 1) < metaField.awards.length) }"
        >
          <ProductBoxAward :award="award" />
        </div>
      </div>
      <div
        class="cmw-grid cmw-gap-x-8 cmw-gap-y-2 cmw-my-8 cmw-grid-cols-[auto_1fr] cmw-text-sm"
        :class="{ 'cmw-opacity-50': !product.availableForSale }"
      >
        <div
          class="cmw-font-bold"
          v-text="$t('product.vines')"
        />
        <div>{{ metaField.grapes[$i18n.locale] }}</div>
        <div
          class="cmw-font-bold"
          v-text="$t('product.region')"
        />
        <div>{{ metaField.regionName[$i18n.locale] }}</div>
        <div
          class="cmw-font-bold"
          v-text="$t('product.format')"
        />
        <div>{{ metaField.size[$i18n.locale] }}</div>
      </div>
      <!-- Note: Why don't we use these fields from shopify? wouldn't be easier to handle locales? -->
      <!-- <div>{{ product.description }}</div>
      <div>{{ product.descriptionHtml }}</div> -->
      <div
        class="c-productBox__desc cmw-mb-4"
        :class="{ 'cmw-opacity-50': !product.availableForSale }"
        v-html="stripHtml(metaField.shortDescription[$i18n.locale])"
      />
      <!--      <pre>{{ availableFeatures }}</pre>
      <pre
        class="cmw-text-xs"
        style="word-wrap: break-word"
      >
        {{ metaField }}
      </pre> -->
    </div>
    <!-- CTA Section -->
    <div class="cmw-relative cmw-flex">
      <div class="cmw-m-auto cmw-text-center cmw-w-full px-4">
        <p
          v-if="!!product.quantityAvailable && product.quantityAvailable < 6"
          class="cmw-overline-2 cmw-text-success cmw-font-medium cmw-text-center cmw-uppercase"
          v-text="$t('product.available', { quantity: product.quantityAvailable })"
        />

        <span
          v-if="isOnSale"
          class="cmw-line-through cmw-text-gray cmw-text-sm cmw-mr-3"
        >
          {{
            $n(Number(product.compareAtPriceV2.amount), 'currency', getLocaleFromCurrencyCode(product.compareAtPriceV2.currencyCode))
          }}
        </span>
        <i18n-n
          class="cmw-inline-block cmw-mb-3" :value="Number(product.priceV2.amount)" :format="{ key: 'currency' }"
          :locale="getLocaleFromCurrencyCode(product.priceV2.currencyCode)"
        >
          <template #currency="slotProps">
            <span class="cmw-text-sm md:cmw-text-base">{{ slotProps.currency }}</span>
          </template>
          <template #integer="slotProps">
            <span class="cmw-h1 cmw-font-bold">{{ slotProps.integer }}</span>
          </template>
          <template #group="slotProps">
            <span class="cmw-h1 cmw-font-bold">{{ slotProps.group }}</span>
          </template>
          <template #fraction="slotProps">
            <span class="cmw-text-sm md:cmw-text-base">{{ slotProps.fraction }}</span>
          </template>
        </i18n-n>
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
          <!-- Clarify: In case the user is not logged we could just ask for his email in the SweetAlert confirm and also invite the user to log  -->
          <!-- Clarify: Shall we open a SweetAlert confirmation modal first? or just send the email?  -->
          <!-- Todo: Implement send email functionality on Backend -->
          <!--
          <Button v-else variant="ghost" class="cmw-gap-2 cmw-pl-2 cmw-pr-3 cmw-py-2" @click.native="() => {}">
            <VueSvgIcon :data="emailIcon" width="30" height="auto" />
            <span class="cmw-text-sm" v-text="$t('product.notifyMe')" />
          </Button>
           -->
        </div>
      </div>
      <div class="cmw-absolute cmw-transform cmw-top-px cmw-left-1/2 cmw-translate-x-[-50%] cmw-translate-y-[-50%]">
        <CardLapel v-if="isOnSale" />
      </div>
    </div>
    <div
      v-if="!product.availableForSale"
      class="cmw-absolute cmw-transform cmw-bg-black/70 cmw-rounded cmw-top-1/2 cmw-left-12 cmw-translate-y-[-50%] cmw-py-4 cmw-px-24 cmw-overline-2 cmw-uppercase cmw-text-white"
      v-text="$t('product.notAvailable2')"
    />
  </div>
</template>

<style scoped>
/* FixMe: Temporary fix till we decide what to do with this section */
.c-productBox__desc a {
  color: theme('colors.success');
}
</style>
