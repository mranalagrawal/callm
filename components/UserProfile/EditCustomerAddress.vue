<script>
import { computed, onMounted, ref, unref, useContext } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'
import bookmarkIcon from 'assets/svg/bookmark.svg'
import customerAddressUpdate from '~/graphql/mutations/customerAddressUpdate'
import { SweetAlertToast } from '~/utilities/Swal'
import { useSplash } from '~/store/splash'
import { useCustomerAddresses } from '~/store/customerAddresses'
// noinspection JSUnusedGlobalSymbols
export default {
  name: 'EditCustomerAddress',
  props: {},
  setup() {
    const { $cmwRepo, $graphql, i18n, $cookieHelpers } = useContext()
    const splash = useSplash()
    const customerAddresses = useCustomerAddresses()
    const { editingAddress, defaultAddress } = storeToRefs(customerAddresses)
    // Todo: implement typescript :)
    const countriesOptions = ref([])
    const provincesOptions = ref([])
    const setAsDefault = ref(false)
    const formEl = ref(null)

    const handleCountryChange = (code) => {
      customerAddresses.$patch({
        editingAddress: {
          countryCodeV2: code,
          provinceCode: null,
        },
      })

      provincesOptions.value = provincesOptions.value = $cmwRepo.countries.getCountryProvinces(code)
    }

    const handleProvinceChange = (code) => {
      customerAddresses.$patch({
        editingAddress: {
          provinceCode: code,
        },
      })
    }

    const isDefaultAddress = computed(() => editingAddress.value.id === defaultAddress.value.id)
    const onSubmit = async () => {
      const { isValid } = await formEl.value.validateWithInfo()

      if (isValid) {
        const { countryCodeV2, formatted, formattedArea, provinceCode, id, name, value, ...rest } = editingAddress.value
        const address = {
          ...rest,
          country: countryCodeV2,
          province: provinceCode,
        }

        await $graphql.default.request(customerAddressUpdate, {
          lang: i18n.locale.toUpperCase(),
          id,
          address,
          customerAccessToken: $cookieHelpers.getToken(),
        })
          .then(({ customerAddressUpdate: { customerAddress, customerUserErrors } }) => {
            if (customerAddress?.id) {
              splash.$reset()

              const updatedAddresses = customerAddresses.addresses.filter(address => address.id !== id)

              customerAddresses.$patch({
                addresses: [...updatedAddresses, customerAddress],
              })

              SweetAlertToast.fire({
                icon: 'success',
                text: i18n.t('common.feedback.OK.customerAddressUpdate'),
              })

              if (isDefaultAddress.value || setAsDefault.value) { customerAddresses.setAddressAsDefault(customerAddress.id) }
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

    onMounted(async () => {
      countriesOptions.value = await $cmwRepo.countries.getCountries()

      // Note: I don't like this approach but I couldn't find any other workaround for now
      if (editingAddress.value.countryCodeV2) {
        const savedProvince = unref(editingAddress.value.provinceCode)
        await handleCountryChange(editingAddress.value.countryCodeV2)
        setTimeout(() => handleProvinceChange(savedProvince), 100)
      }
    })

    return {
      countriesOptions,
      provincesOptions,
      isDefaultAddress,
      setAsDefault,
      editingAddress,
      formEl,
      bookmarkIcon,
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
      class="sm:px-4"
      @submit.prevent="onSubmit"
    >
      <div class="grid gap-x-4 sm:grid-cols-2">
        <InputField
          v-model="editingAddress.firstName"
          type="text"
          name="firstName"
          :label="$t('firstName').toString()"
          :placeholder="$t('firstName').toString()"
          rules="required"
        />
        <InputField
          v-model="editingAddress.lastName"
          type="text"
          name="lastName"
          :label="$t('lastName').toString()"
          :placeholder="$t('lastName').toString()"
          rules="required"
        />
        <BaseSelect
          id="country-code-v2"
          v-model="editingAddress.countryCodeV2" :options="countriesOptions"
          :label="$t('country').toString()" @change="handleCountryChange"
        />
        <InputField
          v-model="editingAddress.city"
          type="text"
          name="city"
          :label="$t('city').toString()"
          :placeholder="$t('city').toString()"
          rules="required"
        />
        <InputField
          v-model="editingAddress.address1"
          type="text"
          name="address1"
          :label="$t('civic').toString()"
          :placeholder="$t('civic').toString()"
          rules="required"
        />
        <div class="grid grid-cols-2 gap-4">
          <InputField
            v-model="editingAddress.zip"
            type="text"
            name="zip"
            :label="$t('zip').toString()"
            :placeholder="$t('zip').toString()"
            rules="required"
          />
          <BaseSelect
            id="province-code"
            v-model="editingAddress.provinceCode"
            :options="provincesOptions" :label="$t('province').toString()" @change="handleProvinceChange"
          />
        </div>
        <InputField
          v-model="editingAddress.phone"
          type="tel"
          name="phone"
          :label="$t('phone').toString()"
          :placeholder="$t('phonePlaceholder').toString()"
          :rules="{ required: !!editingAddress.phone, max: 13, min: 9, regex: /^[+]\d{8,13}$/ }"
        />
        <div class="text-sm self-center mt-4 sm:mt-8">
          {{ $t('phoneNote') }}
        </div>
        <div class="col-span-full">
          <InputField
            v-model="editingAddress.address2"
            type="text"
            name="address2"
            :label="$t('note').toString()"
            :placeholder="$t('note').toString()"
            :rules="{ required: false }"
          >
            <template #label>
              <i18n
                path="note"
                tag="span"
              >
                <span
                  class="<md:hidden"
                  v-text="$t('noteDesktop')"
                />
              </i18n>
            </template>
          </InputField>
        </div>
      </div>
      <div class="flex items-center justify-between mt-8">
        <div>
          <CmwChip v-if="isDefaultAddress" :icon="bookmarkIcon" color="secondary-400" :label="$t('profile.defaultAddress').toUpperCase()" />
          <!-- Note: v-model is not working as expected, we need to handle change here FTM -->
          <CmwCheckbox v-else id="set-as-default" v-model="setAsDefault" @change="setAsDefault = !setAsDefault">
            <template #label>
              {{ $t('profile.setAsDefaultLabel') }}
            </template>
          </CmwCheckbox>
        </div>
        <CmwButton class="w-max" :label="$t('common.cta.confirm').toString()" type="submit" />
      </div>
    </form>
  </ValidationObserver>
</template>
