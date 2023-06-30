<script>
import { mapGetters } from 'vuex'
import { storeToRefs } from 'pinia'
import heartIcon from '~/assets/svg/heart.svg'
import userIcon from '~/assets/svg/user.svg'
import cartIcon from '~/assets/svg/cart.svg'
import { useCustomer } from '~/store/customer'
import { getLocaleFromCurrencyCode } from '~/utilities/currency'
import { useShopifyCart } from '~/store/shopifyCart'

export default {
  name: 'UserActions',
  setup() {
    const customerStore = useCustomer()
    const {
      customer,
      favoritesCount,
    } = storeToRefs(customerStore)
    const shopifyCart = useShopifyCart()

    return {
      customer,
      customerStore,
      favoritesCount,
      getLocaleFromCurrencyCode,
      shopifyCart,
    }
  },
  data() {
    return {
      heartIcon,
      userIcon,
      cartIcon,
      currentComponent: '',
      hoveringComponent: false,
      hoveringAction: false,
      hoveringColor: 'primary-400',
    }
  },
  computed: {
    ...mapGetters({
      cartItems: 'userCart/cartItems',
      cartTotalAmount: 'userCart/getCartTotalAmount',
      cartTotalAmountObj: 'userCart/cartTotalAmountObj',
    }),
    itemsInCart() {
      return this.shopifyCart.shopifyCart && this.shopifyCart.shopifyCart.totalQuantity
    },
    cartTotal() {
      const cartLines = this.shopifyCart.getCartLines()
      return cartLines.reduce((t, n) => t + n.quantity * n.price, 0)
    },
  },
  methods: {
    handleUserActionMouseEnter(key) {
      setTimeout(() => this.hoveringAction = true, 25)

      if (this.currentComponent === key)
        return

      this.currentComponent = key
    },
    handleMouseAction(show) {
      this.hoveringComponent = show
      setTimeout(() => {
        if (!this.hoveringAction && !this.hoveringComponent)
          this.currentComponent = false
      }, 75)
    },
    handleUserActionMouseLeave() {
      this.hoveringAction = false

      setTimeout(() => {
        if (this.hoveringComponent)
          return

        if (!this.hoveringComponent && !this.hoveringAction)
          this.currentComponent = false
      }, 150)
    },
    lookUpComponent(k) {
      return ({
        login: 'HeaderLogin',
        cart: 'HeaderMiniCart',
      })[k]
    },
  },
}
</script>

<template>
  <div class="relative">
    <div class="relative flex">
      <NuxtLink
        v-if="customer.id"
        :to="localePath('/profile/wishlist')"
        class="peer transition-colors rounded py-3 px-6 bg-white text-center text-body hover:(bg-primary-900 text-white)"
        @mouseenter="hoveringColor = 'white'"
        @mouseleave="hoveringColor = 'primary-400'"
      >
        <span class="relative">
          <VueSvgIcon
            class="block"
            :data="heartIcon"
            width="32px"
            height="32px"
          />
          <span
            class="block my-0 font-light text-sm"
            v-text="$t('navbar.favorites')"
          />
          <Badge
            v-if="favoritesCount"
            :qty="favoritesCount"
            :bg-color="hoveringColor"
            class="transform absolute top-[-6px] right-[-4px]"
          />
        </span>
      </NuxtLink>
      <button
        class="transition-colors rounded-t py-3 px-6 bg-white hover:(bg-primary-900 text-white)"
        :class="{ 'bg-primary-900 text-white': currentComponent === 'login' }"
        @mouseenter="handleUserActionMouseEnter('login')"
        @mouseleave="handleUserActionMouseLeave"
      >
        <span>
          <VueSvgIcon
            class="block"
            :data="userIcon"
            width="32px"
            height="32px"
          />
          <span class="block my-0 font-light text-sm truncate max-w-100px">
            {{ customer.id ? customer.firstName : $t('navbar.user.signIn') }}
          </span>
        </span>
      </button>
      <button
        class="transition-colors rounded-t py-4 px-8 bg-white hover:(bg-primary-900 text-white)"
        :class="currentComponent === 'cart' ? 'bg-primary-900 text-white' : ''"
        @mouseenter="handleUserActionMouseEnter('cart')"
        @mouseleave="handleUserActionMouseLeave"
      >
        <span class="flex gap-1 items-center">
          <span v-if="itemsInCart">
            <span class="block text-xxs text-left mb-1">{{ $t('cartTotal') }}</span>
            <i18n-n
              class="flex items-end leading-none" :value="Number(cartTotal)"
              :format="{ key: 'currency' }"
              :locale="getLocaleFromCurrencyCode($config.STORE === 'CMW_UK' ? 'GBP' : 'EUR')"
            >
              <template #currency="slotProps">
                <span class="text-sm md:text-base">{{ slotProps.currency }}</span>
              </template>
              <template #integer="slotProps">
                <span class="text-2xl">{{ slotProps.integer }}</span>
              </template>
              <template #group="slotProps">
                <span>{{ slotProps.group }}</span>
              </template>
              <template #fraction="slotProps">
                <span>{{ slotProps.fraction }}</span>
              </template>
            </i18n-n>
          </span>
          <span class="relative">
            <VueSvgIcon
              class="block"
              :data="cartIcon"
              width="32px"
              height="32px"
            />
            <span
              v-if="!itemsInCart"
              class="block my-0 font-light text-sm"
            >
              {{ $t('cart') }}
            </span>
            <Badge
              v-if="itemsInCart"
              :qty="itemsInCart"
              :bg-color="currentComponent === 'cart' ? 'white' : 'primary-400'"
              class="transform absolute top-[-10px] right-[-10px]"
            />
          </span>
        </span>
      </button>
    </div>

    <transition
      name="slideFade"
      mode="out-in"
    >
      <div
        v-if="currentComponent"
        :key="currentComponent"
        class="
        absolute transform rounded-b transition-transform-opacity bottom-0 right-0 bg-white w-auto translate-x-0 translate-y-full
        overflow-hidden z-base shadow"
        :class="currentComponent === 'cart' ? 'rounded-tl' : 'rounded-t'"
      >
        <div
          @mouseleave="handleMouseAction(false)"
          @mouseenter="handleMouseAction(true)"
        >
          <keep-alive>
            <component :is="lookUpComponent(currentComponent)" />
          </keep-alive>
        </div>
      </div>
    </transition>
  </div>
</template>
