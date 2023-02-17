<script>
import { ref, useContext, useFetch } from '@nuxtjs/composition-api'
import customerAddressCreate from '~/graphql/mutations/customerAddressCreate'
import { SweetAlertToast } from '~/utilities/Swal'
import { useSplash } from '~/store/splash'
import { useCustomerAddresses } from '~/store/customerAddresses'
// noinspection JSUnusedGlobalSymbols
export default {
  name: 'CreateUserAddress',
  props: {},
  setup() {
    const { $cmwRepo, $graphql, i18n, $cookieHelpers } = useContext()
    const splash = useSplash()
    const customerAddresses = useCustomerAddresses()
    // Todo: implement typescript :)
    /** @type: {InputObjects.MailingAddressInput} */
    const form = ref({
      firstName: '',
      lastName: '',
      city: '',
      country: '',
      address1: '',
      address2: '',
      zip: '',
      province: '',
      phone: '',
    })
    const countriesArr = ref([])
    const countriesOptions = ref([])
    const provincesOptions = ref([])
    const setAsDefault = ref(false)
    const formEl = ref(null)

    useFetch(async () => {
      countriesOptions.value = await $cmwRepo.countries.getCountries()
    })

    const handleCountryChange = (code) => {
      form.value.country = code
      form.value.province = null

      provincesOptions.value = $cmwRepo.countries.getCountryProvinces(code)
    }

    const handleProvinceChange = (code) => {
      form.value.province = code
    }

    const onSubmit = async () => {
      const { isValid } = await formEl.value.validateWithInfo()

      if (isValid) {
        await $graphql.default.request(customerAddressCreate, {
          lang: i18n.locale.toUpperCase(),
          address: form.value,
          customerAccessToken: $cookieHelpers.getToken(),
        })
          .then(({ customerAddressCreate: { customerAddress, customerUserErrors } }) => {
            if (customerAddress?.id) {
              splash.$reset()

              customerAddresses.$patch({
                addresses: [...customerAddresses.addresses, customerAddress],
              })

              SweetAlertToast.fire({
                icon: 'success',
                text: i18n.t('common.feedback.OK.customerAddressCreate'),
              })

              if (setAsDefault.value)
                customerAddresses.setAddressAsDefault(customerAddress.id)
            } else {
              SweetAlertToast.fire({
                icon: 'error',
                text: customerUserErrors[0].message,
              })
            }
          })
          .catch((err) => {
            SweetAlertToast.fire({
              icon: 'error',
              text: err,
            })
          })
      }
    }

    return {
      countriesArr,
      countriesOptions,
      provincesOptions,
      setAsDefault,
      form,
      formEl,
      handleCountryChange,
      handleProvinceChange,
      onSubmit,
    }
  },
}
</script>

<template>
  <ValidationObserver ref="formEl" slim>
    <form
      class="sm:cmw-px-4"
      @submit.prevent="onSubmit"
    >
      <div class="cmw-grid cmw-gap-x-4 sm:cmw-grid-cols-2">
        <InputField
          v-model="form.firstName"
          type="text"
          name="firstName"
          :label="$t('firstName').toString()"
          :placeholder="$t('firstName').toString()"
          rules="required"
        />
        <InputField
          v-model="form.lastName"
          type="text"
          name="lastName"
          :label="$t('lastName').toString()"
          :placeholder="$t('lastName').toString()"
          rules="required"
        />
        <BaseSelect
          v-model="form.country" :options="countriesOptions"
          :label="$t('country').toString()" @change="handleCountryChange"
        />
        <InputField
          v-model="form.city"
          type="text"
          name="city"
          :label="$t('city').toString()"
          :placeholder="$t('city').toString()"
          rules="required"
        />
        <InputField
          v-model="form.address1"
          type="text"
          name="address1"
          :label="$t('civic').toString()"
          :placeholder="$t('civic').toString()"
          rules="required"
        />
        <div class="cmw-grid cmw-grid-cols-2 cmw-gap-4">
          <InputField
            v-model="form.zip"
            type="text"
            name="zip"
            :label="$t('zip').toString()"
            :placeholder="$t('zip').toString()"
            rules="required"
          />
          <BaseSelect v-model="form.province" :options="provincesOptions" :label="$t('province').toString()" @change="handleProvinceChange" />
        </div>
        <InputField
          v-model="form.phone"
          type="tel"
          name="phone"
          :label="$t('phone').toString()"
          :placeholder="$t('phonePlaceholder').toString()"
          :rules="{ required: !!form.phone, max: 13, min: 9, regex: /^[+]\d{8,13}$/ }"
        />
        <div class="cmw-text-sm cmw-self-center cmw-mt-4 sm:cmw-mt-8">
          {{ $t('phoneNote') }}
        </div>
        <div class="cmw-col-span-full">
          <InputField
            v-model="form.address2"
            type="test"
            name="address2"
            :label="$t('note').toString()"
            :placeholder="$t('note').toString()"
            :rules="{ required: false }"
          />
        </div>
      </div>
      <div class="cmw-flex cmw-items-center cmw-justify-between cmw-mt-8">
        <div>
          <!-- Note: v-model is not working as expected, we need to handle change here FTM -->
          <CmwCheckbox id="set-as-default" v-model="setAsDefault" @change="setAsDefault = !setAsDefault">
            <template #label>
              {{ $t('profile.setAsDefaultLabel') }}
            </template>
          </CmwCheckbox>
        </div>
        <Button class="cmw-w-max" :label="$t('common.cta.addAddress').toString()" type="submit" />
      </div>
    </form>
  </ValidationObserver>
</template>

<style scoped>
select::-internal-input-suggested {
  @apply cmw-text-base cmw-text-gray-dark;
}

select:-webkit-autofill ~ label {
  @apply cmw-bg-gray-lightest;
}

select:-webkit-autofill ~ label {
  @apply cmw-text-[0.775rem] cmw-px-2 cmw-top-[-0.4rem];
}
</style>
