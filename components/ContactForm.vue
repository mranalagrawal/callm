<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, ref, useContext } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'
import radioCheckedIcon from '~/assets/svg/radio-checked.svg'
import radioUncheckedIcon from '~/assets/svg/radio-unchecked.svg'
import { useCustomer } from '~/store/customer'
import { useCustomerOrders } from '~/store/customerOrders'
import { useSplash } from '~/store/splash'
import { SweetAlertToast } from '~/utilities/Swal'

export default defineComponent({
  setup() {
    const { i18n, $gtm, $cmwRepo, $config, $recaptcha } = useContext()
    const splash = useSplash()
    const { orders } = storeToRefs(useCustomerOrders())
    const { customer } = storeToRefs(useCustomer())

    const showForm = ref(false)
    const isSubmitting = ref(false)
    const selectingOrder = ref(false)
    const selectedOrder = ref('')
    const formEl = ref<HTMLFormElement | null>(null)
    const formData = ref({
      firstName: '',
      lastName: '',
      email: '',
      message: '',
    })

    const selectedMotivation = ref('')
    const motivations = [
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
        splash.$patch(
          {
            currentSplash: 'TheCustomerLoginSplash',
            title: i18n.t('navbar.user.alreadyRegistered') as string,
          })
      }

      showForm.value = true
    }

    const customerOrders = computed(() => {
      const arr: Record<string, any>[] = orders.value || []

      return arr.map(order => ({
        value: order.orderNumber,
        label: i18n.t('contactForm.selectedOrder', {
          orderNumber: order.orderNumber,
          date: i18n.d(new Date(order.processedAt), 'short', i18n.localeProperties.iso),
          name: order.shippingAddress?.name || '',
          total: order.currentTotalPrice.amount,
        }),
      }))
    })

    const selectedLabel = ref(i18n.t('contactForm.selectOrder'))

    const formIsDisabled = computed(() => {
      const motivationIsRequire = selectedMotivation.value && JSON.parse(selectedMotivation.value).loginRequired

      return isSubmitting.value || (motivationIsRequire && !customer.value.id) || (!selectedMotivation.value || !formData.value.message)
    })

    const onSubmit = async () => {
      if (!formEl.value) { return }

      isSubmitting.value = true

      const { isValid } = await formEl.value.validateWithInfo()
      const token = await $recaptcha.execute('login')

      if (isValid && token) {
        const { status, message } = await $cmwRepo.orders.requestAssistance({
          message: formData.value.message,
          order: selectedOrder.value,
          fullname: `${customer.value.firstName || formData.value.firstName} ${customer.value.lastName || formData.value.lastName}`,
          email: customer.value.email || formData.value.email,
          store: $config.STORE,
          subject: selectedMotivation.value,
        })

        if (status === 200 && message === 'Ok') {
          splash.$reset()
          showForm.value = false

          $gtm.push({
            event: 'contact',
            leadId: `${Date.now()}`,
            userEmail: customer.value.email || formData.value.email,
          })

          SweetAlertToast.fire({
            icon: 'success',
            text: i18n.t('common.feedback.OK.requestAssistance'),
          })
        }
      }
      isSubmitting.value = false
    }

    const handleUpdateTrigger = () => selectingOrder.value = !selectingOrder.value
    const handleUpdateValue = (value: any) => {
      selectedLabel.value = `order ${value}`
      selectingOrder.value = false
      selectedOrder.value = value
    }

    onMounted(async () => {
      try {
        await $recaptcha.init()
      } catch (e) {
        console.error(e)
      }
    })

    onUnmounted(() => $recaptcha.destroy())

    return {
      formEl,
      formData,
      showForm,
      formIsDisabled,
      customer,
      customerOrders,
      orders,
      selectedMotivation,
      motivations,
      selectingOrder,
      radioCheckedIcon,
      radioUncheckedIcon,
      selectedLabel,
      handleUpdateTrigger,
      handleUpdateValue,
      handleChange,
      onSubmit,
    }
  },
})
</script>

