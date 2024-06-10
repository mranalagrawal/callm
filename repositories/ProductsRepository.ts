import type { Context } from "@nuxt/types";

import getHomeCollection from "@/graphql/queries/getHomeCollection.graphql";
import getGiftCardQuery from "@/graphql/queries/getGiftCard.graphql";
import getProducts from "@/graphql/queries/getProducts.graphql";
import type {
  GetAllV2Params,
  GetCollectionByHandleParams,
  GetGiftCardByHandleParams,
  ICmwRepoProducts,
} from "~/plugins/repositories";
import type { ICollection } from "~/types/collection";

export default (ctx: Context) => ({
  async getAllV2(
    { first = 10, reverse = false, query = "tag:undefined" }: GetAllV2Params // FixMe: Not Working Parameters<ICmwRepoProducts['getAllV2']>,
  ): ReturnType<ICmwRepoProducts["getAllV2"]> {
    try {
      const { products } = await ctx.$graphql.default.request(getProducts, {
        lang: ctx.i18n.locale.toUpperCase(),
        first,
        reverse,
        query,
      });

      return products?.nodes || [];
    } catch (err) {
      ctx.$handleApiErrors(
        `Catch getting products from Shopify: query: ${query} error: ${err}`
      );
      return [];
    }
  },
  getAll({ first = 10, reverse = false, query = "tag:undefined" }) {
    return ctx.$graphql.default.request(getProducts, {
      lang: ctx.i18n.locale.toUpperCase(),
      first,
      reverse,
      query,
    });
  },

  async getGiftCardByHandle(
    /* Note: This should be a string, but isn't working, for now I will be using
        type GetGiftCardParams = { handle: string }; <-- extra code
        { handle }: Parameters<ICmwRepoProducts['getGiftCardByHandle']> */
    { handle }: GetGiftCardByHandleParams
  ): ReturnType<ICmwRepoProducts["getGiftCardByHandle"]> {
    try {
      const { product } = await ctx.$graphql.default.request(getGiftCardQuery, {
        lang: ctx.i18n.locale.toUpperCase(),
        handle,
      });

      return product || null;
    } catch (err) {
      ctx.$handleApiErrors(
        `Something went wrong getting gift card from Shopify: ${JSON.stringify({
          handle,
        })} error: ${err}`
      );
    }
  },

  // async getCollectionsByHandle({
  //   handle = "",
  //   filters = { available: true },
  //   sortKey = "COLLECTION_DEFAULT",
  //   first = 250,
  //   id = "",
  // }: GetCollectionByHandleParams): Promise<ICollection> {
  //   return ctx.$graphql.default
  //     .request(getHomeCollection, {
  //       lang: ctx.i18n.locale.toUpperCase(),
  //       filters,
  //       sortKey,
  //       first,
  //       id,
  //     })
  //     .then(({ collection }) => {
  //       if (collection) {
  //         return {
  //           ...collection,
  //           products: collection?.products?.nodes?.length
  //             ? ctx.$productMapping.fromShopify(collection.products.nodes)
  //             : [],
  //         };
  //       } else {
  //         return {};
  //       }
  //     })
  //     .catch((err: Error) => {
  //       ctx.$handleApiErrors(`Catch getting ${handle} from Shopify: ${err}`);
  //       return {};
  //     });
  // },
});
