import { defineStore } from 'pinia'
// import { SweetAlertConfirm, SweetAlertToast } from '~/utilities/Swal'
// import { getIconAsImg } from '~/utilities/icons'

export const useSplash = defineStore({
  id: 'splash',
  state: () => ({
    currentSplash: '',
    title: '',
    subtitle: '',
    size: '',
    localData: '',
    onBeforeCloseModal: {},
  }),
})
