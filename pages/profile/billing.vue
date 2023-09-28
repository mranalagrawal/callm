<script lang="ts">
import { computed, defineComponent, onMounted, ref, useContext, useFetch } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'
import countriesJson from '~/assets/countries.json'
import radioCheckedIcon from '~/assets/svg/radio-checked.svg'
import radioUncheckedIcon from '~/assets/svg/radio-unchecked.svg'
import { useCustomer } from '~/store/customer'
import type { IOptions } from '~/types/types'
import { SweetAlertToast } from '~/utilities/Swal'

interface CustomResponse extends Response {
  data: {
    message: string
    errors: {
      vat: string[]
    }
  }
}

interface CustomError extends Error {
  response: CustomResponse
}

export default defineComponent({
  setup() {
    const { i18n, $cmw, $cmwGtmUtils, $cmwStore, $cookieHelpers, $handleApiErrors } = useContext()
    const { customerId, customer } = storeToRefs(useCustomer())
    const { getCustomer } = useCustomer()
    const fetchingCountries = ref(true)
    const formEl = ref<HTMLFormElement | null>(null)
    const isSubmitting = ref(false)
    const countries = ref<IOptions[]>([])
    const provincesOptions = ref<IOptions[]>([])
    const customerBilling = computed(() => customer.value.billing?.value ? JSON.parse(customer.value.billing.value) : {})
    const selectedCountry = ref(customerBilling.value.country || '')
    const invoiceType = computed<IOptions[]>(() => {
      const baseOptions = [
        {
          label: i18n.t('pages.billing.private'),
          value: 'Privato',
        },
        {
          label: i18n.t('pages.billing.company'),
          value: 'Azienda',
        },
      ]

      return selectedCountry.value === 'IT'
        ? [
            ...baseOptions,
            {
              label: i18n.t('pages.billing.association'),
              value: 'Associazione',
            },
          ]
        : baseOptions
    })

    // const srcData = ref<Record<string, any>>([])
    const selectedRequestInvoice = ref(customerBilling.value.invoice ? 'request' : 'refuse')
    const selectedInvoiceType = ref(customerBilling.value.invoice_type || '')
    const requestInvoice = [
      {
        uuid: 'request',
        label: i18n.t('common.cta.yes'),
      },
      {
        uuid: 'refuse',
        label: i18n.t('common.cta.no'),
      },
    ]

    useFetch(async () => {
      fetchingCountries.value = true
      // const data: Record<string, any>[] = await $http.$get('https://restcountries.com/v3.1/all?fields=name,cca2,translations')

      const data = countriesJson as Record<string, any>

      if (data) {
        // srcData.value = data
        const countriesArr = data.map((country: { cca2: any; translations: { [x: string]: { common: any } }; name: { common: any } }) => ({
          value: country.cca2,
          label: country.translations[i18n.localeProperties['iso-3166-1-alpha-3']]?.common || country.name.common,
        }))

        let firstCountryValue: string

        if ($cmwStore.isIt || $cmwStore.isB2b) {
          firstCountryValue = 'IT'
        } else if ($cmwStore.isFr) {
          firstCountryValue = 'FR'
        } else if ($cmwStore.isDe) { firstCountryValue = 'DE' }

        // Remove the first country from the array (if exists)
        const firstCountry = countriesArr.find((c: { value: any }) => c.value === firstCountryValue)
        const remainingCountries = countriesArr.filter((c: { value: any }) => c.value !== firstCountryValue)

        // Sort the remaining countriesArr alphabetically
        remainingCountries.sort((a: { label: string }, b: { label: any }) => a.label.localeCompare(b.label))

        // Add a separator and the first country back to the sorted array
        if (firstCountry) {
          countries.value = [firstCountry, {
            value: '',
            label: '--',
            disabled: true,
          }, ...remainingCountries]
        } else {
          countries.value = remainingCountries
        }
      }

      fetchingCountries.value = false
    })

    const formDataName = computed(() => ({
      inputName: 'checkout_billing_address_first_name',
      show: ((!!selectedCountry.value)
        && (selectedInvoiceType.value === 'Associazione' && selectedCountry.value === 'IT'))
      || ((!!selectedCountry.value)
        && (selectedInvoiceType.value === 'Privato' || selectedInvoiceType.value === 'Azienda')),
      inputValue: customerBilling.value?.first_name || '',
      rules: (() => ({ required: (selectedInvoiceType.value === 'Privato') }))(),
    }))

    const formDataLastname = computed(() => ({
      inputName: 'checkout_billing_address_last_name',
      show: ((!!selectedCountry.value)
          && (selectedInvoiceType.value === 'Associazione' && selectedCountry.value === 'IT'))
        || ((!!selectedCountry.value)
          && (selectedInvoiceType.value === 'Privato' || selectedInvoiceType.value === 'Azienda')),
      inputValue: customerBilling.value?.last_name || '',
      rules: (() => ({ required: (selectedInvoiceType.value === 'Privato') }))(),
    }))

    // RAGIONE SOCIALE
    const formDataCompany = computed(() => ({
      inputName: 'checkout_invoice_company_name',
      show: (((!!selectedCountry.value && !!selectedCountry.value)
      && (selectedInvoiceType.value === 'Azienda'))
      || ((!!selectedCountry.value && !!selectedCountry.value)
      && (selectedInvoiceType.value === 'Associazione' && selectedCountry.value === 'IT'))),
      inputValue: customerBilling.value?.company_name || '',
      rules: { required: true },
    }))

    // NOME AZIENDA (FACOLTATIVO)
    const formDataCompanyName = computed(() => ({
      inputName: 'checkout_billing_address_company',
      show: selectedInvoiceType.value === 'Azienda',
      inputValue: customerBilling.value?.company || '',
      rules: { required: false },
    }))

    // PARTITA IVA
    const formDataVat = computed(() => ({
      inputName: 'checkout_invoice_company_vat',
      show: ((!!selectedCountry.value && selectedInvoiceType.value === 'Azienda')),
      inputValue: customerBilling.value?.vat || '',
      rules: (() => {
        if (selectedCountry.value === 'DE') {
          return { required: true, regex: /^DE\d{9}$/ }
        } else if (selectedCountry.value === 'FR') {
          return { required: true, regex: /^FR[a-zA-Z0-9]{11}$/ }
        } else { return { required: true, regex: /^(IT)?\d{11}$/ } }
      })(),
    }))

    // PEC
    const formDataPec = computed(() => ({
      inputName: 'checkout_invoice_company_pec',
      show: ((selectedCountry.value === 'IT'
        && (selectedInvoiceType.value === 'Associazione' || selectedInvoiceType.value === 'Azienda'))),
      inputValue: customerBilling.value?.pec_sdi || '',
      rules: { required: true, regex: /^(?:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|[0-9]{7})$/ },
    }))

    // CODICE FISCALE
    const formDataTaxCode = computed(() => ({
      inputName: 'checkout_invoice_private_taxcode',
      show: ((selectedCountry.value === 'IT' && (selectedInvoiceType.value === 'Associazione' || selectedInvoiceType.value === 'Privato'))),
      inputValue: customerBilling.value?.tax_code || '',
      rules: (() => {
        if (selectedInvoiceType.value === 'Privato') { return { required: true, regex: /^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/i } } else { return { required: true, regex: /^\d{11}$/i } }
      })(),
    }))

    // CITTA
    const formDataCity = computed(() => ({
      inputName: 'checkout_billing_address_city',
      show: ((!!selectedCountry.value)
          && (selectedInvoiceType.value === 'Associazione' && selectedCountry.value === 'IT'))
        || ((!!selectedCountry.value)
          && (selectedInvoiceType.value === 'Privato' || selectedInvoiceType.value === 'Azienda')),
      inputValue: customerBilling.value?.city || '',
      rules: { required: true },
    }))

    // PROVINCIA
    const formDataProvince = computed(() => ({
      inputName: 'checkout_billing_address_province',
      show: (selectedCountry.value === 'IT' && !!selectedInvoiceType.value),
      inputValue: customerBilling.value?.province || '',
      rules: { required: true },
    }))

    // INDIRIZZO
    const formDataAddress1 = computed(() => ({
      inputName: 'checkout_billing_address_address1',
      show: ((!!selectedCountry.value)
          && (selectedInvoiceType.value === 'Associazione' && selectedCountry.value === 'IT'))
        || ((!!selectedCountry.value)
          && (selectedInvoiceType.value === 'Privato' || selectedInvoiceType.value === 'Azienda')),
      inputValue: customerBilling.value?.address1 || '',
      rules: { required: true },
    }))

    // CAP
    const formDataZip = computed(() => ({
      inputName: 'checkout_billing_address_zip',
      show: ((!!selectedCountry.value)
          && (selectedInvoiceType.value === 'Associazione' && selectedCountry.value === 'IT'))
        || ((!!selectedCountry.value)
          && (selectedInvoiceType.value === 'Privato' || selectedInvoiceType.value === 'Azienda')),
      inputValue: customerBilling.value?.zip || '',
      rules: { required: true },
    }))

    // TELEFONO
    const formDataPhone = computed(() => ({
      inputName: 'checkout_billing_address_phone',
      show: ((!!selectedCountry.value)
          && (selectedInvoiceType.value === 'Associazione' && selectedCountry.value === 'IT'))
        || ((!!selectedCountry.value)
          && (selectedInvoiceType.value === 'Privato' || selectedInvoiceType.value === 'Azienda')),
      inputValue: customerBilling.value?.phone || '',
      rules: { required: false },
    }))

    const handleCountryChange = (code: string) => {
      selectedCountry.value = code
      formDataProvince.value.inputValue = ''

      // Populate provinces from countries.json file based on country code
      const selectedCountryObj = countriesJson.find(country => country.cca2 === code)
      const provinces = selectedCountryObj?.provinces

      provincesOptions.value = provinces?.map(({ code, name }) => ({
        value: code,
        label: name,
      })) || []
    }

    const handleProvinceChange = (code: string) => {
      formDataProvince.value.inputValue = code
    }

    const handleInvoiceTypeChange = (code: string) => {
      selectedInvoiceType.value = code
      formDataTaxCode.value.inputValue = ''
      formDataCompanyName.value.inputValue = ''
      formDataPec.value.inputValue = ''
    }

    const onSubmit = async () => {
      if (!formEl.value) { return }

      isSubmitting.value = true
      const customerAccessToken = $cookieHelpers.getToken()
      $cmw.setHeader('X-Shopify-Customer-Access-Token', customerAccessToken)

      await $cmw.$post(`/customers/${customerId.value}/billing-info`, {
        invoice: selectedRequestInvoice.value === 'request',
        country: selectedCountry.value,
        invoice_type: selectedInvoiceType.value,
        ...(formDataTaxCode.value.inputValue && { tax_code: formDataTaxCode.value.inputValue }),
        ...(formDataCompanyName.value.inputValue && formDataCompanyName.value.show && { company: formDataCompanyName.value.inputValue }),
        ...(formDataCompany.value.inputValue && formDataCompany.value.show && { company_name: formDataCompany.value.inputValue }),
        ...(formDataVat.value.show && formDataVat.value.inputValue && { vat: formDataVat.value.inputValue }),
        ...(formDataPec.value.inputValue && { pec_sdi: formDataPec.value.inputValue }),
        ...(formDataName.value.inputValue && { first_name: formDataName.value.inputValue }),
        ...(formDataLastname.value.inputValue && { last_name: formDataLastname.value.inputValue }),
        ...(formDataAddress1.value.inputValue && { address1: formDataAddress1.value.inputValue }),
        address2: '',
        ...(formDataZip.value.inputValue && { zip: formDataZip.value.inputValue }),
        ...(formDataCity.value.inputValue && { city: formDataCity.value.inputValue }),
        ...(formDataProvince.value.inputValue && { province: formDataProvince.value.inputValue }),
        ...(formDataPhone.value.inputValue && { phone: formDataPhone.value.inputValue }),
      })
        .then(async () => {
          await getCustomer()
          SweetAlertToast.fire({
            icon: 'success',
            title: i18n.t('common.feedback.OK.customerUpdateData'),
          })
        })
        .catch(async (err: CustomError) => {
          const text = err.response.data?.message

          if (text) {
            await SweetAlertToast.fire({
              icon: 'error',
              text,
            })
          } else {
            $handleApiErrors(`Catch on billing: ${err}`)
          }
        })
        .finally(() => {
          isSubmitting.value = false
        })
    }

    onMounted(() => {
      process.browser && $cmwGtmUtils.pushPage('page')
      if (selectedCountry.value) {
        handleCountryChange(selectedCountry.value)
        if (customerBilling.value?.province) { handleProvinceChange(customerBilling.value?.province) }
      }
    })

    return {
      // srcData,
      countries,
      customer,
      customerBilling,
      fetchingCountries,
      formDataAddress1,
      formDataCity,
      formDataCompany,
      formDataCompanyName,
      formDataLastname,
      formDataName,
      formDataPec,
      formDataPhone,
      formDataProvince,
      formDataTaxCode,
      formDataVat,
      formDataZip,
      formEl,
      getCustomer,
      handleCountryChange,
      handleInvoiceTypeChange,
      handleProvinceChange,
      invoiceType,
      isSubmitting,
      onSubmit,
      provincesOptions,
      radioCheckedIcon,
      radioUncheckedIcon,
      requestInvoice,
      selectedCountry,
      selectedInvoiceType,
      selectedRequestInvoice,
    }
  },
})
</script>

