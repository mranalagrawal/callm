<script>
import bookmarkIcon from 'assets/svg/bookmark.svg'
import editIcon from 'assets/svg/edit.svg'
import deleteIcon from 'assets/svg/delete.svg'
import moreVerticalIcon from 'assets/svg/more-vertical.svg'
import { ref, useContext } from '@nuxtjs/composition-api'
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
  <div class="c-address h-full relative font-sans p-3 rounded-sm border border-gray-light hover:shadow-elevation">
    <div class="flex items-baseline justify-between gap-4">
      <strong>{{ address.name }}</strong>
      <CmwChip v-if="isDefaultAddress" :icon="bookmarkIcon" variant="overline-2" color="secondary-400" :label="$t('profile.defaultAddress').toUpperCase()" />
    </div>
    <div class="text-sm">
      <div>{{ address.address1 }}</div>
      <div>{{ address.address2 }}</div>
      <div>{{ address.city }}</div>
      <div>{{ address.country }}</div>
      <div>{{ address.company }}</div>
      <div>{{ address.formattedArea }}</div>
      <div>{{ address.phone }}</div>
    </div>
    <div class="absolute bottom-0 right-0 mr-3 mb-3">
      <ButtonIcon
        v-if="isDefaultAddress"
        :icon="editIcon" variant="icon" @click.native="openEditAddressSplash"
      />
      <div v-else class="relative">
        <ButtonIcon
          :icon="moreVerticalIcon" variant="icon" @click.native="toggleMenu"
        />
        <transition name="fade" mode="out-in">
          <div
            v-show="menuIsOpen"
            class="
            absolute transform shadow bg-gray-lightest rounded-sm px-6 py-1 z-base w-max
            bottom-0 right-0 translate-x-0 translate-y-full"
          >
            <button
              class="peer text-primary-400 flex items-center gap-1 py-2"
              @click="openEditAddressSplash"
            >
              <VueSvgIcon :data="editIcon" width="24" height="auto" />
              <span class="text-body text-sm peer-hover:text-primary-400" v-text="$t('profile.editAddress')" />
            </button>
            <button
              class="peer text-primary-400 flex items-center gap-1 py-2"
              @click="setAddressAsDefault"
            >
              <VueSvgIcon :data="bookmarkIcon" width="24" height="auto" />
              <span class="text-body text-sm peer-hover:text-primary-400" v-text="$t('profile.setAsDefaultAddress')" />
            </button>
            <button
              class="peer text-primary-400 flex items-center gap-1 py-2"
              @click="deleteCustomerAddress"
            >
              <VueSvgIcon :data="deleteIcon" width="24" height="auto" />
              <span class="text-body text-sm peer-hover:text-primary-400" v-text="$t('profile.deleteAddress')" />
            </button>
          </div>
        </transition>
      </div>
    </div>
    <!-- Note: Lapel Idea -->
    <!--    <div v-if="isDefaultAddress" class="c-address__lapel absolute top-$lapel-top right-10">
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
