export default ({ app }, inject) => {
  const name = '__session'

  inject('cookieHelpers', {
    getToken: () => app.$cookies.get(name),
    setToken: token => app.$cookies.set(name, token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      // expires // Note: we could use customerAccessToken.expiresAt return by Shopify,
    }),
    onLogout: () => app.$cookies.remove(name),
  })
}
