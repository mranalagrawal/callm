export const state = () => ({
  recent: [],
})

export const mutations = {
  addRecent(state, productId) {
    state.recent = state.recent.length > 11 ? [...new Set([...state.recent, productId])].slice(-12) : [...new Set([...state.recent, productId])]
  },
}
