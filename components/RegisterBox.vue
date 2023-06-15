<script lang="ts">
import { ref, useContext, useRouter } from '@nuxtjs/composition-api'
import type { RawLocation } from 'vue-router'
import calendarIcon from '~/assets/svg/calendar.svg'
import GqlCustomerCreate from '~/graphql/mutations/customerCreate.graphql'
import { SweetAlertConfirm, SweetAlertToast } from '~/utilities/Swal'
import { useCustomer } from '~/store/customer'

export default {
  setup() {
    const { $graphql, i18n, localeLocation, $gtm, $handleApiErrors } = useContext()
    const router = useRouter()
    const customerStore = useCustomer()
    const isSubmitting = ref(false)
    const showPasswordToast = ref(false)
    const now = new Date()

    const handleFocus = () => showPasswordToast.value = true
    const handleBlur = () => showPasswordToast.value = false

    const form = ref({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      privacy: false,
      acceptsMarketing: false,
      age: '',
    })

    const onSubmit = async () => {
      isSubmitting.value = true

      // eslint-disable-next-line unused-imports/no-unused-vars
      const { age, privacy, ...input } = form.value
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
            userId: customer.id,
            userEmail: form.value.email,
          })

          const valid = await customerStore.login(form.value.email, form.value.password)

          if (valid) {
            await customerStore.getCustomer()
              .then(() => router.push(localeLocation('/profile/my-orders') as RawLocation))
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
      now,
      isSubmitting,
      form,
      showPasswordToast,
      calendarIcon,
      handleFocus,
      handleBlur,
      onSubmit,
    }
  },
}
</script>

<template>
  <div>
    <ValidationObserver v-slot="{ handleSubmit }" slim>
      <form class="px-4 pt-3 py-2 w-3/4 mx-auto" @submit.prevent="handleSubmit(onSubmit)">
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

        <InputField
          v-model="form.age"
          type="date"
          name="register-user-age" :label="$t('birthday')"
          placeholder="dd/mm/yyyy" rules="required"
          theme="gray"
        />

        <p
          v-if="new Date(now) - new Date(form.age) < 568036800000"
          class="text-danger font-bold small mt-2"
        >
          Devi essere maggiorenne per poterti registrare al sito.
        </p>

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

        <Button
          class="sm:max-w-330px mt-8"
          type="submit"
          :disabled="isSubmitting || !(new Date(now) - new Date(form.age) > 568036800000)"
          :label="$t('navbar.user.register')"
        />
      </form>
    </ValidationObserver>
  </div>
</template>