<template>
  <div>
    <p v-if="$fetchState.pending || fetchingCountries" class="px-4">
      {{ $t("loading") }}
    </p>
    <div v-else class="px-4 md:(mt-9 max-w-10/12)">
      <ClientOnly>
        <div class="px-4 h4 cmw-font-semibold" v-text="$t('profile.billing')" />
        <ValidationObserver
          ref="formEl"
          v-slot="{ handleSubmit }"
          slim
        >
          <form
            class="w-[min(100%,_60rem)] m-inline-auto"
            @submit.prevent="handleSubmit(onSubmit)"
          >
            <fieldset class="mt-6">
              <legend class="h4 my-6">
                {{ $t('pages.billing.requestInvoice') }}
              </legend>
              <div v-for="({ label, uuid }) in requestInvoice" :key="uuid" class="relative flex items-center">
                <input
                  :id="uuid"
                  v-model="selectedRequestInvoice"
                  :aria-label="`select ${label}`"
                  class="peer appearance-none absolute w-full h-full z-dante"
                  type="radio"
                  name="checkout_invoice"
                  :value="uuid"
                >
                <span class="absolute flex text-primary-400 w-[22px] h-[22px] top-0 left-0 pointer-events-none">
                  <VueSvgIcon
                    :data="(selectedRequestInvoice === uuid) ? radioCheckedIcon : radioUncheckedIcon" width="22"
                    height="22"
                  />
                </span>
                <label
                  :for="uuid"
                  class="text-sm pl-6"
                >{{ label }}</label>
              </div>
            </fieldset>
            <template v-if="selectedRequestInvoice === 'request'">
              <fieldset>
                <BaseSelect
                  id="country" v-model="selectedCountry"
                  name="checkout_billing_address_country"
                  :options="countries" :label="$t('country')"
                  :rules="{ required: true }"
                  @change="handleCountryChange"
                />
                <BaseSelect
                  id="invoiceType" v-model="selectedInvoiceType"
                  name="checkout_billing_address_invoice_type"
                  :options="invoiceType" :label="$t('pages.billing.invoiceType')"
                  :rules="{ required: true }"
                  @change="handleInvoiceTypeChange"
                />
              </fieldset>
              <fieldset>
                <InputField
                  v-if="formDataCompany.show"
                  v-model="formDataCompany.inputValue"
                  type="text"
                  :name="formDataCompany.inputName"
                  :label="$t('common.forms.billingAddress.checkout_invoice_company_name')"
                  :placeholder="$t('common.forms.billingAddress.checkout_invoice_company_name')"
                  :rules="formDataCompany.rules"
                />
              </fieldset>
              <fieldset>
                <InputField
                  v-if="formDataTaxCode.show"
                  v-model="formDataTaxCode.inputValue"
                  type="text"
                  :name="formDataTaxCode.inputName"
                  :label="$t('common.forms.billingAddress.checkout_invoice_private_taxcode')"
                  :placeholder="$t('common.forms.billingAddress.checkout_invoice_private_taxcode')"
                  :rules="formDataTaxCode.rules"
                />
              </fieldset>
              <fieldset>
                <InputField
                  v-if="formDataVat.show"
                  v-model="formDataVat.inputValue"
                  type="text"
                  :name="formDataVat.inputName"
                  :label="$t('common.forms.billingAddress.checkout_invoice_company_vat')"
                  :placeholder="$t('common.forms.billingAddress.checkout_invoice_company_vat')"
                  :rules="formDataVat.rules"
                />
              </fieldset>
              <fieldset>
                <InputField
                  v-if="formDataPec.show"
                  v-model="formDataPec.inputValue"
                  type="text"
                  :name="formDataPec.inputName"
                  :label="$t('common.forms.billingAddress.checkout_invoice_company_pec')"
                  :placeholder="$t('common.forms.billingAddress.checkout_invoice_company_pec')"
                  :rules="formDataPec.rules"
                />
              </fieldset>
              <fieldset>
                <InputField
                  v-if="formDataCompanyName.show"
                  v-model="formDataCompanyName.inputValue"
                  type="text"
                  :name="formDataCompanyName.inputName"
                  :label="$t('common.forms.billingAddress.checkout_billing_address_company')"
                  :placeholder="$t('common.forms.billingAddress.checkout_billing_address_company')"
                  :rules="formDataCompanyName.rules"
                />
              </fieldset>
              <fieldset class="grid gird-cols-2">
                <InputField
                  v-if="formDataName.show"
                  v-model="formDataName.inputValue"
                  type="text"
                  :name="formDataName.inputName"
                  :label="$t('common.forms.billingAddress.checkout_billing_address_first_name')"
                  :placeholder="$t('common.forms.billingAddress.checkout_billing_address_first_name')"
                  :rules="formDataName.rules"
                />
                <InputField
                  v-if="formDataLastname.show"
                  v-model="formDataLastname.inputValue"
                  type="text"
                  :name="formDataLastname.inputName"
                  :label="$t('common.forms.billingAddress.checkout_billing_address_last_name')"
                  :placeholder="$t('common.forms.billingAddress.checkout_billing_address_last_name')"
                  :rules="formDataLastname.rules"
                />
              </fieldset>
              <fieldset>
                <InputField
                  v-if="formDataAddress1.show"
                  v-model="formDataAddress1.inputValue"
                  type="text"
                  :name="formDataAddress1.inputName"
                  :label="$t('common.forms.billingAddress.checkout_billing_address_address1')"
                  :placeholder="$t('common.forms.billingAddress.checkout_billing_address_address1')"
                  :rules="formDataAddress1.rules"
                />
                <div v-if="formDataAddress1.show">
                  {{ $t('common.forms.billingAddress.checkout_billing_address_address1_note') }}
                </div>
                <InputField
                  v-if="formDataCity.show"
                  v-model="formDataCity.inputValue"
                  type="text"
                  :name="formDataCity.inputName"
                  :label="$t('common.forms.billingAddress.checkout_billing_address_city')"
                  :placeholder="$t('common.forms.billingAddress.checkout_billing_address_city')"
                  :rules="formDataCity.rules"
                />
                <BaseSelect
                  v-if="formDataProvince.show"
                  id="checkout-province"
                  v-model="formDataProvince.inputValue" :options="provincesOptions"
                  name="checkout_billing_address_province"
                  :label="$t('common.forms.billingAddress.checkout_billing_address_province')"
                  :rules="formDataProvince.rules"
                  @change="handleProvinceChange"
                />
                <InputField
                  v-if="formDataZip.show"
                  v-model="formDataZip.inputValue"
                  type="text"
                  :name="formDataZip.inputName"
                  :label="$t('common.forms.billingAddress.checkout_billing_address_zip')"
                  :placeholder="$t('common.forms.billingAddress.checkout_billing_address_zip')"
                  :rules="formDataZip.rules"
                />
                <InputField
                  v-if="formDataPhone.show"
                  v-model="formDataPhone.inputValue"
                  type="text"
                  :name="formDataPhone.inputName"
                  :label="$t('common.forms.billingAddress.checkout_billing_address_phone')"
                  :placeholder="$t('common.forms.billingAddress.checkout_billing_address_phone')"
                  :rules="formDataPhone.rules"
                />
              </fieldset>
            </template>
            <Button
              class="w-max mt-8"
              type="submit"
              :disabled="isSubmitting"
              :label="$t('common.cta.save')"
            />
          </form>
        </ValidationObserver>
      </ClientOnly>
    </div>
  </div>
</template>
