export default ctx => ({
  constructor: {
    countries: [],
  },
  async getCountries() {
    try {
      const { countries } = await ctx.$http.$get(`countries/${ctx.$config.STORE}`)
      this.countries = countries

      return this.countries.map(country => ({
        value: country.code,
        label: country.name,
      }) || [])
    } catch (e) {
      // TODO: maybe implement sentry in the future
      throw new Error(ctx.i18n.t('common.feedback.KO.unknown').toString())
    }
  },

  getCountryProvinces(countryCode) {
    const { provinces } = this.countries.find(country => country.code === countryCode)

    return provinces && provinces.map(province => ({
      value: province.code,
      label: province.name,
    }) || [])
  },
})
