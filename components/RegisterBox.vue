<script lang="ts">
import { ref, useContext, useRouter } from '@nuxtjs/composition-api'
import type { RawLocation } from 'vue-router'

import { useCart } from '~/store/cart'
import { useCustomer } from '~/store/customer'

import calendarIcon from '~/assets/svg/calendar.svg'
import socialFacebook from '~/assets/svg/social/social-facebook.svg'
import socialGoogle from '~/assets/svg/social/social-google.svg'

import GqlCustomerCreate from '~/graphql/mutations/customerCreate.graphql'
import { getCustomerId } from '~/utilities/shopify'
import { SweetAlertConfirm, SweetAlertToast } from '~/utilities/Swal'

export default {
  setup() {
    const { $graphql, i18n, localeLocation, $gtm, $handleApiErrors, $cmwGtmUtils } = useContext()
    const router = useRouter()
    const customerStore = useCustomer()
    const { getInitialCart } = useCart()
    const isSubmitting = ref(false)
    const showPasswordToast = ref(false)

    const handleFocus = () => showPasswordToast.value = true
    const handleBlur = () => showPasswordToast.value = false

    const form = ref({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      privacy: false,
      acceptsMarketing: false,
    })

    const onSubmit = async () => {
      isSubmitting.value = true

      // eslint-disable-next-line unused-imports/no-unused-vars
      const { privacy, ...input } = form.value
      await $graphql.default.request(GqlCustomerCreate, {
        lang: i18n.locale.toUpperCase(),
        input,
      }).then(async ({
        customerCreate: {
          customer,
          customerUserErrors,
        },
      }) => {
        if (!customerUserErrors.length) {
          // Handle success
          // Todo: Call API to save customer birthday
          $gtm.push({
            event: 'siteSubscription',
            userId: getCustomerId(customer.id),
            userEmail: form.value.email,
          })

          const valid = await customerStore.login(form.value.email, form.value.password)

          if (valid) {
            await customerStore.getCustomer()
              .then(() => {
                getInitialCart()
                $cmwGtmUtils.pushCustomLoginEvent()
                router.push(localeLocation('/') as RawLocation)
              })
          }
        } else {
          if (customerUserErrors[0].field) {
            await SweetAlertToast.fire({
              icon: 'error',
              text: customerUserErrors[0].message,
            })
          } else {
            SweetAlertConfirm.fire({
              // TODO: Add some cool animated icons and the use with iconHtml: getIconAsImg('error'),
              icon: 'info',
              text: customerUserErrors[0].message,
              showCancelButton: false,
              showConfirmButton: false,
              confirmButtonText: i18n.t('common.cta.confirm'),
              preConfirm: async () => {
              },
            }).then(() => {})
          }
        }
      }).catch((err: Error) => $handleApiErrors(`Catch on GqlCustomerCreate from Shopify: ${err}`))

      isSubmitting.value = false
    }

    return {
      calendarIcon,
      form,
      handleBlur,
      handleFocus,
      isSubmitting,
      onSubmit,
      showPasswordToast,
      socialFacebook,
      socialGoogle,
    }
  },
}
</script>

<template>
  <div>
    <ValidationObserver v-slot="{ handleSubmit }" slim>
      <form @submit.prevent="handleSubmit(onSubmit)">
        <InputField
          v-model="form.firstName"
          name="register-user-firstname" :label="$t('firstName')"
          :placeholder="$t('firstName')" rules="required" theme="gray"
        />

        <InputField
          v-model="form.lastName"
          name="register-user-lastname" :label="$t('lastName')"
          :placeholder="$t('lastName')" rules="required" theme="gray"
        />

        <InputField
          v-model="form.email"
          type="email"
          name="register-user-email" :label="$t('email')"
          :placeholder="$t('email')" rules="required|email" theme="gray"
        />

        <CmwStrongPassword v-model="form.password" theme="gray" :placeholder="$t('passwordPlaceholder')" />

        <CmwCheckbox
          id="privacy" v-model="form.privacy"
          :checked="form.privacy" is-required @change="form.privacy = !form.privacy"
        >
          <template #label>
            {{ $t('privacyPolicy') }}
          </template>
        </CmwCheckbox>

        <CmwCheckbox
          id="acceptsMarketing" v-model="form.acceptsMarketing"
          :checked="form.acceptsMarketing" @change="form.acceptsMarketing = !form.acceptsMarketing"
        >
          <template #label>
            {{ $t('acceptMarketing') }}
          </template>
        </CmwCheckbox>

        <CmwButton
          class="mt-8"
          type="submit"
          :disabled="isSubmitting"
          :label="$t('common.cta.register')"
        />
      </form>
    </ValidationObserver>
    <div v-if="$config.STORE !== 'B2B'">
      <p class="mb-5">
        {{ $t("navbar.user.orRegisterWith") }}
      </p>
      <a
        :href="`${$config.MULTIPASS_URL}/social-login/${$config.STORE}/facebook/`"
        class="btn-base cmw-font-bold w-full text-sm text-white btn-base-spacing my-3 facebook"
      >
        <VueSvgIcon :data="socialFacebook" color="white" width="30" height="auto" />
        <span class="px-3">{{ $t("navbar.user.facebookLogin") }}</span>
      </a>
      <a
        :href="`${$config.MULTIPASS_URL}/social-login/${$config.STORE}/google/`"
        class="btn-base cmw-font-bold w-full text-sm btn-base-spacing mb-3 google"
      >
        <VueSvgIcon :data="socialGoogle" original width="30" height="auto" />
        <span class="px-3">{{ $t("navbar.user.googleLogin") }}</span>
      </a>
    </div>
  </div>
</template>

<style scoped>
  .facebook {
    background-color: #004bce;
    border-color: #004bce;
    text-transform: unset;
  }
  .google {
    background-color: #fff;
    text-transform: unset;
    color: black;
    border-color: black;
    border-width: 1px;
  }
</style>
