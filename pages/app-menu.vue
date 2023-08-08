<script>
export default {
  data() {
    return {
      sideBarTop: 0,
      data: [],
    }
  },
  async fetch() {
    let lang = ''
    if (this.$i18n.locale === 'en')
      lang = 'en-gb'
    else
      lang = 'it-it'

    // TODO component access!
    const response = await this.$prismic.api.getSingle('mega-menu-test', {
      lang,
    })

    const data = response.data.body

    this.data = data
      .map((firstLevel) => {
        const secondLevels = firstLevel.items.map((el) => {
          return {
            name: el.secondlevelname,
            position: el.second_level_position,
            // isSelection: !!el.selection,
          }
        })

        const secondLevelsSet = [
          ...new Set(secondLevels.map(el => JSON.stringify(el))),
        ]
          .map(el => JSON.parse(el))
          .sort((a, b) => a.position - b.position)

        const items = secondLevelsSet.map((el) => {
          const temp = firstLevel.items
            .filter(x => x.secondlevelname === el.name)
            .sort((a, b) => a.third_level_position - b.third_level_position)
          return { ...el, items: temp }
        })

        return {
          name: firstLevel.primary.group_label,
          link: firstLevel.primary.first_level_link,
          position: firstLevel.primary.first_level_position,
          items,
        }
      })
      .sort((a, b) => a.position - b.position)
  },
}
</script>

<template>
  <MenuMobile :menu="data" />
</template>
