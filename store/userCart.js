export const state = () => ({
  userCart: [],
});

export const mutations = {
  addProduct(state, entry) {
    // find product
    const product = state.userCart.find(
      (el) => el.productVariantId == entry.productVariantId
    );

    // se c'è già
    if (product) {
      product.quantity = product.quantity + 1;
    } else {
      state.userCart.push({
        productVariantId: entry.productVariantId,
        quantity: 1,
        singleAmount: entry.singleAmount,
        singleAmountFullPrice: entry.singleAmountFullPrice,
        tag: entry.tag,
        image: entry.image,
        title: entry.title,
      });
    }
  },
  removeProduct(state, productVariantId) {
    // find product
    const product = state.userCart.find(
      (el) => el.productVariantId == productVariantId
    );

    if (product) {
      if (product.quantity > 1) {
        product.quantity = product.quantity - 1;
      } else {
        state.userCart.splice(state.userCart.indexOf(product), 1);
      }
    } else {
      return;
    }
  },

  removeLine(state, productVariantId) {
    const product = state.userCart.find(
      (el) => el.productVariantId == productVariantId
    );
    state.userCart.splice(state.userCart.indexOf(product), 1);
  },

  resetCart(state) {
    state.userCart = [];
  },
};
