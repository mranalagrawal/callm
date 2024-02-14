import { defineStore } from 'pinia'
import { SweetAlertToast } from '@/utilities/Swal'

import type { IMailingAddress } from '~/types/mailingAddress'

interface IState {
  defaultAddress: IMailingAddress
  addresses: IMailingAddress[]
  editingAddress: IMailingAddress
}

export const useCustomerAddresses = defineStore({
  id: 'customerAddresses',
  state: () => <IState>({
    defaultAddress: {
      address1: '',
      address2: '',
      city: '',
      company: '',
      country: '',
      countryCodeV2: '',
      firstName: '',
      formatted: '',
      formattedArea: '',
      id: '',
      lastName: '',
      latitude: '',
      longitude: '',
      name: '',
      phone: '',
      province: '',
      provinceCode: '',
      zip: '',
    },
    addresses: [],
    editingAddress: {
      address1: '',
      address2: '',
      city: '',
      company: '',
      country: '',
      countryCodeV2: '',
      firstName: '',
      formatted: '',
      formattedArea: '',
      id: '',
      lastName: '',
      latitude: '',
      longitude: '',
      name: '',
      phone: '',
      province: '',
      provinceCode: '',
      zip: '',
    },
  }),

  actions: {
    async getCustomerAddresses() {
      await this.$nuxt.$cmwRepo.addresses.getCustomerAddresses()
        .then(({ defaultAddress, addresses }) => {
          this.$patch({ defaultAddress, addresses })
        })
    },

    async setAddressAsDefault(addressId = '', successCB = () => {}) {
      await this.$nuxt.$cmwRepo.addresses.setAddressAsDefault(addressId)
        .then(({ customer, customerUserErrors }) => {
          if (!customerUserErrors.length) {
            const defaultAddressId = customer.defaultAddress?.id || ''
            const { protocol, pathname } = new URL(defaultAddressId)

            const newAddresses = this.addresses.map((address) => {
              if (address.id.includes(`${protocol}${pathname}`)) {
                return {
                  ...address,
                  id: defaultAddressId,
                }
              } else {
                return address
              }
            }) || []

            this.$patch({
              defaultAddress: { id: defaultAddressId },
              addresses: newAddresses,
            })

            // Note: SweetAlert doesn't support multiple toasts, so we can decided later if pick another solution
            setTimeout(() => SweetAlertToast.fire({
              icon: 'success',
              text: this.$nuxt.i18n.t('common.feedback.OK.customerDefaultAddressUpdate'),
            }), SweetAlertToast.isVisible() ? (SweetAlertToast.getTimerLeft() + 400) : 1)

            successCB()
          }
        })
    },
  },
})
