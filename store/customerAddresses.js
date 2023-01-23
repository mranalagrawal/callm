import { defineStore } from 'pinia'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as MailingAddressType from '~/types/mailingAddress'
import { SweetAlertToast } from '@/utilities/Swal'

export const useCustomerAddresses = defineStore({
  id: 'customerAddresses',
  state: () => ({
    defaultAddress: { id: '' },
    /** @Type: {MailingAddressType.MailingAddress[]} */
    addresses: [],
    /** @Type: {MailingAddressType.MailingAddress} */
    editingAddress: {},
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
            const { protocol, pathname } = new URL(customer.defaultAddress.id)

            const newAddresses = this.addresses.map((address) => {
              if (address.id.includes(`${protocol}${pathname}`)) {
                return {
                  ...address,
                  id: customer.defaultAddress.id,
                }
              } else {
                return address
              }
            }) || []

            this.$patch({
              defaultAddress: { id: customer.defaultAddress?.id },
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
