import type { Middleware } from '@nuxt/types'
import { kv } from '@vercel/kv'
import type { TPrismicIsoCodes } from '~/types/prismic'

const vercelMiddleware: Middleware = async ({ $cmwRepo }) => {
  const languages: TPrismicIsoCodes[] = ['it-it', 'it-bn', 'en-eu', 'en-gb', 'fr-fr', 'de-de']

  const fetchFooter = async (lang: TPrismicIsoCodes) => await $cmwRepo.prismic.getSingle('footer-test', lang)

  const fetchMenu = async (lang: TPrismicIsoCodes) => {
    const megaMenu = await $cmwRepo.prismic.getSingle('mega-menu-test', lang)
    return megaMenu?.body?.length
      ? megaMenu.body.map((firstLevel) => {
        const secondLevels = firstLevel.items.map((el: { secondlevelname: any; second_level_position: any }) => {
          return {
            name: el.secondlevelname,
            position: el.second_level_position,
          }
        })

        const secondLevelsSet = [
          ...new Set(secondLevels.map((el: any) => JSON.stringify(el))),
        ]
          .map(el => JSON.parse(el as string))
          .sort((a, b) => a.position - b.position)

        const items = secondLevelsSet.map((el) => {
          const temp = firstLevel.items
            .filter((x: { secondlevelname: any }) => x.secondlevelname === el.name)
            .sort((a: { third_level_position: number }, b: { third_level_position: number }) => a.third_level_position - b.third_level_position)
          return {
            ...el,
            items: temp,
          }
        })

        return {
          name: firstLevel.primary.group_label,
          link: firstLevel.primary.first_level_link,
          position: firstLevel.primary.first_level_position,
          isPromotionTab: firstLevel.primary.is_promotion_tab,
          display_as_cards: firstLevel.primary.display_as_cards,
          items,
        }
      })
        .sort((a: { position: number }, b: { position: number }) => a.position - b.position)
      : []
  }

  try {
    for (const lang of languages) {
      const megaMenuData = await fetchMenu(lang)
      await kv.set(`prismic/menu/menu-${lang}`, JSON.stringify(megaMenuData), {})

      const footerData = await fetchFooter(lang)
      await kv.set(`prismic/footer/footer-${lang}`, JSON.stringify(footerData), {})
    }
  } catch (error) {
    // Handle errors
  }
}

export default vercelMiddleware
