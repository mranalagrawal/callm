import { defineStore } from 'pinia'

import GetMetaObjectById from '~/graphql/queries/getCurrentHero.graphql'
import getFooter from '~/graphql/queries/getFooter.graphql'
import getHomeMetaObject from '~/graphql/queries/getNewHero.graphql'
import getTopBar from '~/graphql/queries/getTopBar.graphql'
import type { TImage } from '~/types/types'

import { useHeroStore } from './heroStore'

type IFrontendImage = Pick<TImage, 'altText' | 'url' | 'id'> & { link: string }

interface ITopBarMetaObject {
  desktopText: { value: string }
  mobileText: { value: string }
  updatedAt: string
}

interface IFooterApps {
  references: {
    nodes: {
      link: { value: string }
      image: {
        reference: {
          image: IFrontendImage
        }
      }
    }[]
  }
}

interface IFooterSocialLinks {
  references: {
    nodes: {
      link: { value: string }
      image: {
        reference: {
          image: IFrontendImage
        }
      }
    }[]
  }
}

interface IFooterPaymentMethods {
  references: {
    nodes: {
      image: {
        reference: {
          image: IFrontendImage
        }
      }
    }[]
  }
}

interface IFooterMetaObject {
  apps: IFooterApps
  copyright: { value: string }
  paymentMethods: IFooterPaymentMethods
  socialLinks: IFooterSocialLinks
  updatedAt: string
}

interface IState {
  footer: {
    copyright: string
    mobileApps: IFrontendImage[]
    paymentMethods: Pick<TImage, 'altText' | 'url' | 'id'>[]
    socialLinks: IFrontendImage[]
  }
  // TODO: Complete these and remove any
  preFooter: any[]
  topbar: {
    desktopText: string
    mobileText: string
    updatedAt: string
  }
}

