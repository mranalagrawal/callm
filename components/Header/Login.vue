<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'

import type { TranslateResult } from 'vue-i18n'

import eyeHideIcon from '~/assets/svg/eye-hide.svg'
import eyeShowIcon from '~/assets/svg/eye-show.svg'
import socialFacebook from '~/assets/svg/social-facebook.svg'
import socialGoogle from '~/assets/svg/social-google.svg'
import { useCustomer } from '~/store/customer'

export default defineComponent({
  name: 'HeaderLogin',
  props: {
    show: {
      type: [Boolean],
    },
  },
  setup() {
    const customerStore = useCustomer()
    const { customer } = storeToRefs(customerStore)
    const { logout } = customerStore
    const isSubmitting = ref(false)
    const passwordIsVisible = ref(false)
    const message = ref<TranslateResult>('')
    const form = ref({
      email: '',
      password: '',
    })

    return {
      customer,
      customerStore,
      eyeHideIcon,
      eyeShowIcon,
      form,
      isSubmitting,
      logout,
      message,
      passwordIsVisible,
      socialFacebook,
      socialGoogle,
    }
  },
  userNavigation: [
    {
      to: '/profile/my-orders',
      label: 'navbar.user.myOrders',
    },
    {
      to: '/profile/buy-again',
      label: 'navbar.user.buyAgain',
    },
    {
      to: '/profile/wishlist',
      label: 'navbar.user.favorites',
    },
    {
      to: '/profile/addresses',
      label: 'navbar.user.addresses',
    },
    {
      to: '/profile/access-data',
      label: 'navbar.user.accessData',
    },
    {
      to: '/profile/billing',
      label: 'navbar.user.billing',
    },
  ],
})
</script>

<template>
  <div>
    <div class="border-t-4 border-t-primary-900 py-4 px-6">
      <template v-if="!customer.id">
        <CmwButton variant="default" :to="localePath('/login')" class="mt-8">
          {{ $t('common.cta.signIn') }}
        </CmwButton>

        <NuxtLink
          to="/recover"
          class="block w-max my-3 mx-auto text-primary-400"
        >
          {{ $t("navbar.user.forgotPassword") }}
        </NuxtLink>
        <div class="text-center">
          <a v-if="$cmwStore.isIt" class="my-8 cmw-font-bold text-secondary-400" href="https://b2b.callmewine.com">PORTALE
            OPERATORI HO.RE.CA.</a>
        </div>
        <template v-if="!$cmwStore.isB2b">
          <p class="text-center my-5">
            {{ $t('navbar.user.orLoginWith') }}
          </p>
          <div class="flex justify-center ">
            <a
              :href="`${$config.MULTIPASS_URL}/social-login/${$config.STORE}/facebook/`"
              class="btn-base p-2 w-auto btn-default facebook text-sm btn-base-spacing mr-3"
            >
              <VueSvgIcon :data="socialFacebook" width="1.75rem" height="auto" />
            </a>
            <a
              :href="`${$config.MULTIPASS_URL}/social-login/${$config.STORE}/google/`"
              class="btn-base p-2  w-auto btn-default google text-sm btn-base-spacing"
            >
              <VueSvgIcon :data="socialGoogle" original width="1.75rem" height="auto" />
            </a>
          </div>
        </template>
      </template>
      <template v-else>
        <nav class="min-w-[425px]">
          <NuxtLink
            v-for="({ to, label }) in $options.userNavigation"
            :key="to"
            :to="localePath(to)"
            class="block mb-4 w-max text-body hover:(text-primary cmw-font-bold)"
          >
            {{ $t(label) }}
          </NuxtLink>
          <div class="mt-5">
            <CmwButton
              variant="ghost"
              @click.native="logout"
            >
              {{ $t("common.cta.logout") }}
            </CmwButton>
          </div>
        </nav>
      </template>
    </div>
    <span v-if="!customer.id" class="min-w-[425px] bg-gray-lightest py-4 flex justify-center gap-4 text-sm px-8 w-max">
      <span>{{ $t('navbar.user.notRegisteredYet') }}</span>
      <NuxtLink variant="text" class="w-max inline-block" :to="localePath('/register')">
        <strong class="text-primary-400 uppercase" v-text="$t('common.cta.register')" />
      </NuxtLink>
    </span>
  </div>
</template>

<style scoped>
  .facebook {
    background-color: #004bce !important;
    text-transform: unset;
  }
  .google {
    background-color: #fff !important;
    text-transform: unset;
    color: black;
    border: 1px solid black !important;
  }
</style>
