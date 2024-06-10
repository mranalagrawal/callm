import { defineStore } from "pinia";
import getFooter from "~/graphql/queries/getFooter.graphql";
import getTopBar from "~/graphql/queries/getTopBar.graphql";
import type { TImage } from "~/types/types";
type IFrontendImage = Pick<TImage, "altText" | "url" | "id"> & { link: string };

interface ITopBarMetaObject {
  desktopText: { value: string };
  mobileText: { value: string };
  updatedAt: string;
}

interface IFooterApps {
  references: {
    nodes: {
      link: { value: string };
      image: {
        reference: {
          image: IFrontendImage;
        };
      };
    }[];
  };
}

interface IFooterSocialLinks {
  references: {
    nodes: {
      link: { value: string };
      image: {
        reference: {
          image: IFrontendImage;
        };
      };
    }[];
  };
}

interface IFooterPaymentMethods {
  references: {
    nodes: {
      image: {
        reference: {
          image: IFrontendImage;
        };
      };
    }[];
  };
}

interface IFooterMetaObject {
  apps: IFooterApps;
  copyright: { value: string };
  paymentMethods: IFooterPaymentMethods;
  socialLinks: IFooterSocialLinks;
  updatedAt: string;
}

interface IState {
  footer: {
    copyright: string;
    mobileApps: IFrontendImage[];
    paymentMethods: Pick<TImage, "altText" | "url" | "id">[];
    socialLinks: IFrontendImage[];
  };
  // TODO: Complete these and remove any
  preFooter: any[];
  topbar: {
    desktopText: string;
    mobileText: string;
    updatedAt: string;
  };
}

export const useLayout = defineStore({
  id: "layout",
  state: () =>
    <IState>{
      footer: {
        copyright: "",
        mobileApps: [],
        paymentMethods: [],
        socialLinks: [],
      },
      preFooter: [],
      topbar: {
        desktopText: "",
        mobileText: "",
        updatedAt: "",
      },
    },

  getters: {},

  actions: {
    setMappedTopbar(data: ITopBarMetaObject) {
      if (!data) {
        this.$nuxt.$sentry.captureException(
          `Missing data on setMappedTopbar: ${this.$nuxt.$cmwStore.settings.store}`
        );
        return;
      }

      this.$patch({
        topbar: {
          desktopText: data.desktopText.value,
          mobileText: data.mobileText.value,
          updatedAt: data.updatedAt,
        },
      });
    },

    setMappedFooter(data: IFooterMetaObject) {
      if (!data) {
        this.$nuxt.$sentry.captureException(
          `Missing data on setMappedFooter: ${this.$nuxt.$cmwStore.settings.store}`
        );
        return;
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
                altText: image?.reference?.image?.altText || "",
                url: image?.reference?.image?.url || "",
                id: image?.reference?.image?.id || "",
              })) || [],
          socialLinks:
            data.socialLinks.references.nodes
              ?.filter(({ link, image }) => link && image)
              ?.map(({ link, image }) => ({
                altText: image?.reference?.image?.altText || "",
                link: link?.value || "",
                url: image?.reference?.image?.url || "",
                id: image?.reference?.image?.id || "",
              })) || [],
        },
      });
    },

    async loadTopbar() {
      await this.$nuxt.$graphql.default
        .request(getTopBar, {
          lang: this.$nuxt.app.i18n.locale.toUpperCase(),
          handle: {
            handle: "top-bar",
            type: "top_bar",
          },
        })
        .then(({ metaobject }) => this.setMappedTopbar(metaobject))
        .catch((err) =>
          this.$nuxt.$handleApiErrors(
            `Catch on loadTopbar from GraphQL: ${err}`
          )
        );
    },

    async loadFooter() {
      await this.$nuxt.$graphql.default
        .request(getFooter, {
          lang: this.$nuxt.app.i18n.locale.toUpperCase(),
          handle: {
            handle: "footer",
            type: "footer",
          },
        })
        .then(({ metaobject }) => this.setMappedFooter(metaobject))
        .catch((err) =>
          this.$nuxt.$handleApiErrors(
            `Catch on loadFooter from GraphQL: ${err}`
          )
        );
    },
  },
});
