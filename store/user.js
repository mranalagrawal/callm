export const state = () => ({
  user: null,
});

export const mutations = {
  setUser(state, user) {
    state.user = user;
  },
  addAddress(state, newAddress) {
    state.user.customer.addresses.edges.push(newAddress);
  },
  updateDefaultAddress(state, newAddress) {
    state.user.customer.defaultAddress = newAddress;
  },
  removeFromAddresses(state, address) {
    state.user.customer.addresses.edges.splice(
      state.user.customer.addresses.edges.findIndex((el) =>
        el.node.id.startsWith(address)
      ),
      1
    );
  },
  editAddress(state, address) {
    state.user.customer.addresses.edges.splice(
      state.user.customer.addresses.edges.findIndex((el) =>
        el.node.id.startsWith(address)
      ),
      1
    );
    state.user.customer.addresses.edges.push(address);
  },
  updateGenericField(state, payload) {
    const newValue = payload.value;
    const field = payload.field;

    state.user.customer[field] = newValue;
  },
  updateAccessToken(state, newToken) {
    state.user.token = newToken;
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
