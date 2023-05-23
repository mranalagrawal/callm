<script lang="ts">
import { computed, defineComponent, ref, useContext } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'
import radioCheckedIcon from '~/assets/svg/radio-checked.svg'
import radioUncheckedIcon from '~/assets/svg/radio-unchecked.svg'
import { useCustomer } from '~/store/customer'
import { useSplash } from '~/store/splash'

export default defineComponent({
  setup() {
    const splash = useSplash()
    const { customer } = storeToRefs(useCustomer())
    const { i18n } = useContext()

    const formEl = ref<HTMLFormElement | null>(null)
    const formData = ref({
      firstName: '',
      lastName: '',
      email: '',
      message: '',
    })
    const selectedMotivation = ref('')
    const list = [
      {
        uuid: 'payment',
        loginRequired: true,
        label: i18n.t('contactForm.choices.PAYMENT'),
      },
      {
        uuid: 'order-shipment',
        loginRequired: true,
        label: i18n.t('contactForm.choices.ORDER_SHIPMENT'),
      },
      {
        uuid: 'order-received',
        loginRequired: true,
        label: i18n.t('contactForm.choices.ORDER_RECEIVED'),
      },
      {
        uuid: 'purchase-suggest',
        loginRequired: false,
        label: i18n.t('contactForm.choices.PURCHASE_SUGGEST'),
      },
      {
        uuid: 'site-improvement',
        loginRequired: false,
        label: i18n.t('contactForm.choices.SITE_IMPROVEMENT'),
      },
      {
        uuid: 'other',
        loginRequired: false,
        label: i18n.t('contactForm.choices.OTHER'),
      },
    ]

    const handleChange = ($event: Event) => {
      const target = $event.target as HTMLInputElement
      const value = JSON.parse(target.value)

      if (value.loginRequired && !customer.value.id) {
        console.log('Dispatch login modal: ', value.loginRequired)
        splash.$patch(
          {
            currentSplash: 'TheCustomerLoginSplash',
            title: i18n.t('navbar.user.alreadyRegistered') as string,
          })
      }
    }

    const formIsDisabled = computed(() => {
      const motivationIsRequire = selectedMotivation.value && JSON.parse(selectedMotivation.value).loginRequired

      return (motivationIsRequire && !customer.value.id) || (!selectedMotivation.value || !formData.value.message)
    })

    const onSubmit = async () => {
      if (!formEl.value)
        return

      const { isValid } = await formEl.value.validateWithInfo()

      if (isValid) {
        /* await customerStore.customerUpdateData({
            email: email.value,
          },
          i18n.t('common.feedback.OK.customerUpdateEmail'),
          i18n.t('common.feedback.KO.customerUpdateEmail'))
          .then(() => splash.$reset()) */
      }
    }

    return {
      formEl,
      formData,
      formIsDisabled,
      customer,
      selectedMotivation,
      list,
      radioCheckedIcon,
      radioUncheckedIcon,
      handleChange,
      onSubmit,
    }
  },
})
</script>

<template>
  <div class="cl">
    <ValidationObserver
      v-slot="{ handleSubmit, errors, valid }"
      slim
    >
      <form
        class="cmw-w-full md:cmw-w-2/4"
        @submit.prevent="handleSubmit(onSubmit)"
      >
        <fieldset class="cmw-my-6">
          <legend class="cmw-h4 cmw-my-6">
            {{ $t('contactForm.motivation') }}
          </legend>
          <div v-for="({ label, uuid, loginRequired }) in list" :key="uuid" class="cmw-relative cmw-flex cmw-items-center">
            <input
              :id="uuid"
              v-model="selectedMotivation"
              :aria-label="`select ${label}`"
              class="peer cmw-appearance-none cmw-absolute cmw-w-full cmw-h-full cmw-z-dante"
              type="radio"
              name="motivation"
              :value="JSON.stringify({ uuid, loginRequired })"
              @change="handleChange"
            >
            <span class="cmw-absolute cmw-flex cmw-text-primary-400 cmw-w-[22px] cmw-h-[22px] cmw-top-0 cmw-left-0 cmw-pointer-events-none">
              <VueSvgIcon :data="(selectedMotivation && JSON.parse(selectedMotivation).uuid === uuid) ? radioCheckedIcon : radioUncheckedIcon" width="22" height="22" />
            </span>
            <label
              :for="uuid"
              class="cmw-text-sm cmw-pl-6"
            >{{ label }} <span v-if="!customer.id && loginRequired" class="cmw-text-xs cmw-text-gray">({{ $t('contactForm.loginRequired') }})</span></label>
          </div>
        </fieldset>

        <fieldset v-if="!customer.id" class="cmw-grid cmw-gap-4 cmw-my-6 md:(cmw-grid-cols-3)">
          <InputField
            v-model="formData.firstName"
            type="text"
            name="firstName"
            :label="$t('firstName')"
            :placeholder="$t('firstName')"
            rules="required"
          />
          <InputField
            v-model="formData.lastName"
            type="text"
            name="lastName"
            :label="$t('lastName')"
            :placeholder="$t('lastName')"
            rules="required"
          />
          <InputField
            v-model="formData.email"
            type="email"
            name="user-email"
            label="Email"
            placeholder="User email"
            rules="required|email"
          />
        </fieldset>

        <div class="cmw-relative">
          <textarea
            id="message"
            v-model="formData.message"
            :placeholder="$t('profile.messagePlaceholder')"
            rows="4"
            class="
              peer cmw-px-4 cmw-text-gray-dark cmw-py-3 cmw-w-full cmw-bg-transparent cmw-border cmw-border-gray-light
              cmw-rounded cmw-transition-colors
              hover:(cmw-border-gray)
              focus:(cmw-outline-none cmw-border-gray-dark cmw-placeholder-gray-light)
              autofill:(cmw-text-body cmw-border-info cmw-text-base)
              disabled:(cmw-border-gray-light/70 cmw-cursor-not-allowed)
"
            :class="formData.message ? 'cmw-placeholder-gray-light' : 'cmw-placeholder-transparent'"
          />
          <label
            for="message"
            class="cmw-absolute cmw-m-0 cmw-left-4 cmw-transition-all cmw-select-none cmw-pointer-events-none cmw-truncate
               peer-focus:(cmw-text-[0.775rem] cmw-px-2 cmw-top-[-0.4rem] cmw-bg-white cmw-w-auto)
               peer-disabled:(cmw-text-gray-light/70) peer-focus:cmw-bg-white -cmw-bg-white"
            :class="[
              formData.message ? `cmw-text-[0.775rem] cmw-px-2 cmw-top-[-0.4rem] cmw-bg-white cmw-w-auto` : 'cmw-top-[0.75rem] cmw-w-full cmw-pr-8',
              !!errors.length ? 'cmw-text-error' : formData.message ? 'cmw-text-secondary-800' : 'cmw-text-gray',
            ]"
          >{{ $t('profile.message') }}</label>
        </div>

        <Button
          class="cmw-w-max cmw-mt-8"
          type="submit"
          :disabled="formIsDisabled || !valid"
          :label="$t('common.cta.send')"
        />
      </form>
    </ValidationObserver>
  </div>
</template>
