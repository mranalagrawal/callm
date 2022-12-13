export const state = () => ({
  topBarHeight: 0,
  navbarHeight: 0,
  megaMenuHeight: 0,
});

export const getters = {
  getTopBarHeight(state) {
    return `${state.topBarHeight}px`
  },
}

export const mutations = {
  setTopBarHeight(state, height) {
    state.topBarHeight = height;
  },

  setNavbarHeight(state, height) {
    state.navbarHeight = height;
  },

  setMegaMenuHeight(state, height) {
    state.megaMenuHeight = height;
  },
};
