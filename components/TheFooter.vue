<script lang="ts">
import { defineComponent, inject, ref, useFetch } from '@nuxtjs/composition-api'
import logo from 'assets/svg/logo-call-me-wine.svg'
import walletIcon from 'assets/svg/wallet.svg'
import emailIcon from 'assets/svg/email.svg'
import themeConfig from '~/config/themeConfig'
import { initialPageData } from '~/types/prismic'
import type { IPrismicPageData } from '~/types/prismic'
import { SweetAlertToast } from '~/utilities/Swal'

export default defineComponent({
  setup() {
    const isDesktop = inject('isDesktop')
    const footerInfoData = ref<IPrismicPageData>(initialPageData)

    useFetch(async ({
      $cmwRepo,
      $handleApiErrors,
    }) => {
      await $cmwRepo.prismic.getSingle({ page: 'footer-info' })
        .then((data) => {
          footerInfoData.value = data
        })
        .catch((err: Error) => $handleApiErrors(`Catch getting contact us data from prismic: ${err}`))
    })

    return {
      footerInfoData,
      isDesktop,
    }
  },
  data() {
    return {
      logo,
      walletIcon,
      emailIcon,
      newsletter: false,
      marketing: false,
      email: '',
    }
  },
  computed: {
    themeConfig() {
      return themeConfig
    },
  },
  methods: {
    async handleSubmit() {
      await this.$cmw.$post('/customers/subscribe-nl', {
        email: this.email,
      })
        .then(({ data }: any) => {
          const {
            errors = {},
            customer = {},
            nlSent = false,
          } = data

          if (Object.keys(errors).length) {
            SweetAlertToast.fire({
              icon: 'error',
              text: errors.email,
            })
            return
          }

          if (nlSent) {
            this.$gtm.push({
              event: 'newsletterSubscription',
              leadId: customer.id,
              userEmail: this.email,
            })

            SweetAlertToast.fire({
              icon: 'success',
              text: this.$i18n.t('common.feedback.OK.newsletterSubscribed'),
            })
          } else {
            SweetAlertToast.fire({
              icon: 'warning',
              text: this.$i18n.t('common.feedback.KO.newsletterSubscribed'),
            })
          }

          this.email = ''
        })
        .catch((err) => {
          this.$sentry.captureException(new Error((`Catch on newsletterSubscription: ${err}`)))
          SweetAlertToast.fire({
            icon: 'error',
            text: this.$i18n.t('common.feedback.KO.unknown'),
          })
        })
    },
  },
})
</script>

