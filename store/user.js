export const state = () => ({
  user: null,
});

export const mutations = {
  setUser(state, user) {
    state.user = user;
  },
  /* setCart(state, cart) {
    state.cart = cart;
  },
  removeLineFromCart(state, lineId) {
    state.cart.lines.edges.splice(
      state.cart.lines.edges.findIndex((el) => el.node.id == lineId),
      1
    );
    
  }, */
};
