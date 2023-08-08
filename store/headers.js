/* import { defineStore } from 'pinia'

export const useHeadersApp = defineStore({
  id: 'headersApp',
  state: () => ({
    fromApp: false,
  }),
  getters: {
    isFromApp: state => state.fromApp,
  },

  actions: {
    setFromApp(ev) {
      this.$patch({ fromApp: ev })
    },
  },
})
 */

export const state = () => ({
  fromApp: false,
})

export const mutations = {
  SET_FROM_APP(state, fromApp) {
    state.fromApp = fromApp
  },
}