<template>
  <div class="cl">
    <ValidationObserver
      ref="formEl"
      v-slot="{ handleSubmit, errors, valid }"
      slim
    >
      <form
        class="w-[min(100%,_60rem)] m-inline-auto"
        @submit.prevent="handleSubmit(onSubmit)"
      >
        <fieldset class="mt-6">
          <legend class="h4 my-6">
            {{ $t('contactForm.motivation') }}
          </legend>
          <div v-for="({ label, uuid, loginRequired }) in motivations" :key="uuid" class="relative flex items-center">
            <input
              :id="uuid"
              v-model="selectedMotivation"
              :aria-label="`select ${label}`"
              class="peer appearance-none absolute w-full h-full z-dante"
              type="radio"
              name="motivation"
              :value="JSON.stringify({ uuid, loginRequired })"
              @change="handleChange"
            >
            <span class="absolute flex text-primary-400 w-[22px] h-[22px] top-0 left-0 pointer-events-none">
              <VueSvgIcon :data="(selectedMotivation && JSON.parse(selectedMotivation).uuid === uuid) ? radioCheckedIcon : radioUncheckedIcon" width="22" height="22" />
            </span>
            <label
              :for="uuid"
              class="text-sm pl-6"
            >{{ label }} <span v-if="!customer.id && loginRequired" class="text-xs text-gray">({{ $t('contactForm.loginRequired') }})</span></label>
          </div>
        </fieldset>

        <fieldset v-if="!!customerOrders.length && showForm" class="mt-6">
          <CmwDropdown
            key="customer-orders"
            size="sm"
            :active="selectingOrder"
            @update-trigger="handleUpdateTrigger"
          >
            <template #default>
              <span>{{ selectedLabel }}</span>
            </template>
            <template #children>
              <CmwSelect is-full-width :options="customerOrders" @update-value="handleUpdateValue" />
            </template>
          </CmwDropdown>
        </fieldset>

        <fieldset v-if="!customer.id && showForm" class="grid gap-4 mb-6 md:(grid-cols-3)">
          <InputField
            v-model="formData.firstName"
            type="text"
            name="contact-first-name"
            :label="$t('firstName')"
            :placeholder="$t('firstName')"
            rules="required"
          />
          <InputField
            v-model="formData.lastName"
            type="text"
            name="contact-last-name"
            :label="$t('lastName')"
            :placeholder="$t('lastName')"
            rules="required"
          />
          <InputField
            v-model="formData.email"
            type="email"
            name="contact-user-email"
            label="Email"
            placeholder="User email"
            rules="required|email"
          />
        </fieldset>

        <div v-if="showForm" class="relative">
          <textarea
            id="message"
            v-model="formData.message"
            :placeholder="$t('profile.messagePlaceholder')"
            rows="4"
            class="
              peer px-4 text-gray-dark py-3 w-full bg-transparent border border-gray-light
              rounded transition-colors
              hover:(border-gray)
              focus:(outline-none border-gray-dark placeholder-gray-light)
              autofill:(text-body border-info text-base)
              disabled:(border-gray-light/70 cursor-not-allowed)
"
            :class="formData.message ? 'placeholder-gray-light' : 'placeholder-transparent'"
          />
          <label
            for="message"
            class="absolute m-0 left-4 transition-all select-none pointer-events-none truncate
               peer-focus:(text-[0.775rem] px-2 top-[-0.4rem] bg-white w-auto)
               peer-disabled:(text-gray-light/70) peer-focus:bg-white -bg-white"
            :class="[
              formData.message ? `text-[0.775rem] px-2 top-[-0.4rem] bg-white w-auto` : 'top-[0.75rem] w-full pr-8',
              !!errors.length ? 'text-error' : formData.message ? 'text-secondary-800' : 'text-gray',
            ]"
          >{{ $t('profile.message') }}</label>
        </div>
        <CmwButton
          v-if="showForm"
          class="w-max mt-8"
          type="submit"
          :disabled="formIsDisabled || !valid"
          :label="$t('common.cta.send')"
        />
      </form>
    </ValidationObserver>
  </div>
</template>
