export const state = () => ({
  user: {},
})

export const mutations = {
  SET_USER(state, payload) {
    state.user = payload
  },
}

export const actions = {
  async setUser({ commit }, payload) {
    commit('SET_USER', payload)
  },
}
