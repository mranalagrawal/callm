<script lang="ts">
import { defineComponent, ref, toRefs, useContext } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'
import { useSplash } from '@/store/splash'
import { useCustomer } from '@/store/customer'
import radioCheckedIcon from '~/assets/svg/radio-checked.svg'
import radioUncheckedIcon from '~/assets/svg/radio-unchecked.svg'

export default defineComponent({
  name: 'UpdateCustomerData',
  props: {},
  setup() {
    const { i18n, $cmw, $config, $cookieHelpers } = useContext()
    const splash = useSplash()
    const customerStore = useCustomer()
    const { customer, editingCustomer } = storeToRefs(customerStore)
    const { customerUpdateData } = customerStore
    const { acceptsMarketing, firstName, lastName, phone } = toRefs(editingCustomer.value)

    const frequencies = [
      {
        uuid: 'DAILY',
        label: i18n.t('newsletter.frequency.DAILY'),
      },
      {
        uuid: 'WEEKLY',
        label: i18n.t('newsletter.frequency.WEEKLY'),
      },
    ]

    const selectedFrequency = ref(customer.value.newsletterFrequency?.value ?? '')
    const acceptsNewsletter = ref(['DAILY', 'WEEKLY', 'B2B'].includes(customer.value.newsletterFrequency?.value || ''))
    const formEl = ref<HTMLFormElement | null>(null)

    const handleAcceptsMarketingChange = (checked: boolean) => {
      acceptsMarketing.value = checked
      if (!checked) {
        acceptsNewsletter.value = false
        selectedFrequency.value = ''
      }
    }

    const handleAcceptsNewsletterChange = (checked: boolean) => {
      acceptsNewsletter.value = checked
      if (!checked) {
        selectedFrequency.value = ''
      } else {
        if (!selectedFrequency.value) { selectedFrequency.value = 'DAILY' }
      }
    }

    const onSubmit = async () => {
      const { isValid } = await formEl.value?.validateWithInfo()

      if (isValid) {
        const frequency = acceptsNewsletter.value ? $config.STORE === 'B2B' ? 'B2B' : selectedFrequency.value : 'NOT_ACTIVE'
        const customerAccessToken = $cookieHelpers.getToken()
        $cmw.setHeader('X-Shopify-Customer-Access-Token', customerAccessToken)

        await $cmw.$post(`/customers/${customer.value.id.substring(`${customer.value.id}`.lastIndexOf('/') + 1)}/set-nl-frequency`,
          {
            frequency,
          })

        await customerUpdateData({
          acceptsMarketing: acceptsMarketing.value,
          firstName: firstName.value,
          lastName: lastName.value,
          phone: phone.value ? phone.value : null,
        },
        i18n.t('common.feedback.OK.customerUpdateData') as string,
        i18n.t('common.feedback.KO.customerUpdateData') as string)
          .then(() => splash.$reset())
      }
    }

    return {
      acceptsMarketing,
      acceptsNewsletter,
      customer,
      firstName,
      formEl,
      frequencies,
      handleAcceptsMarketingChange,
      handleAcceptsNewsletterChange,
      lastName,
      onSubmit,
      phone,
      radioCheckedIcon,
      radioUncheckedIcon,
      selectedFrequency,
    }
  },
})
</script>

<template>
  <ValidationObserver ref="formEl" slim>
    <form
      class="sm:px-4 my-8"
      @submit.prevent="onSubmit"
    >
      <div class="max-w-sm mx-auto">
        <InputField
          v-model="firstName"
          name="customer-edit-firstname"
          :label="$t('firstName')"
          :placeholder="$t('firstName')"
          rules="required"
        />
        <InputField
          v-model="lastName"
          name="customer-edit-lastname"
          :label="$t('lastName')"
          :placeholder="$t('lastName')"
          rules="required"
        />
        <InputField
          v-model="phone"
          name="customer-edit-phone"
          :label="$t('phone')"
          :placeholder="$t('phonePlaceholder')"
          :rules="{ required: !!phone, max: 13, min: 9, regex: /^[+]\d{8,13}$/ }"
        />
        <div>
          <CmwCheckbox id="marketing" v-model="acceptsMarketing" :checked="acceptsMarketing" @change="handleAcceptsMarketingChange">
            <template #label>
              <i18n
                class="block"
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
        </div>
        <fieldset v-if="acceptsMarketing" class="mt-6">
          <div>
            <CmwCheckbox id="newsletter" v-model="acceptsNewsletter" :checked="acceptsNewsletter" @change="handleAcceptsNewsletterChange">
              <template #label>
                {{ $t('newsletter.headline') }}
              </template>
            </CmwCheckbox>
          </div>
          <template v-if="acceptsNewsletter && $config.STORE !== 'B2B'">
            <div class="grid grid-cols-2">
              <div
                v-for="({ label, uuid }) in frequencies" :key="uuid"
                class="relative flex items-center"
              >
                <input
                  :id="uuid"
                  v-model="selectedFrequency"
                  :aria-label="`select ${label}`"
                  class="peer appearance-none absolute w-full h-full z-dante"
                  type="radio"
                  name="motivation"
                  :value="uuid"
                >
                <span class="absolute flex text-primary-400 w-[22px] h-[22px] top-0 left-0 pointer-events-none">
                  <VueSvgIcon
                    :data="(selectedFrequency === uuid) ? radioCheckedIcon : radioUncheckedIcon"
                    width="22" height="22"
                  />
                </span>
                <label
                  :for="uuid"
                  class="text-sm pl-6"
                >{{ label }}</label>
              </div>
            </div>
          </template>
        </fieldset>
      </div>
      <div class="text-center mt-8 max-w-sm mx-auto">
        <Button :label="$t('common.cta.confirm')" type="submit" />
      </div>
    </form>
    <div>
      <i18n
        class="block text-xs"
        path="newsletter.splash.readMore"
        tag="span"
      >
        <NuxtLink to="/privacy" class="text-xs text-primary hover:(text-primary)">
          {{ $t('newsletter.splash.privacyPolicy') }}
        </NuxtLink>
      </i18n>
    </div>
  </ValidationObserver>
</template>
