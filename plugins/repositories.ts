import type { Plugin } from '@nuxt/types'

import type { ICustomerUserError, IShopifyCustomer } from '~/types/customer'
import type { IGiftCardMapped, IShopifyProduct } from '~/types/product'
import type { IPrismicPageData, IPrismicPageParams, TPrismicComponentsNames, TPrismicIsoCodes } from '~/types/prismic'
import type { ICollection } from '~/types/collection'
import type { IMailingAddress } from '~/types/mailingAddress'
import type { IShopifyPage } from '~/types/shopifyPage'

import createRepository from '~/repositories'

export interface GetGiftCardByHandleParams { handle: string }
export interface GetAllV2Params {
  first: number
  query: string
  reverse?: boolean
}

export interface GetCollectionByHandleParams {
  filters?: { available?: boolean }
  handle: string
  sortKey?: string
}

export interface ICmwRepoProducts {
  getAll({ first, reverse, query }: {
    first: number
    reverse?: boolean
    query: string
  }): Promise<Maybe<any>>
  getAllV2(params: GetAllV2Params): Promise<IShopifyProduct[]>
  getCollectionsByHandle(params: GetCollectionByHandleParams): Promise<ICollection>
  getGiftCardByHandle(params: GetGiftCardByHandleParams): Promise<Maybe<IGiftCardMapped>>
}

interface ICmwRepo {
  shopifyPages: {
    getPageByHandle(handle: string): Promise<IShopifyPage>
  }
  addresses: {
    getCustomerAddresses(): Promise<{ defaultAddress: IMailingAddress; addresses: IMailingAddress[] }>
    setAddressAsDefault(addressId: IMailingAddress['id']): Promise<{ customer: IShopifyCustomer; customerUserErrors: ICustomerUserError[] }>
  }
  countries: any
  customer: any
  orders: any
  prismic: {
    getPageByUID(page: IPrismicPageParams): Promise<any>
    getSinglePage(page: TPrismicComponentsNames,): Promise<Record<string, any>>
    getSingle(page: TPrismicComponentsNames, lang?: TPrismicIsoCodes): Promise<IPrismicPageData>
  }
  products: ICmwRepoProducts
}

declare module 'vue/types/vue' {
  // this.cmwRepo inside Vue components
  interface Vue {
    $cmwRepo: ICmwRepo
  }
}

declare module '@nuxt/types' {
  // nuxtContext.app.$cmw inside asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $cmwRepo: ICmwRepo
  }
  // nuxtContext.cmwRepo
  interface Context {
    $cmwRepo: ICmwRepo
  }
}

declare module 'vuex/types/index' {
  // this.cmwRepo inside Vuex stores
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,unused-imports/no-unused-vars
  interface Store<S> {
    $cmwRepo: ICmwRepo
  }
}

const cmw: Plugin = (ctx, inject) => {
  inject('cmwRepo', createRepository(ctx))
}

export default cmw
