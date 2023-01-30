<script>
import bookmarkIcon from 'assets/svg/bookmark.svg'
import editIcon from 'assets/svg/edit.svg'
import deleteIcon from 'assets/svg/delete.svg'
import moreVerticalIcon from 'assets/svg/more-vertical.svg'
import { ref, useContext } from '@nuxtjs/composition-api'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { MailingAddressType } from '@/types/mailingAddress'
import { SweetAlertConfirm, SweetAlertToast } from '@/utilities/Swal'
import customerAddressDelete from '~/graphql/mutations/customerAddressDelete'
import { useSplash } from '~/store/splash'
import { useCustomerAddresses } from '~/store/customerAddresses'
// noinspection JSUnusedGlobalSymbols
export default {
  props: {
    /** @Type: {MailingAddressType.MailingAddress} */
    address: {
      required: true,
    },
    isDefaultAddress: {
      type: Boolean,
    },
  },
  setup(props) {
    const { i18n, $graphql, $cookieHelpers } = useContext()
    const splash = useSplash()
    const customerAddresses = useCustomerAddresses()

    const addressToEdit = Object.assign({}, props.address)
    const addressToEditRef = ref(addressToEdit)
    const menuIsOpen = ref(false)
    const openEditAddressSplash = () => {
      menuIsOpen.value = false
      splash.$patch({
        currentSplash: 'EditCustomerAddress',
        title: i18n.t('profile.editAddress'),
        size: 'lg',
      })

      customerAddresses.$patch({
        editingAddress: addressToEditRef.value,
      })
    }

    const toggleMenu = () => menuIsOpen.value = !menuIsOpen.value

    const deleteCustomerAddress = async () => {
      SweetAlertConfirm.fire({
        // TODO: Add some cool animated icons and the use with iconHtml: getIconAsImg('error'),
        icon: 'question',
        text: i18n.t('common.confirm.addressRemove'),
        cancelButtonText: i18n.t('common.cta.cancel'),
        confirmButtonText: i18n.t('common.cta.confirm'),
        preConfirm: async () => {
          await $graphql.default.request(customerAddressDelete, {
            customerAccessToken: $cookieHelpers.getToken(),
            lang: i18n.locale.toUpperCase(),
            id: props.address.id,
          })
            .then(({ customerAddressDelete: { deletedCustomerAddressId, customerUserErrors } }) => {
              if (!customerUserErrors.length) {
                const newAddresses = customerAddresses.addresses.filter(address => address.id !== deletedCustomerAddressId)
                customerAddresses.$patch({
                  addresses: newAddresses,
                })

                SweetAlertToast.fire({
                  icon: 'success',
                  text: i18n.t('common.feedback.OK.deleteCustomerAddress'),
                })

                // Note: If we pass this to a repository pattern we could use a callback function
                menuIsOpen.value = false
              }
            })
        },
      }).then(() => {
      })
    }

    const setAddressAsDefault = () => customerAddresses.setAddressAsDefault(
      props.address.id,
      () => menuIsOpen.value = false)

    return {
      splash,
      menuIsOpen,
      bookmarkIcon,
      editIcon,
      deleteIcon,
      moreVerticalIcon,
      openEditAddressSplash,
      toggleMenu,
      deleteCustomerAddress,
      setAddressAsDefault,
    }
  },
}
</script>

<template>
  <div class="c-address cmw-h-full cmw-relative cmw-font-sans cmw-p-3 cmw-rounded-sm cmw-border cmw-border-gray-light hover:cmw-shadow-elevation">
    <div class="cmw-flex cmw-items-baseline cmw-justify-between cmw-gap-4">
      <strong>{{ address.name }}</strong>
      <CmwChip v-if="isDefaultAddress" :icon="bookmarkIcon" color="secondary-400" :label="$t('profile.defaultAddress')" />
    </div>
    <div class="cmw-text-sm">
      <div>{{ address.address1 }}</div>
      <div>{{ address.address2 }}</div>
      <div>{{ address.city }}</div>
      <div>{{ address.country }}</div>
      <div>{{ address.company }}</div>
      <div>{{ address.formattedArea }}</div>
      <div>{{ address.phone }}</div>
    </div>
    <div class="cmw-absolute cmw-bottom-0 cmw-right-0 cmw-mr-3 cmw-mb-3">
      <ButtonIcon
        v-if="isDefaultAddress"
        :icon="editIcon" variant="icon" @click.native="openEditAddressSplash"
      />
      <div v-else class="cmw-relative">
        <ButtonIcon
          :icon="moreVerticalIcon" variant="icon" @click.native="toggleMenu"
        />
        <transition name="fade" mode="out-in">
          <div
            v-show="menuIsOpen"
            class="
            cmw-absolute cmw-transform cmw-shadow cmw-bg-gray-lightest cmw-rounded-sm cmw-px-6 cmw-py-1 cmw-z-base cmw-w-max
            cmw-bottom-0 cmw-right-0 cmw-translate-x-0 cmw-translate-y-full"
          >
            <button
              class="peer cmw-text-primary-400 cmw-flex cmw-items-center cmw-gap-1 cmw-py-2"
              @click="openEditAddressSplash"
            >
              <VueSvgIcon :data="editIcon" width="24" height="auto" />
              <span class="cmw-text-body cmw-text-sm peer-hover:cmw-text-primary-400" v-text="$t('profile.editAddress')" />
            </button>
            <button
              class="peer cmw-text-primary-400 cmw-flex cmw-items-center cmw-gap-1 cmw-py-2"
              @click="setAddressAsDefault"
            >
              <VueSvgIcon :data="bookmarkIcon" width="24" height="auto" />
              <span class="cmw-text-body cmw-text-sm peer-hover:cmw-text-primary-400" v-text="$t('profile.setAsDefaultAddress')" />
            </button>
            <button
              class="peer cmw-text-primary-400 cmw-flex cmw-items-center cmw-gap-1 cmw-py-2"
              @click="deleteCustomerAddress"
            >
              <VueSvgIcon :data="deleteIcon" width="24" height="auto" />
              <span class="cmw-text-body cmw-text-sm peer-hover:cmw-text-primary-400" v-text="$t('profile.deleteAddress')" />
            </button>
          </div>
        </transition>
      </div>
    </div>
    <!-- Note: Lapel Idea -->
    <!--    <div v-if="isDefaultAddress" class="c-address__lapel cmw-absolute cmw-top-$lapel-top cmw-right-10">
      <CardLapel :icon="bookmarkIcon" label="default" />
    </div> -->
  </div>
</template>

<style scoped>
/*.c-address {
  container: address-box / inline-size;
}

.c-address__lapel {
  --lapel-top: -6px;
}

:deep(.c-lapel) {
  --lapel-height: 26px;
  --lapel-edge-width: 22px;
  --lapel-edge-left: -22px;
  --lapel-swg-width: 18px;
}

!* We are handling this piece skipping mobile-first to reduce the amount of CSS  *!
@container address-box (max-width: 250px) {
  .c-address__lapel {
    --lapel-top: -4px;
  }

  :deep(.c-lapel) {
    --lapel-height: 26px;
    --lapel-edge-width: 22px;
    --lapel-edge-left: -22px;
    --lapel-swg-width: 18px;
  }

  :deep(.c-lapel__label) {
    display: none;
  }
}*/
</style>
