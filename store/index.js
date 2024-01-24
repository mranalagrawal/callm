export const state = () => ({})

export const actions = {
  async nuxtServerInit({ dispatch }, { req }) {
    await dispatch('headers/setFromApp', req.headers['user-agent']?.includes('CMW-App'))
  },
}
