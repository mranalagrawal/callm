<script>
import { mapGetters } from 'vuex'
import { storeToRefs } from 'pinia'
import heartIcon from '~/assets/svg/heart.svg'
import userIcon from '~/assets/svg/user.svg'
import cartIcon from '~/assets/svg/cart.svg'
import { useCustomer } from '~/store/customer'

export default {
  name: 'UserActions',
  setup() {
    const customerStore = useCustomer()
    const { customer, favoritesCount } = storeToRefs(customerStore)

    return { customerStore, customer, favoritesCount }
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
      }, 50)
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
  <div class="cmw-relative">
    <div class="position-relative d-flex">
      <NuxtLink
        v-if="customer.id"
        :to="localePath('/profile/wishlist')"
        class="peer cmw-transition-colors cmw-rounded cmw-py-4 cmw-px-8 cmw-bg-white cmw-text-center cmw-text-body hover:(cmw-bg-primary-900 cmw-text-white cmw-no-underline)"
        @mouseenter.native="hoveringColor = 'white'"
        @mouseleave.native="hoveringColor = 'primary-400'"
      >
        <span class="cmw-relative">
          <VueSvgIcon
            class="cmw-block"
            :data="heartIcon"
            width="32px"
            height="32px"
          />
          <span
            class="cmw-block cmw-my-0 cmw-font-light cmw-text-sm"
            v-text="$t('navbar.favorites')"
          />
          <Badge
            v-if="favoritesCount"
            :qty="favoritesCount"
            :bg-color="hoveringColor"
            class="cmw-transform cmw-absolute cmw-top-[-6px] cmw-right-[-4px]"
          />
        </span>
      </NuxtLink>
      <button
        class="cmw-transition-colors cmw-rounded-t cmw-py-4 cmw-px-8 cmw-bg-white hover:(cmw-bg-primary-900 cmw-text-white)"
        :class="{ 'cmw-bg-primary-900 cmw-text-white': currentComponent === 'login' }"
        @mouseenter="handleUserActionMouseEnter('login')"
        @mouseleave="handleUserActionMouseLeave"
      >
        <span>
          <VueSvgIcon
            class="cmw-block"
            :data="userIcon"
            width="32px"
            height="32px"
          />
          <span class="cmw-block cmw-my-0 cmw-font-light cmw-text-sm">
            {{
              customer.id
                ? customer.firstName.split(" ")[0]
                : $t("navbar.user.signIn")
            }}
          </span>
        </span>
      </button>
      <button
        class="cmw-transition-colors cmw-rounded-t cmw-py-4 cmw-px-8 cmw-bg-white hover:(cmw-bg-primary-900 cmw-text-white)"
        :class="currentComponent === 'cart' ? 'cmw-bg-primary-900 cmw-text-white' : ''"
        @mouseenter="handleUserActionMouseEnter('cart')"
        @mouseleave="handleUserActionMouseLeave"
      >
        <span class="cmw-flex cmw-gap-1 cmw-items-center">
          <span v-if="cartItems">
            <span class="cmw-block cmw-text-xxs cmw-text-left cmw-mb-1">{{ $t('cartTotal') }}</span>
            <span class="cmw-flex cmw-items-end cmw-leading-none">
              <span class="cmw-text-2xl">{{ cartTotalAmountObj.integer }}</span>
              <span>{{ cartTotalAmountObj.separator }}</span>
              <span>{{ cartTotalAmountObj.decimal }}€</span>
            </span>
          </span>
          <span class="cmw-relative">
            <VueSvgIcon
              class="cmw-block"
              :data="cartIcon"
              width="32px"
              height="32px"
            />
            <span
              v-if="!cartItems"
              class="cmw-block cmw-my-0 cmw-font-light cmw-text-sm"
            >
              {{ $t("cart") }}
            </span>
            <Badge
              v-if="cartItems"
              :qty="cartItems"
              :bg-color="currentComponent === 'cart' ? 'white' : 'primary-400'"
              class="cmw- transform cmw-absolute cmw-top-[-10px] cmw-right-[-10px]"
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
        cmw-absolute cmw-transform cmw-rounded-b cmw-transition-transform-opacity cmw-bottom-0 cmw-right-0 cmw-bg-white cmw-w-auto cmw-translate-x-0 cmw-translate-y-full
        cmw-overflow-hidden cmw-z-base cmw-shadow"
        :class="currentComponent === 'cart' ? 'cmw-rounded-tl' : 'cmw-rounded-t'"
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
