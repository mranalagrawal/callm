export const state = () => ({
  fromApp: false,
})

export const actions = {
  setFromApp({ commit }, payload) {
    commit('SET_FROM_APP', payload)
  },
}

export const mutations = {
  SET_FROM_APP(state, fromApp) {
    state.fromApp = fromApp
  },
}
