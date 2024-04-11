<script lang="ts">
import {
  computed,
  defineComponent,
  inject,
  toRefs,
  useContext,
  useRoute,
  useStore,
} from '@nuxtjs/composition-api'
import type { Ref } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'

import { useLayout } from '~/store/layout'

import logo from '~/assets/svg/logo-call-me-wine.svg'

export default defineComponent({
  setup() {
    const { getRouteBaseName } = useContext()
    const { footer } = storeToRefs(useLayout())
    const { copyright } = toRefs(footer.value)
    const store: any = useStore()
    const route = useRoute()
    const isDesktop = inject('isDesktop') as Ref<boolean>

    const isFromApp = computed(() => store.state.headers.fromApp)
    const isHomePage = computed(() => getRouteBaseName(route.value) === 'index')

    return {
      copyright,
      isDesktop,
      isFromApp,
      isHomePage,
      logo,
    }
  },
})
</script>

<template>
  <footer v-if="!isFromApp || (isFromApp && isHomePage)" class="bg-gray-lightest print:hidden">
    <ThePreFooter v-if="!$cmwStore.isUk && !isFromApp" />
    <div class="bg-secondary text-secondary-100 p-4 mt-4">
      <div class="max-w-screen-xl mx-auto py-4 px-4 mt-4">
        <div v-if="$cmwStore.isIt" class="flex justify-end">
          <NuxtLink
            class="uppercase text-white text-sm mr-3"
            :to="switchLocalePath($cmwStore.settings.defaultLocale)"
            :class="
              $i18n.locale === $cmwStore.settings.defaultLocale ? 'cmw-font-bold' : ''
            "
          >
            {{ $cmwStore.settings.defaultLocale }}
          </NuxtLink>

          <NuxtLink
            v-if="$cmwStore.settings.defaultLocale !== 'en'"
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
          <ClientOnly>
            <FooterNewsletter />
          </ClientOnly>
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
              <NuxtLink
                v-if="$i18n.locale === 'it'"
                :to="localePath('/faq')"
                class="block text-white"
              >
                {{ $t('footer.faq') }}
              </NuxtLink>
            </div>
            <div class="flex flex-col gap-2">
              <div class="h5 !text-secondary-100 mb-4">
                {{ $t('footer.services') }}
              </div>
              <NuxtLink
                v-if="!$cmwStore.isUk"
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
        <FooterSocialsAndMobileApps />

        <hr class="bg-secondary-800 my-4 border-0 h-px">

        <FooterPaymentMethods />

        <hr class="bg-secondary-800 my-4 border-0 h-px">
        <div
          v-if="copyright"
          class="sm:w-[min(100%,_80%)] m-inline-auto prose dark text-secondary-100 text-center text-xs"
          v-text="copyright"
        />
      </div>
    </div>
  </footer>
</template>
