export const state = () => ({
  recent: [],
});

export const mutations = {
  addRecent(state, productId) {
    state.recent.push(productId);
  },
};
