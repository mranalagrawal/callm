<script lang="ts">
import { defineComponent, onMounted, ref, useContext } from '@nuxtjs/composition-api'
import GqlCustomerRecover from '~/graphql/mutations/customerRecover.graphql'
import { useSplash } from '~/store/splash'
import { SweetAlertToast } from '~/utilities/Swal'

export default defineComponent({
  layout(context) {
    return context.$config.STORE
  },
  setup() {
    const { $graphql, $sentry, i18n, $cmwGtmUtils } = useContext()
    const splash = useSplash()
    const isSubmitting = ref(false)
    const form = ref({
      email: '',
    })

    const onSubmit = async () => {
      isSubmitting.value = true

      await $graphql.default.request(GqlCustomerRecover, {
        lang: i18n.locale.toUpperCase(),
        email: form.value.email,
      })
        .then(({ customerRecover }) => {
          if (customerRecover && !customerRecover.customerUserErrors.length) {
            splash.$patch({
              currentSplash: 'CustomerRecoverFeedback',
              size: 'lg',
              localData: form.value.email,
            })
          } else {
            SweetAlertToast.fire({
              icon: 'error',
              text: customerRecover.customerUserErrors[0].message,
            })
          }
        })
        .catch((err) => {
          $sentry.captureException(new Error(`Catch resetting customer password: ${err}`))
          SweetAlertToast.fire({
            icon: 'error',
            text: i18n.t('common.feedback.KO.unknown'),
          })
        })

      isSubmitting.value = false
    }

    onMounted(() => {
      process.browser && $cmwGtmUtils.pushPage('page')
    })

    return { form, isSubmitting, onSubmit }
  },
})
</script>

<template>
  <div class="grid grid-cols-[minmax(auto,_640px)] justify-center justify-items-center mt-20 px-4">
    <div class="h3 mb-8" v-text="$t('recoverPwd.title')" />
    <div class="text-center" v-text="$t('recoverPwd.paragraph')" />
    <ValidationObserver
      v-slot="{ handleSubmit, valid }"
      slim
    >
      <form class="w-full md:w-2/4" @submit.prevent="handleSubmit(onSubmit)">
        <InputField
          v-model="form.email"
          type="email"
          name="register-user-email" :label="$t('email')"
          :placeholder="$t('email')" rules="required|email" theme="gray"
        />

        <Button
          class="mt-8"
          type="submit"
          :disabled="!form.email || !valid"
          :label="$t('common.cta.send')"
        />
      </form>
    </ValidationObserver>
  </div>
</template>
