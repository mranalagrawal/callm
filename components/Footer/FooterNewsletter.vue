<script lang="ts">
import { defineComponent, ref, useContext } from '@nuxtjs/composition-api'
import emailIcon from 'assets/svg/email.svg'
import paperPlaneIcon from 'assets/svg/paper-plane.svg'
import { SweetAlertToast } from '~/utilities/Swal'

export default defineComponent({
  setup() {
    const { $cmw, $cmwStore, $gtm, $sentry, i18n } = useContext()
    const form = ref({
      email: '',
    })

    const getNewsletterDiscountByStore = () => ({
      B2B: '3%',
      CMW: '5%',
      CMW_DE: '5%',
      CMW_FR: '5%',
      CMW_UK: '10%',
    }[$cmwStore.settings.store])

    const handleSubmit = async () => {
      await $cmw.$post('/customers/subscribe-nl', {
        email: form.value.email,
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
            $gtm.push({
              event: 'newsletterSubscription',
              leadId: customer.id,
              userEmail: form.value.email,
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

          form.value.email = ''
        })
        .catch((err: Error) => {
          $sentry.captureException(new Error((`Catch on newsletterSubscription: ${err}`)))
          SweetAlertToast.fire({
            icon: 'error',
            text: i18n.t('common.feedback.KO.unknown'),
          })
        })
    }

    return {
      emailIcon,
      form,
      getNewsletterDiscountByStore,
      handleSubmit,
      paperPlaneIcon,
    }
  },
})
</script>

<template>
  <div>
    <VueSvgIcon :data="emailIcon" class="mr-2" color="white" width="30" height="30" />
    <span class="text-secondary-100 text-sm">{{ $t('newsletter.label') }}</span>
    <p class="text-secondary-100" v-text="$t('newsletter.offer', { discount: getNewsletterDiscountByStore() })" />
    <form class="mb-4" @submit.prevent="handleSubmit">
      <div class="flex gap-2 items-stretch p-2 border border-gray-light rounded md:rounded-2xl">
        <label for="newsletter-email" class="sr-only">newsletter-email</label>
        <input
          id="newsletter-email"
          v-model="form.email"
          aria-label="enter email"
          type="email"
          class="flex-1 bg-transparent text-white autofill:bg-transparent -secondary"
          required
        >
        <CmwButton
          size="xs"
          type="submit"
          class="<md:hidden w-max ml-auto justify-end  md:(px-8 py-[0.6rem])"
          variant="default-inverse"
          :label="$t('common.cta.subscribe')"
        />
        <ButtonIcon
          type="submit" :icon="paperPlaneIcon" variant="filled-white"
          class="md:hidden !border-white" color="white" width="30" height="30"
        />
      </div>
      <div class="mt-3">
        <i18n
          class="block text-xs col-span-full"
          path="footer.privacyPolicy"
          tag="span"
        >
          <template #label>
            <span>{{ $t('common.cta.subscribe') }}</span>
          </template>
          <template #link>
            <NuxtLink :to="localePath('/privacy')" class="text-xs text-white underline hover:(text-primary)">
              {{ $t('newsletter.splash.privacyPolicy') }}
            </NuxtLink>
          </template>
        </i18n>
      </div>
    </form>
  </div>
</template>
