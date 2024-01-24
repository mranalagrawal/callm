<script lang="ts">
import { computed, defineComponent, ref, useContext, useRoute, useRouter, watch } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'

import cartIcon from '~/assets/svg/cart.svg'
import CustomerWishlist from '~/components/Header/CustomerWishlist.vue'
import { getLocaleFromCurrencyCode } from '~/utilities/currency'
import { useCart } from '~/store/cart'
import { useCustomer } from '~/store/customer'
import userIcon from '~/assets/svg/user.svg'

type TComponents = 'login' | 'cart' | ''

export default defineComponent({
  name: 'UserActions',
  components: { CustomerWishlist },
  setup() {
    const { $cmwStore, localePath } = useContext()
    const route = useRoute()
    const router = useRouter()
    const customerStore = useCustomer()
    const { customer, getCustomerType } = storeToRefs(customerStore)
    const { cartTotalPrice, cartTotalQuantity } = storeToRefs(useCart())

    const currentComponent = ref<TComponents>('')
    const hoveringAction = ref(false)
    const hoveringComponent = ref(false)

    const handleUserActionMouseEnter = (key: TComponents) => {
      setTimeout(() => hoveringAction.value = true, 25)

      if (currentComponent.value === key) { return }

      currentComponent.value = key
    }

    const handleMouseAction = (show = false) => {
      hoveringAction.value = show

      setTimeout(() => {
        if (!hoveringAction.value && !hoveringComponent.value) { currentComponent.value = '' }
      }, 120)
    }

    const handleUserClick = () => {
      router.push(localePath(customer.value.id ? '/profile/my-orders' : '/login'))
    }

    const handleUserActionMouseLeave = () => {
      hoveringAction.value = false

      setTimeout(() => {
        if (hoveringComponent.value) { return }

        if (!hoveringComponent.value && !hoveringAction.value) { currentComponent.value = '' }
      }, 150)
    }

    const lookUpComponent = (k: 'cart' | 'login') => ({
      cart: 'HeaderMiniCart',
      login: 'HeaderLogin',
    })[k]

    const computedCartTotalPrice = computed(() => cartTotalPrice.value($cmwStore.settings.salesChannel, getCustomerType.value))
    const localeFromCurrency = getLocaleFromCurrencyCode($cmwStore.isUk ? 'GBP' : 'EUR')

    watch(() => route.value, () => {
      currentComponent.value = ''
    })

    return {
      cartIcon,
      cartTotalQuantity,
      computedCartTotalPrice,
      currentComponent,
      customer,
      customerStore,
      handleMouseAction,
      handleUserActionMouseEnter,
      handleUserActionMouseLeave,
      handleUserClick,
      localeFromCurrency,
      lookUpComponent,
      userIcon,
    }
  },
})
</script>

<template>
  <div class="relative">
    <div class="relative flex">
      <CustomerWishlist v-if="customer.id" />
      <button
        class="transition-colors rounded-t py-3 px-6 bg-white hover:(bg-primary-900 text-white)"
        :class="{ 'bg-primary-900 text-white': currentComponent === 'login' }"
        @mouseenter="handleUserActionMouseEnter('login')"
        @mouseleave="handleUserActionMouseLeave"
        @click="handleUserClick"
      >
        <span>
          <VueSvgIcon
            class="block"
            :data="userIcon"
            width="32px"
            height="32px"
          />
          <span class="block my-0 cmw-font-light text-sm truncate max-w-100px">
            {{ customer.id ? (customer.firstName || customer.email.split('@')[0]) : $t('common.cta.signIn') }}
          </span>
        </span>
      </button>
      <button
        class="transition-colors rounded-t py-4 px-8 bg-white hover:(bg-primary-900 text-white)"
        :class="currentComponent === 'cart' ? 'bg-primary-900 text-white' : ''"
        @click="$router.push(localePath('/cart'))"
        @mouseenter="handleUserActionMouseEnter('cart')"
        @mouseleave="handleUserActionMouseLeave"
      >
        <span class="flex gap-1 items-center">
          <span v-if="cartTotalQuantity">
            <span class="block text-xxs text-left mb-1">{{ $t('cartTotal') }}</span>
            <i18n-n
              class="flex items-end leading-none" :value="Number(computedCartTotalPrice)"
              :format="{ key: 'currency' }"
              :locale="localeFromCurrency"
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