export const useLayout = defineStore({
  id: 'layout',
  state: () =>
    <IState>{
      footer: {
        copyright: '',
        mobileApps: [],
        paymentMethods: [],
        socialLinks: [],
      },
      preFooter: [],
      topbar: {
        desktopText: '',
        mobileText: '',
        updatedAt: '',
      },
    },

  getters: {},

  actions: {
    setMappedTopbar(data: ITopBarMetaObject) {
      if (!data) {
        this.$nuxt.$sentry.captureException(
          `Missing data on setMappedTopbar: ${this.$nuxt.$cmwStore.settings.store}`,
        )
        return
      }

      this.$patch({
        topbar: {
          desktopText: data.desktopText.value,
          mobileText: data.mobileText.value,
          updatedAt: data.updatedAt,
        },
      })
    },

    setMappedFooter(data: IFooterMetaObject) {
      if (!data) {
        this.$nuxt.$sentry.captureException(
          `Missing data on setMappedFooter: ${this.$nuxt.$cmwStore.settings.store}`,
        )
        return
      }

      this.$patch({
        footer: {
          copyright: data.copyright.value,
          mobileApps:
            data.apps.references.nodes
              ?.filter(({ link, image }) => link && image)
              .map(({ link, image }) => ({
                altText: image.reference.image.altText,
                link: link.value,
                url: image.reference.image.url,
                id: image.reference.image.id,
              })) || [],
          paymentMethods:
            data.paymentMethods.references.nodes
              ?.filter(({ image }) => image)
              ?.map(({ image }) => ({
                altText: image?.reference?.image?.altText || '',
                url: image?.reference?.image?.url || '',
                id: image?.reference?.image?.id || '',
              })) || [],
          socialLinks:
            data.socialLinks.references.nodes
              ?.filter(({ link, image }) => link && image)
              ?.map(({ link, image }) => ({
                altText: image?.reference?.image?.altText || '',
                link: link?.value || '',
                url: image?.reference?.image?.url || '',
                id: image?.reference?.image?.id || '',
              })) || [],
        },
      })
    },

    async loadTopbar() {
      await this.$nuxt.$graphql.default
        .request(getTopBar, {
          lang: this.$nuxt.app.i18n.locale.toUpperCase(),
          handle: {
            handle: 'top-bar',
            type: 'top_bar',
          },
        })
        .then(({ metaobject }) => this.setMappedTopbar(metaobject))
        .catch(err =>
          this.$nuxt.$handleApiErrors(
            `Catch on loadTopbar from GraphQL: ${err}`,
          ),
        )
    },

    async loadFooter() {
      await this.$nuxt.$graphql.default
        .request(getFooter, {
          lang: this.$nuxt.app.i18n.locale.toUpperCase(),
          handle: {
            handle: 'footer',
            type: 'footer',
          },
        })
        .then(({ metaobject }) => this.setMappedFooter(metaobject))
        .catch(err =>
          this.$nuxt.$handleApiErrors(
            `Catch on loadFooter from GraphQL: ${err}`,
          ),
        )
    },

    async HomBannerCarousel(ids: any) {
      const heroStore = useHeroStore()
      try {
        const heroData = []
        for (const id of ids) {
          const { metaobject } = await this.$nuxt.$graphql.default.request(
            GetMetaObjectById,
            {
              lang: this.$nuxt.app.i18n.locale.toUpperCase(),
              id,
            },
          )

          if (metaobject && metaobject.fields) {
            const backgroundColor
              = metaobject.fields.find(
                (field: any) => field.key === 'background_color',
              )?.value || ''

            const imageUrl = metaobject.image?.reference?.image?.url || '' // Adjust this URL to match your CDN structure
            const link
              = metaobject.fields.find((field: any) => field.key === 'link')
                ?.value || ''
            const text
              = metaobject.fields.find(
                (field: any) => field.key === 'button_text',
              )?.value || ''
            const title
              = metaobject.fields.find((field: any) => field.key === 'title')
                ?.value || ''

            const banner = {
              id,
              backgroundColor,
              image: imageUrl,
              link,
              text,
              title,
            }
            heroData.push(banner)
          }
        }
        heroStore.setBanners(heroData) // Store mein data set karo
        return heroData
      } catch (error) {
        console.error('Error HomeBannerCarousel fetching data:', error)
        return null
      }
    },
    async getCurrentHero(ids: any[]) {
      let currentHero: any = null
      let mostRecentActiveDate: Date | null = null

      for (const id of ids) {
        try {
          const { metaobject } = await this.$nuxt.$graphql.default.request(
            GetMetaObjectById,
            {
              lang: this.$nuxt.app.i18n.locale.toUpperCase(),
              id,
            },
          )

          if (metaobject) {
            const startDate = new Date(
              metaobject.fields.find(
                (field: any) => field.key === 'start_date',
              )?.value,
            )
            if (!mostRecentActiveDate || startDate > mostRecentActiveDate) {
              mostRecentActiveDate = startDate
              currentHero = metaobject
            }
          }
        } catch (err) {
          this.$nuxt.$handleApiErrors(
            `Catch on getCurrentHero from GraphQL: ${err}`,
          )
        }
      }

      if (currentHero) {
        const name
          = currentHero.fields.find((field: any) => field.key === 'name')
            ?.value || 'Unnamed Hero'
        const bannerCarousels = JSON.parse(
          currentHero.fields.find(
            (field: any) => field.key === 'banner_carousel',
          )?.value || '[]',
        )
        const startDate
          = currentHero.fields.find((field: any) => field.key === 'start_date')
            ?.value || 'No start date'

        await this.HomBannerCarousel(bannerCarousels)

        return { bannerCarousels, name, startDate }
      }

      return null
    },

    async getHomeProduct() {
      await this.$nuxt.$graphql.default
        .request(getHomeMetaObject, {
          lang: this.$nuxt.app.i18n.locale.toUpperCase(),
          handle: {
            handle: 'home',
            type: 'home',
          },
        })
        .then(({ metaobject }) => {
          const fields = metaobject?.fields || []

          const idField = fields.find(
            (field: any) => field.key === 'main_banner',
          )
          const ids = idField ? JSON.parse(idField.value) : []
          return this.getCurrentHero(ids) // Returning the promise to chain the next .then
        })
        .then(() => {
          // Handle any logic after getCurrentHero completes, if needed
        })
        .catch((err) => {
          this.$nuxt.$handleApiErrors(`Catch on getHome from GraphQl: ${err}`)
        })
    },
  },
})
