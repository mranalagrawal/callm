<script lang="ts">
import { defineComponent, ref, useContext, useFetch } from '@nuxtjs/composition-api'
import customerAddressCreate from '~/graphql/mutations/customerAddressCreate.graphql'
import { SweetAlertToast } from '~/utilities/Swal'
import { useCustomerAddresses } from '~/store/customerAddresses'
import { useSplash } from '~/store/splash'

// noinspection JSUnusedGlobalSymbols
export default defineComponent({
  name: 'CreateUserAddress',
  setup() {
    const { $cmwRepo, $graphql, i18n, $cookieHelpers } = useContext()
    const splash = useSplash()
    const customerAddresses = useCustomerAddresses()
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

    const countryOptionsList = ref([])
    const provincesOptions = ref([])
    const setAsDefault = ref(false)
    const formEl = ref(null)

    useFetch(async () => {
      countryOptionsList.value = await $cmwRepo.countries.getCountries()
    })

    const handleCountryChange = (code: string) => {
      form.value.country = code
      form.value.province = ''

      provincesOptions.value = $cmwRepo.countries.getCountryProvinces(code)
    }

    const handleProvinceChange = (code: string) => {
      form.value.province = code
    }

    const onSubmit = async () => {
      /* @ts-expect-error need typing for formEl validateWithInfo */
      const { isValid } = await formEl.value?.validateWithInfo()

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

              if (setAsDefault.value) { customerAddresses.setAddressAsDefault(customerAddress.id) }
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
      countryOptionsList,
      provincesOptions,
      setAsDefault,
      form,
      formEl,
      handleCountryChange,
      handleProvinceChange,
      onSubmit,
    }
  },
})
</script>

<template>
  <ValidationObserver ref="formEl" slim>
    <form
      class="sm:px-4"
      @submit.prevent="onSubmit"
    >
      <div class="grid gap-x-4 sm:grid-cols-2">
        <InputField
          v-model="form.firstName"
          type="text"
          name="firstName"
          :label="$t('firstName')"
          :placeholder="$t('firstName')"
          rules="required"
        />
        <InputField
          v-model="form.lastName"
          type="text"
          name="lastName"
          :label="$t('lastName')"
          :placeholder="$t('lastName')"
          rules="required"
        />
        <BaseSelect
          id="country"
          v-model="form.country" :options="countryOptionsList"
          :label="$t('country')" @change="handleCountryChange"
        />
        <InputField
          v-model="form.city"
          type="text"
          name="city"
          :label="$t('city')"
          :placeholder="$t('city')"
          rules="required"
        />
        <InputField
          v-model="form.address1"
          type="text"
          name="address1"
          :label="$t('civic')"
          :placeholder="$t('civic')"
          rules="required"
        />
        <div class="grid grid-cols-2 gap-4">
          <InputField
            v-model="form.zip"
            type="text"
            name="zip"
            :label="$t('zip')"
            :placeholder="$t('zip')"
            rules="required"
          />
          <BaseSelect
            id="province"
            v-model="form.province" :options="provincesOptions" :label="$t('province')" @change="handleProvinceChange"
          />
        </div>
        <InputField
          v-model="form.phone"
          type="tel"
          name="phone"
          :label="$t('phone')"
          :placeholder="$t('phonePlaceholder')"
          :rules="{ required: !!form.phone, max: 13, min: 9, regex: /^[+]\d{8,13}$/ }"
        />
        <div class="text-sm self-center mt-4 sm:mt-8">
          {{ $t('phoneNote') }}
        </div>
        <div class="col-span-full">
          <InputField
            v-model="form.address2"
            type="test"
            name="address2"
            :label="$t('note')"
            :placeholder="$t('note')"
            :rules="{ required: false }"
          />
        </div>
      </div>
      <div class="flex items-center justify-between mt-8">
        <div>
          <!-- Note: v-model is not working as expected, we need to handle change here FTM -->
          <CmwCheckbox id="set-as-default" v-model="setAsDefault" @change="setAsDefault = !setAsDefault">
            <template #label>
              {{ $t('profile.setAsDefaultLabel') }}
            </template>
          </CmwCheckbox>
        </div>
        <CmwButton class="w-max" :label="$t('common.cta.addAddress')" type="submit" />
      </div>
    </form>
  </ValidationObserver>
</template>
