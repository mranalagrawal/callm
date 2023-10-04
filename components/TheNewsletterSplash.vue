<script lang="ts">
import { defineComponent, ref, useContext } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'
import logo from '~/assets/svg/logo-call-me-wine.svg'
import bannerSplashNewsletter from '~/assets/images/banner-splash-newsletter.jpg'
import { useCustomer } from '~/store/customer'
import { useSplash } from '~/store/splash'
import { SweetAlertToast } from '~/utilities/Swal'

export default defineComponent({
  setup() {
    const { i18n, $cmw, $gtm, $handleApiErrors } = useContext()
    const splash = useSplash()
    const customerStore = useCustomer()
    const { customer } = storeToRefs(customerStore)
    const formEl = ref<HTMLFormElement | null>(null)
    const formData = ref({
      email: '',
      acceptsMarketing: false,
      // profiling: false,
    })

    const onSubmit = async () => {
      if (!formEl.value) { return }

      const { isValid } = await formEl.value.validateWithInfo()

      if (isValid) {
        await $cmw.$post('/customers/subscribe-nl', {
          email: formData.value.email ? formData.value.email : customer.value.email,
        })
          .then(({ data }: unknown | any) => {
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
              $gtm.push({
                event: 'newsletterSubscription',
                leadId: customer.id,
                userEmail: formData.value.email,
              })

              SweetAlertToast.fire({
                icon: 'success',
                text: i18n.t('common.feedback.OK.newsletterSubscribed'),
              })
            } else {
              SweetAlertToast.fire({
                icon: 'warning',
                text: i18n.t('common.feedback.KO.newsletterSubscribed'),
              })
            }

            splash.$reset()
            formData.value.email = ''
          })
          .catch((err: Error) => $handleApiErrors(`Catch on newsletterSubscription: ${err}`))
      }
    }

    return { customer, logo, bannerSplashNewsletter, formData, formEl, onSubmit }
  },
})
</script>

<template>
  <div>
    <div class="text-center">
      <VueSvgIcon
        class="text-center"
        :data="logo"
        width="200"
        height="auto"
        original
      />
    </div>
    <p class="text-sm px-4 text-center" v-text="$t('newsletter.splash.headline')" />
    <div class="h4" v-text="$t('newsletter.splash.offer', { discount: $cmwStore.isB2b ? 3 : ($cmwStore.isUk ? 10 : 5) })" />

    <div class="grid grid-cols-[1fr_3fr] grid-rows-auto px-4">
      <div class="c">
        <!-- Todo: use an image from shopify -->
        <img :src="bannerSplashNewsletter" alt="alt-text">
      </div>
      <div class="c">
        <ValidationObserver ref="formEl" slim>
          <form
            class="sm:px-4 my-8"
            @submit.prevent="onSubmit"
          >
            <InputField
              v-if="!customer.id"
              v-model="formData.email"
              name="user-email-newsletter"
              :label="$t('email')"
              autocomplete="off"
              :placeholder="$t('emailPlaceholder')"
              rules="required|email"
            />
            <CmwCheckbox
              id="newsletter-checkbox"
              v-model="formData.acceptsMarketing"
              :checked="formData.acceptsMarketing"
              is-required
              @change="formData.acceptsMarketing = !formData.acceptsMarketing"
            >
              <template #label>
                <i18n
                  class="block text-xs"
                  path="newsletter.splash.acceptMarketing"
                  tag="span"
                >
                  <span
                    class="font-sans text-primary-400 tracking-normal"
                    v-text="$t('newsletter.splash.privacyPolicy')"
                  />
                </i18n>
              </template>
            </CmwCheckbox>

            <!--            <CmwCheckbox
              id="newsletter-profiling"
              v-model="formData.profiling"
              :checked="formData.profiling"
              @change="formData.profiling = !formData.profiling"
            >
              <template #label>
                <i18n
                  class="block text-xs"
                  path="newsletter.splash.profiling"
                  tag="span"
                >
                  <span
                    class="font-sans text-primary-400 tracking-normal"
                    v-text="$t('newsletter.splash.privacyPolicy')"
                  />
                </i18n>
              </template>
            </CmwCheckbox> -->
            <CmwButton class="w-max ml-auto my-4" size="sm" :label="$t('common.cta.subscribe')" type="submit" />
          </form>
        </ValidationObserver>
      </div>
      <i18n
        class="block text-xs col-span-full"
        path="newsletter.splash.readMore"
        tag="span"
      >
        <NuxtLink to="/privacy" class="text-xs text-primary hover:(text-primary)">
          {{ $t('newsletter.splash.privacyPolicy') }}
        </NuxtLink>
      </i18n>
    </div>
  </div>
</template>
