<script>
import { useContext, useFetch } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'
import { useSplash } from '~/store/splash'
import { useCustomerAddresses } from '~/store/customerAddresses'

export default {
  props: {
    isDesktop: Boolean,
  },
  setup() {
    const { i18n } = useContext()
    const splash = useSplash()
    const customerAddresses = useCustomerAddresses()
    const { defaultAddress, addresses } = storeToRefs(customerAddresses)

    useFetch(async () => {
      await customerAddresses.getCustomerAddresses()
    })

    const openCreateAddressSplash = () => {
      splash.$patch({
        currentSplash: 'CreateUserAddress',
        title: i18n.t('profile.addAddress'),
        size: 'lg',
      })
    }

    return { defaultAddress, addresses, openCreateAddressSplash }
  },
}
</script>

<template>
  <div>
    <p v-if="$fetchState.pending" class="px-4">
      {{ $t("loading") }}
    </p>
    <div v-else class="md:(cmw-mt-9 cmw-max-w-10/12)">
      <div
        v-if="!!addresses"
        class="cmw-p-4 cmw-grid cmw-grid-cols-1 sm:cmw-grid-cols-2 cmw-gap-4"
      >
        <CustomerMailingAddress
          v-for="address in addresses"
          :key="address.id"
          :address="address"
          :is-default-address="address.id === defaultAddress.id" :is-desktop="isDesktop"
        />
        <button
          class="
          cmw-custom-border cmw-flex cmw-items-center cmw-justify-center cmw-gap-2 cmw-min-h-[150px]
          cmw-rounded cmw-text-primary-400 cmw-uppercase cmw-transition-colors
          hover:(cmw-shadow-elevation cmw-bg-primary-50)
"
          @click="openCreateAddressSplash"
        >
          <VueSvgIcon
            :data="require(`@/assets/svg/add.svg`)"
          />
          <span v-text="$t('profile.addNewAddress')" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cmw-custom-border {
  width: 99%;
  height: 99%;
  /* dashed border */
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='12' ry='12' stroke='%23D94965FF' stroke-width='2' stroke-dasharray='8' stroke-dashoffset='0' stroke-linecap='round'/%3e%3c/svg%3e");
  border-color: theme('colors.primary.DEFAULT');
}
</style>