<template>
  <footer class="bg-gray-lightest print:hidden">
    <ThePreFooter v-if="$config.STORE !== 'CMW_UK'" />
    <div
      v-if="footerInfoData"
      class="bg-secondary text-secondary-100 p-4 mt-4"
    >
      <div class="max-w-screen-xl mx-auto py-4 px-4 mt-4">
        <div v-if="$config.STORE === 'CMW'" class="flex justify-end">
          <NuxtLink
            class="uppercase text-white text-sm mr-3"
            :to="switchLocalePath(themeConfig[$config.STORE].defaultLocale)"
            :class="
              $i18n.locale === themeConfig[$config.STORE].defaultLocale ? 'font-bold' : ''
            "
          >
            {{ themeConfig[$config.STORE].defaultLocale }}
          </NuxtLink>

          <NuxtLink
            v-if="themeConfig[$config.STORE].defaultLocale !== 'en'"
            class="text-uppercase text-white text-sm mr-3"
            :to="switchLocalePath('en')"
            :class="$i18n.locale === 'en' ? 'font-bold' : ''"
          >
            EN
          </NuxtLink>
          <NuxtLink
            v-else
            class="uppercase text-white text-sm mr-3"
            :to="switchLocalePath('it')"
            :class="$i18n.locale === 'it' ? 'font-bold' : ''"
          >
            IT
          </NuxtLink>
        </div>
        <div>
          <VueSvgIcon :data="logo" color="white" width="180" height="auto" />
          <p class="mt-2 text-sm text-secondary-100" v-text="footerInfoData.description" />
        </div>
        <div class="grid gap-8 mt-4 md:grid-cols-2">
          <div>
            <VueSvgIcon :data="emailIcon" class="mr-2" color="white" width="30" height="30" />
            <span class="text-secondary-100 text-sm">{{ $t('newsletter.label') }}</span>
            <p class="text-secondary-100">
              {{ footerInfoData.newsletter_cta }}
            </p>
            <form class="mb-4" @submit.prevent="handleSubmit">
              <div class="flex gap-2 items-stretch p-2 border border-gray-light rounded-sm">
                <label for="newsletter-email" class="sr-only">newsletter-email</label>
                <input
                  id="newsletter-email"
                  v-model="email"
                  aria-label="enter email"
                  type="email"
                  class="flex-1 bg-transparent text-white"
                  required
                >
                <Button
                  size="xs"
                  type="submit"
                  class="w-max ml-auto justify-end"
                  variant="default-inverse"
                  :label="$t('common.cta.subscribe')"
                />
              </div>
              <div class="mt-3">
                <div class="custom-checkbox">
                  <input
                    id="customCheck1"
                    v-model="newsletter"
                    type="checkbox"
                    class="custom-control-input"
                    required
                  >
                  <label
                    class="custom-control-label text-sm pl-3"
                    for="customCheck1"
                  >{{ footerInfoData.first_check }}
                    <NuxtLink :to="localePath('/privacy')" class="text-white">Privacy Policy</NuxtLink></label>
                </div>
                <div v-show="newsletter" class="mt-3">
                  <div class="custom-checkbox">
                    <input
                      id="customCheck2"
                      v-model="marketing"
                      type="checkbox"
                      class="custom-control-input"
                    >
                    <label
                      class="custom-control-label relative text-sm pl-3"
                      for="customCheck2"
                    >{{ footerInfoData.second_check }}
                      <NuxtLink :to="localePath('/privacy')" class="text-white">Privacy Policy</NuxtLink></label>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="grid gap-4 md:grid-cols-3 text-sm">
            <div class="flex flex-col gap-2">
              <div class="h5 text-secondary-100 mb-4">
                {{ $t('footer.company') }}
              </div>
              <NuxtLink
                :to="localePath('/about-us')"
                class="block text-white"
              >
                {{ $t('footer.who') }}
              </NuxtLink>
              <NuxtLink
                :to="localePath('/sustainability')"
                class="block text-white"
              >
                {{ $t('footer.sustainability') }}
              </NuxtLink>
            </div>
            <div class="flex flex-col gap-2">
              <div class="h5 text-secondary-100 mb-4">
                {{ $t('footer.services') }}
              </div>
              <NuxtLink
                :to="localePath('/restaurants-wineshops')"
                class="block  text-white"
              >
                {{ $t('footer.restaurantsAndWineshops') }}
              </NuxtLink>
            </div>
            <div class="flex flex-col gap-2">
              <div class="h5 text-secondary-100 mb-4">
                {{ $t('footer.support') }}
              </div>
              <NuxtLink
                :to="localePath('/shipping')"
                class="block  text-white"
              >
                {{ $t('footer.shipping') }}
              </NuxtLink>
              <NuxtLink
                :to="localePath('/payments')"
                class="block  text-white"
              >
                {{ $t('footer.payments') }}
              </NuxtLink>
              <NuxtLink
                :to="localePath('/terms-of-sales')"
                class="block  text-white"
              >
                {{ $t('footer.termsOfSales') }}
              </NuxtLink>
              <NuxtLink
                :to="localePath('/privacy')"
                class="block  text-white"
              >
                Privacy policy
              </NuxtLink>
              <NuxtLink
                :to="localePath('/cookie')"
                class="block  text-white"
              >
                Cookie policy
              </NuxtLink>
              <NuxtLink
                :to="localePath('/contact')"
                class="block  text-white"
              >
                {{ $t('footer.contacts') }}
              </NuxtLink>
            </div>
          </div>
        </div>
        <FooterSocials />

        <hr class="bg-secondary-800 my-4 border-0 h-px">

        <div class="md:flex text-center justify-center">
          <div class="flex gap-2 items-center justify-center">
            <VueSvgIcon :data="walletIcon" color="white" width="30" height="30" />
            <span>{{ $t('footer.paymentMethods') }}</span>
          </div>
          <div
            class="grid grid-cols-3 md:grid-cols-6 justify-items-center items-center content-center px-8 py-4"
          >
            <img
              src="https://cdn.shopify.com/s/files/1/0578/7497/2719/files/american-express.png?v=1677682511&format=webp"
              width="65"
              height="64"
              alt="american express logo"
            >
            <img
              src="../assets/images/mastercard.png"
              width="65"
              height="64"
              alt="mastercard logo"
            >
            <img
              src="../assets/images/visa.png"
              width="65"
              height="64"
              alt="visa logo"
            >
            <img
              src="../assets/images/comodo.png"
              width="65"
              height="64"
              alt="comodo logo"
            >
            <img
              v-if="$config.STORE === 'CMW_UK'"
              src="https://x.klarnacdn.net/payment-method/assets/badges/generic/klarna.png"
              width="65"
              height="36"
              alt="Klarna logo"
            >
          </div>
        </div>

        <hr class="bg-secondary-800 my-4 border-0 h-px">
        <div class="text-center mt-4 text-xs text-secondary-100 px-4">
          {{ footerInfoData.info }}
        </div>
      </div>
    </div>
  </footer>
</template>

 <style scoped>
.custom-control-label:before {
  background-color: transparent;
  border-radius: 2px;
  border: 2px solid #add3d1;
  width: 18px;
  height: 18px;
}
.custom-control-label::after {
  width: 18px;
  height: 18px;
}

.custom-checkbox .custom-control-input:checked ~ .custom-control-label::before {
  background-color: transparent;
  border-color: #add3d1;
}
</style>
