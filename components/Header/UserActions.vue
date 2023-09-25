<script>
import { computed, useContext } from '@nuxtjs/composition-api'
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
    const { $config } = useContext()
    const customerStore = useCustomer()
    const {
      customer,
      favoritesCount,
    } = storeToRefs(customerStore)
    const shopifyCartStore = useShopifyCart()
    const { cartTotal, cartTotalQuantity } = storeToRefs(useShopifyCart())
    const computedCartTotal = computed(() => cartTotal.value($config.SALECHANNEL))

    return {
      cartTotal,
      cartTotalQuantity,
      computedCartTotal,
      customer,
      customerStore,
      favoritesCount,
      getLocaleFromCurrencyCode,
      shopifyCartStore,
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
            class="block my-0 cmw-font-light text-sm"
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
          <span class="block my-0 cmw-font-light text-sm truncate max-w-100px">
            {{ customer.id ? (customer.firstName || customer.email.split('@')[0]) : $t('navbar.user.signIn') }}
          </span>
        </span>
      </button>
      <button
        class="transition-colors rounded-t py-4 px-8 bg-white hover:(bg-primary-900 text-white)"
        :class="currentComponent === 'cart' ? 'bg-primary-900 text-white' : ''"
        @click="$router.push(localeLocation('/cart'))"
        @mouseenter="handleUserActionMouseEnter('cart')"
        @mouseleave="handleUserActionMouseLeave"
      >
        <span class="flex gap-1 items-center">
          <span v-if="cartTotalQuantity">
            <span class="block text-xxs text-left mb-1">{{ $t('cartTotal') }}</span>
            <i18n-n
              class="flex items-end leading-none" :value="Number(computedCartTotal)"
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
              v-if="!cartTotalQuantity"
              class="block my-0 cmw-font-light text-sm"
            >
              {{ $t('cart') }}
            </span>
            <Badge
              v-if="cartTotalQuantity"
              :qty="cartTotalQuantity"
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
