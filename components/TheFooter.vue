<script lang="ts">
import { defineComponent, inject, ref, useFetch } from '@nuxtjs/composition-api'
import logo from 'assets/svg/logo-call-me-wine.svg'
import walletIcon from 'assets/svg/wallet.svg'
import emailIcon from 'assets/svg/email.svg'
import themeConfig from '~/config/themeConfig'
import { SweetAlertToast } from '~/utilities/Swal'

export default defineComponent({
  setup() {
    const isDesktop = inject('isDesktop')
    const footerData = ref([])
    const footerInfoData = ref({
      description: '',
      newsletter_cta: '',
      first_check: '',
      second_check: '',
      info: '',
    })

    useFetch(async ({
      $cmwRepo,
      $handleApiErrors,
    }) => {
      await $cmwRepo.prismic.getSingle({ page: 'footer' })
        .then(({ data }) => {
          footerData.value = data
        })
        .catch((err: Error) => $handleApiErrors(`Catch getting contact us data from prismic: ${err}`))

      await $cmwRepo.prismic.getSingle({ page: 'footer-info' })
        .then(({ data }) => {
          footerInfoData.value = data
        })
        .catch((err: Error) => $handleApiErrors(`Catch getting contact us data from prismic: ${err}`))
    })

    return {
      footerData,
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
  watch: {
    '$i18n.locale': '$fetch',
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
  <footer class="cmw-bg-gray-light print:cmw-hidden">
    <div v-if="!!footerData.length && $config.STORE !== 'CMW_UK'" class="md:cmw-px-4">
      <div class="cmw-h2 cmw-text-center cmw-my-4 cmw-pt-4">
        {{ $t('footer.explore') }}
      </div>
      <div v-if="!isDesktop">
        <div v-for="item in footerData" :key="item.id">
          <NuxtLink
            :to="localePath(item?.primary?.link || '/')"
            class="cmw-text-uppercase"
          >
            {{ item?.primary?.title }}
          </NuxtLink>
          <hr>
        </div>
      </div>
      <div v-else class="cmw-flex">
        <div v-for="item in footerData" :key="item.id">
          <NuxtLink
            :to="localePath(item?.primary?.link || '/')"
            style="color: #176a62"
            class="cmw-block cmw-text-uppercase cmw-no-underline cmw-pb-8"
          >
            {{ item?.primary?.title }}
          </NuxtLink>
          <p
            v-for="link in item.items"
            :key="`inner_${link.name}`"
            class="cmw-pb-0"
          >
            <NuxtLink
              :to="localePath(link?.link || '/')"
              class="cmw-no-underline secondary-title"
            >
              {{ link?.name }}
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>

    <div
      v-if="footerInfoData"
      class="cmw-bg-secondary cmw-text-secondary-100 cmw-p-4 cmw-mt-4"
    >
      <div class="cmw-max-w-screen-xl cmw-mx-auto cmw-py-4 cmw-px-4 cmw-mt-4">
        <div v-if="$config.STORE === 'CMW'" class="cmw-flex cmw-justify-end">
          <NuxtLink
            class="cmw-no-underline cmw-uppercase cmw-text-white cmw-text-sm mr-3"
            :to="switchLocalePath(themeConfig[$config.STORE].defaultLocale)"
            :class="
              $i18n.locale === themeConfig[$config.STORE].defaultLocale ? 'font-weight-bold' : ''
            "
          >
            {{ themeConfig[$config.STORE].defaultLocale }}
          </NuxtLink>

          <NuxtLink
            v-if="themeConfig[$config.STORE].defaultLocale !== 'en'"
            class="cmw-no-underline text-uppercase cmw-text-white cmw-text-sm mr-3"
            :to="switchLocalePath('en')"
            :class="$i18n.locale === 'en' ? 'font-weight-bold' : ''"
          >
            EN
          </NuxtLink>
          <NuxtLink
            v-else
            class="cmw-no-underline cmw-uppercase cmw-text-white cmw-text-sm cmw-mr-3"
            :to="switchLocalePath('it')"
            :class="$i18n.locale === 'it' ? 'font-weight-bold' : ''"
          >
            IT
          </NuxtLink>
        </div>
        <div>
          <VueSvgIcon :data="logo" color="white" width="180" height="auto" />
          <p class="cmw-mt-2 cmw-text-sm cmw-text-secondary-100" v-text="footerInfoData.description" />
        </div>
        <div class="cmw-grid cmw-gap-8 cmw-mt-4 md:cmw-grid-cols-2">
          <div>
            <VueSvgIcon :data="emailIcon" class="cmw-mr-2" color="white" width="30" height="30" />
            <span class="cmw-text-secondary-100 cmw-text-sm">{{ $t('newsletter.label') }}</span>
            <p class="cmw-text-secondary-100">
              {{ footerInfoData.newsletter_cta }}
            </p>
            <form class="cmw-mb-4" @submit.prevent="handleSubmit">
              <div class="cmw-flex cmw-gap-2 cmw-items-stretch cmw-p-2 cmw-border cmw-border-gray-light cmw-rounded-sm">
                <input
                  v-model="email"
                  aria-label="enter email"
                  type="email"
                  class="cmw-flex-1 cmw-bg-transparent cmw-text-white"
                  required
                >
                <Button
                  size="xs"
                  type="submit"
                  class="cmw-w-max cmw-ml-auto cmw-justify-end"
                  variant="default-inverse"
                  :label="$t('common.cta.subscribe')"
                />
              </div>
              <div class="cmw-mt-3">
                <div class="custom-checkbox">
                  <input
                    id="customCheck1"
                    v-model="newsletter"
                    type="checkbox"
                    class="custom-control-input"
                    required
                  >
                  <label
                    class="custom-control-label cmw-text-sm cmw-pl-3"
                    for="customCheck1"
                  >{{ footerInfoData.first_check }}
                    <NuxtLink :to="localePath('/privacy')" class="cmw-no-underline cmw-text-white hover:(cmw-text-white cmw-no-underline)">Privacy Policy</NuxtLink></label>
                </div>
                <div v-show="newsletter" class="cmw-mt-3">
                  <div class="custom-checkbox">
                    <input
                      id="customCheck2"
                      v-model="marketing"
                      type="checkbox"
                      class="custom-control-input"
                    >
                    <label
                      class="custom-control-label cmw-relative cmw-text-sm cmw-pl-3"
                      for="customCheck2"
                    >{{ footerInfoData.second_check }}
                      <NuxtLink :to="localePath('/privacy')" class="cmw-no-underline cmw-text-white hover:(cmw-text-white cmw-no-underline)">Privacy Policy</NuxtLink></label>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="cmw-grid cmw-gap-4 md:cmw-grid-cols-3 cmw-text-sm">
            <div class="cmw-flex cmw-flex-col cmw-gap-2">
              <div class="cmw-h5 cmw-text-secondary-100 cmw-mb-4">
                {{ $t('footer.company') }}
              </div>
              <NuxtLink
                :to="localePath('/about-us')"
                class="cmw-block cmw-no-underline cmw-text-white hover:(cmw-text-white cmw-no-underline)"
              >
                {{ $t('footer.who') }}
              </NuxtLink>
            </div>
            <div class="cmw-flex cmw-flex-col cmw-gap-2">
              <div class="cmw-h5 cmw-text-secondary-100 cmw-mb-4">
                {{ $t('footer.services') }}
              </div>
              <NuxtLink
                :to="localePath('/restaurants-wineshops')"
                class="cmw-block cmw-no-underline cmw-text-white hover:(cmw-text-white cmw-no-underline)"
              >
                {{ $t('footer.restaurantsAndWineshops') }}
              </NuxtLink>
            </div>
            <div class="cmw-flex cmw-flex-col cmw-gap-2">
              <div class="cmw-h5 cmw-text-secondary-100 cmw-mb-4">
                {{ $t('footer.support') }}
              </div>
              <NuxtLink
                :to="localePath('/shipping')"
                class="cmw-block cmw-no-underline cmw-text-white hover:(cmw-text-white cmw-no-underline)"
              >
                {{ $t('footer.shipping') }}
              </NuxtLink>
              <NuxtLink
                :to="localePath('/payments')"
                class="cmw-block cmw-no-underline cmw-text-white hover:(cmw-text-white cmw-no-underline)"
              >
                {{ $t('footer.payments') }}
              </NuxtLink>
              <NuxtLink
                :to="localePath('/terms-of-sales')"
                class="cmw-block cmw-no-underline cmw-text-white hover:(cmw-text-white cmw-no-underline)"
              >
                {{ $t('footer.termsOfSales') }}
              </NuxtLink>
              <NuxtLink
                :to="localePath('/privacy')"
                class="cmw-block cmw-no-underline cmw-text-white hover:(cmw-text-white cmw-no-underline)"
              >
                Privacy policy
              </NuxtLink>
              <NuxtLink
                :to="localePath('/cookie')"
                class="cmw-block cmw-no-underline cmw-text-white hover:(cmw-text-white cmw-no-underline)"
              >
                Cookie policy
              </NuxtLink>
              <NuxtLink
                :to="localePath('/contact')"
                class="cmw-block cmw-no-underline cmw-text-white hover:(cmw-text-white cmw-no-underline)"
              >
                {{ $t('footer.contacts') }}
              </NuxtLink>
            </div>
          </div>
        </div>
        <FooterSocials />

        <hr class="cmw-bg-secondary-800">

        <div class="md:cmw-flex cmw-text-center cmw-justify-center">
          <div class="cmw-flex cmw-gap-2 cmw-items-center cmw-justify-center">
            <VueSvgIcon :data="walletIcon" color="white" width="30" height="30" />
            <span>{{ $t('footer.paymentMethods') }}</span>
          </div>
          <div
            class="cmw-grid cmw-grid-cols-3 md:cmw-grid-cols-6 cmw-justify-items-center cmw-items-center cmw-content-center cmw-px-8 cmw-py-4"
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
              src="https://x.klarnacdn.net/payment-method/assets/badges/generic/klarna.png"
              width="65"
              height="36"
              alt="Klarna logo"
            >
          </div>
        </div>

        <hr class="cmw-bg-secondary-800">
        <div class="cmw-text-center cmw-mt-4 cmw-text-xs cmw-text-secondary-100 cmw-px-4">
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
