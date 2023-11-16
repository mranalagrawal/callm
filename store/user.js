export const state = () => ({
  user: {},
})

export const actions = {
  setUser({ commit }, payload) {
    commit('SET_USER', payload)
  },
}

export const mutations = {
  SET_USER(state, payload) {
    state.user = payload
  },
}
