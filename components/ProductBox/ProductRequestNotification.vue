<script lang="ts">
import { ref, useContext } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'
import { useSplash } from '@/store/splash'
import { useProductAvailability } from '@/store/product-availability'
import { SweetAlertToast } from '@/utilities/Swal'

export default {
  name: 'ProductRequestNotification',
  props: {},
  setup() {
    const { i18n, $cmw, $sentry } = useContext()
    const splash = useSplash()
    const productAvailability = useProductAvailability()
    const { productId } = storeToRefs(productAvailability)

    const isSubmitting = ref(false)
    const form = ref({
      email: '',
      privacy: false,
    })

    const onSubmit = async () => {
      isSubmitting.value = true

      await $cmw.$post('/products-availability-alerts', {
        email: form.value.email,
        productId: productId.value,
      })
        .then(({ data }: any) => {
          if (data) {
            splash.$reset()
            productAvailability.$reset()

            SweetAlertToast.fire({
              icon: 'success',
              text: i18n.t('product.notifyMeNote'),
            })
          }
        })
        .catch((err) => {
          $sentry.captureException(new Error(`Catch products-availability-alerts error: ${err}`))
          SweetAlertToast.fire({
            icon: 'error',
            text: `error message: ${err}`,
          })
        })

      isSubmitting.value = false
    }

    return {
      form,
      isSubmitting,
      onSubmit,
    }
  },
}
</script>

<template>
  <ValidationObserver v-slot="{ handleSubmit }" slim>
    <form
      class="sm:px-4"
      @submit.prevent="handleSubmit(onSubmit)"
    >
      <div>
        <InputField
          v-model="form.email"
          type="email"
          name="notify-me-user-email" :label="$t('email')"
          :placeholder="$t('email')" rules="required|email" theme="gray"
        />
        <CmwCheckbox id="privacy" v-model="form.privacy" :checked="form.privacy" is-required @change="form.privacy = !form.privacy">
          <template #label>
            {{ $t('privacyPolicy') }}
          </template>
        </CmwCheckbox>
        <div class="flex items-center justify-center mt-8 mb-4">
          <Button :disabled="isSubmitting" class="w-max" :label="$t('common.cta.notifyMe')" type="submit" />
        </div>
      </div>
    </form>
  </ValidationObserver>
</template>
