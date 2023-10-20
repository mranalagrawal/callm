<script lang="ts">
import type { Ref } from '@nuxtjs/composition-api'
import {
  computed,
  defineComponent,
  inject,
  ref,
  useContext,
  useFetch, useStore,
  watch,
} from '@nuxtjs/composition-api'
import logo from 'assets/svg/logo-call-me-wine.svg'

import emailIcon from 'assets/svg/email.svg'
import paperPlaneIcon from 'assets/svg/paper-plane.svg'
import themeConfig from '~/config/themeConfig'
import { initialPageData } from '~/config/prismicConfig'
import type { IPrismicPageData } from '~/types/prismic'
import { generateKey } from '~/utilities/strings'
import { SweetAlertToast } from '~/utilities/Swal'

export default defineComponent({
  setup() {
    const { i18n, $cmwStore } = useContext()
    const store: any = useStore()
    const isDesktop = inject('isDesktop') as Ref<boolean>
    const footerInfoData = ref<IPrismicPageData>(initialPageData)
    const footerCopyright = computed(() => store.state.footerData.copyright)

    const getNewsletterDiscountByStore = () => ({
      B2B: '3%',
      CMW: '5%',
      CMW_DE: '5%',
      CMW_FR: '5%',
      CMW_UK: '10%',
    }[$cmwStore.settings.store])

    const { fetch } = useFetch(async ({ $cmwRepo }) => {
      footerInfoData.value = await $cmwRepo.prismic.getSingle('footer-info')
    })

    watch(() => i18n.locale, () => fetch(), { deep: true })

    return {
      emailIcon,
      footerCopyright,
      footerInfoData,
      getNewsletterDiscountByStore,
      isDesktop,
      logo,
      paperPlaneIcon,
    }
  },
  data() {
    return {
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
    generateKey,
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
    <ThePreFooter v-if="!$cmwStore.isUk" />
    <div
      v-if="footerInfoData"
      class="bg-secondary text-secondary-100 p-4 mt-4"
    >
      <div class="max-w-screen-xl mx-auto py-4 px-4 mt-4">
        <div v-if="$cmwStore.isIt" class="flex justify-end">
          <NuxtLink
            class="uppercase text-white text-sm mr-3"
            :to="switchLocalePath(themeConfig[$config.STORE].defaultLocale)"
            :class="
              $i18n.locale === themeConfig[$config.STORE].defaultLocale ? 'cmw-font-bold' : ''
            "
          >
            {{ themeConfig[$config.STORE].defaultLocale }}
          </NuxtLink>

          <NuxtLink
            v-if="themeConfig[$config.STORE].defaultLocale !== 'en'"
            class="text-uppercase text-white text-sm mr-3"
            :to="switchLocalePath('en')"
            :class="$i18n.locale === 'en' ? 'cmw-font-bold' : ''"
          >
            EN
          </NuxtLink>
          <NuxtLink
            v-else
            class="uppercase text-white text-sm mr-3"
            :to="switchLocalePath('it')"
            :class="$i18n.locale === 'it' ? 'cmw-font-bold' : ''"
          >
            IT
          </NuxtLink>
        </div>
        <div>
          <VueSvgIcon :data="logo" color="white" width="180" height="auto" />
          <p class="mt-2 text-sm text-secondary-100" v-text="$t('common.footer.tagline')" />
        </div>
        <div class="grid gap-8 mt-4 md:grid-cols-2">
          <div>
            <VueSvgIcon :data="emailIcon" class="mr-2" color="white" width="30" height="30" />
            <span class="text-secondary-100 text-sm">{{ $t('newsletter.label') }}</span>
            <p class="text-secondary-100" v-text="$t('newsletter.offer', { discount: getNewsletterDiscountByStore() })" />
            <form class="mb-4" @submit.prevent="handleSubmit">
              <div class="flex gap-2 items-stretch p-2 border border-gray-light rounded md:rounded-2xl">
                <label for="newsletter-email" class="sr-only">newsletter-email</label>
                <input
                  id="newsletter-email"
                  v-model="email"
                  aria-label="enter email"
                  type="email"
                  class="flex-1 bg-transparent text-white"
                  required
                >
                <CmwButton
                  v-if="isDesktop"
                  size="xs"
                  type="submit"
                  class="w-max ml-auto justify-end  md:(px-8 py-[0.6rem])"
                  variant="default-inverse"
                  :label="$t('common.cta.subscribe')"
                />
                <ButtonIcon v-else type="submit" :icon="paperPlaneIcon" variant="filled-white" class="!border-white" color="white" width="30" height="30" />
              </div>
              <div class="mt-3">
                <CmwCheckbox
                  id="newsletter-footer-checkbox"
                  v-model="newsletter"
                  :checked="newsletter"
                  is-required
                  theme="dark"
                  @change="newsletter = !newsletter"
                >
                  <template #label>
                    <i18n
                      class="block text-xs"
                      path="newsletter.splash.acceptMarketing"
                      tag="span"
                    >
                      <span
                        class="font-sans cmw-font-bold tracking-normal"
                        v-text="$t('newsletter.splash.privacyPolicy')"
                      />
                    </i18n>
                  </template>
                </CmwCheckbox>
                <i18n
                  class="block text-xs col-span-full"
                  path="newsletter.splash.readMore"
                  tag="span"
                >
                  <NuxtLink :to="localePath('/privacy')" class="text-xs text-white underline hover:(text-primary)">
                    {{ $t('newsletter.splash.privacyPolicy') }}
                  </NuxtLink>
                </i18n>
              </div>
            </form>
          </div>
          <div class="grid gap-4 md:grid-cols-3 text-sm">
            <div class="flex flex-col gap-2">
              <div class="h5 !text-secondary-100 mb-4">
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
              <div class="h5 !text-secondary-100 mb-4">
                {{ $t('footer.services') }}
              </div>
              <NuxtLink
                :to="localePath('/restaurants-wineshops')"
                class="block text-white"
              >
                {{ $t('footer.restaurantsAndWineShops') }}
              </NuxtLink>
              <NuxtLink
                v-if="$cmwStore.isIt || $cmwStore.isB2b"
                :to="localePath('/corporate-gifts')"
                class="block text-white"
              >
                {{ $t('footer.corporateGifts') }}
              </NuxtLink>
              <NuxtLink
                :to="localePath('/gift-cards')"
                class="block text-white"
              >
                {{ $t('footer.giftCards') }}
              </NuxtLink>
              <NuxtLink
                v-if="$cmwStore.isIt || $cmwStore.isB2b"
                :to="localePath('/guide-to-our-wines')"
                class="block text-white"
              >
                {{ $t('footer.guideToOurWines') }}
              </NuxtLink>
            </div>
            <div class="flex flex-col gap-2">
              <div class="h5 !text-secondary-100 mb-4">
                {{ $t('footer.support') }}
              </div>
              <NuxtLink
                :to="localePath('/shipping')"
                class="block text-white"
              >
                {{ $t('footer.shipping') }}
              </NuxtLink>
              <NuxtLink
                :to="localePath('/payments')"
                class="block text-white"
              >
                {{ $t('footer.payments') }}
              </NuxtLink>
              <NuxtLink
                :to="localePath('/terms-of-sales')"
                class="block text-white"
              >
                {{ $t('footer.termsOfSales') }}
              </NuxtLink>
              <NuxtLink
                :to="localePath('/privacy')"
                class="block text-white"
              >
                Privacy policy
              </NuxtLink>
              <NuxtLink
                :to="localePath('/contact')"
                class="block text-white"
              >
                {{ $t('footer.contacts') }}
              </NuxtLink>
              <Iubenda />
            </div>
          </div>
        </div>
        <FooterSocials />

        <hr class="bg-secondary-800 my-4 border-0 h-px">

        <FooterPaymentMethods />

        <hr class="bg-secondary-800 my-4 border-0 h-px">
        <PrismicRichText v-if="footerCopyright" class="sm:w-[min(100%,_80%)] m-inline-auto prose dark text-secondary-100 text-center text-xs" :field="footerCopyright" />
      </div>
    </div>
  </footer>
</template>
