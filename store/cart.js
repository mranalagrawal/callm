export const state = () => ({
  cart: null,
})

export const mutations = {
  setCart(state, cart) {
    state.cart = cart
  },
  removeLineFromCart(state, lineId) {
    state.cart.lines.edges.splice(
      state.cart.lines.edges.findIndex(el => el.node.id == lineId),
      1,
    )
    /* state.list.splice(state.list.indexOf(todo), 1); */
  },
  /*   add(state, text) {
    state.list.push({
      text,
      done: false,
    });
  },
  remove(state, { todo }) {
    state.list.splice(state.list.indexOf(todo), 1);
  },
  toggle(state, todo) {
    todo.done = !todo.done;
  }, */
}
