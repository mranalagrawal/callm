<template>
  <div>
    <div class="cmw-border-t-4 cmw-border-t-primary-900 cmw-pt-4">
      <div>
        <div v-if="shipping">
          <div v-if="data && data.length > 0" class="cmw-min-w-[640px]">
            <div
              class="cmw-text-secondary-700 cmw-flex cmw-items-center cmw-justify-center cmw-gap-2 cmw-text-sm cmw-uppercase cmw-py-0">
              {{ cartTotalAmount }}
              <VueSvgIcon :data="cartTotalAmount < shipping.threshold ? deliveryIcon : checkCircularIcon" width="24" height="24"/>
              <span>{{ cartTotalAmount < shipping.threshold ? shipping.threshold_not_reached : shipping.threshold_reached}}</span>
            </div>
            <div class="cmw-px-6">
              <hr/>
            </div>
            <div>
              <div v-for="item in data" :key="item.id">
                <CartLine :item="item"/>
              </div>
            </div>
            <div class="row bg-light py-4 px-4">
              <div class="col-6">
                <Button variant="ghost" to="/cart">{{
                    $t("navbar.cart.detail")
                  }}
                </Button>
              </div>
              <div class="col-6">
                <Button @click.native="checkout()">
                  {{ $t("navbar.cart.checkout") }}
                </Button>
              </div>
            </div>
          </div>
          <div v-else class="cmw-min-w-[425px] cmw-text-center cmw-px-6 cmw-pb-4">
            <div
              class="cmw-text-secondary-700 cmw-flex cmw-items-center cmw-justify-center cmw-gap-2 cmw-text-sm cmw-uppercase cmw-py-0">
              <VueSvgIcon :data="deliveryIcon" width="24" height="24"/>
              <span>{{ shipping.threshold_not_reached }}</span>
            </div>
            <hr/>
            <strong class="cmw-block">{{ $t("navbar.cart.empty") }}</strong>
            <p class="pt-4">{{ $t("navbar.cart.startFromMessage") }}</p>
            <Button class="cmw-py-4" to="/">
              <span>{{ $t("navbar.cart.cta") }}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {createCart, addProductToCart} from "~/utilities/cart";
import documents from "../../prismic-mapper";
import locales from "../../locales-mapper";
import deliveryIcon from 'assets/svg/delivery.svg'
import checkCircularIcon from 'assets/svg/check-circular.svg'
import {mapGetters} from "vuex";

export default {
  name: 'HeaderMiniCart',
  props: {
    show: {
      type: [Boolean],
    },
  },
  data() {
    return {
      deliveryIcon,
      checkCircularIcon,
      data: null,
      shipping: null,
    };
  },
  computed: {
    ...mapGetters({
      cartTotalAmount: 'userCart/getCartTotalAmount',
    }),
    cart() {
      return this.$store.state.cart.cart;
    },
    checkoutUrl() {
      let baseUrl = this.cart.checkoutUrl + "/?";

      this.$store.state.user.user.customer.email &&
      (baseUrl += `&checkout[email]=${this.$store.state.user.user.customer.email}`);

      this.$store.state.user.user.customer.defaultAddress?.firstName &&
      (baseUrl += `&checkout[shipping_address][first_name]=${this.$store.state.user.user.customer.defaultAddress.firstName}`);

      this.$store.state.user.user.customer.defaultAddress?.lastName &&
      (baseUrl += `&checkout[shipping_address][last_name]=${this.$store.state.user.user.customer.defaultAddress.lastName}`);

      this.$store.state.user.user.customer.defaultAddress?.address1 &&
      (baseUrl += `&checkout[shipping_address][address1]=${this.$store.state.user.user.customer.defaultAddress.address1}`);

      this.$store.state.user.user.customer.defaultAddress?.address2 &&
      (baseUrl += `&checkout[shipping_address][address2]=${this.$store.state.user.user.customer.defaultAddress.address2}`);

      this.$store.state.user.user.customer.defaultAddress?.country &&
      (baseUrl += `&checkout[shipping_address][country]=${this.$store.state.user.user.customer.defaultAddress.country}`);

      this.$store.state.user.user.customer.defaultAddress?.province &&
      (baseUrl += `&checkout[shipping_address][province]=${this.$store.state.user.user.customer.defaultAddress.province}`);

      this.$store.state.user.user.customer.defaultAddress?.city &&
      (baseUrl += `&checkout[shipping_address][city]=${this.$store.state.user.user.customer.defaultAddress.city}`);

      this.$store.state.user.user.customer.defaultAddress?.zip &&
      (baseUrl += `&checkout[shipping_address][zip]=${this.$store.state.user.user.customer.defaultAddress.zip}`);

      return baseUrl;
    },
  },
  async fetch() {
    const userCart = this.$store.state.userCart.userCart;
    this.data = userCart;


    let lang = locales[this.$i18n.locale];
    if (lang == "en-gb" && this.$config.STORE == "CMW") {
      lang = "en-eu";
    }

    const response = await this.$prismic.api.getSingle(
      documents[this.$config.STORE].shipping,
      {
        lang: lang,
      }
    );
    const shipping = response.data;
    this.shipping = shipping;
  },
  methods: {
    async checkout() {
      // redirect if not user
      if (!this.$store.state.user.user) {
        this.$router.push("/login");
        return;
      }

      // crea carrello su shop
      const domain = this.$config.DOMAIN;
      const access_token = this.$config.STOREFRONT_ACCESS_TOKEN;
      const user = this.$store.state.user.user;
      const cart = await createCart(domain, access_token, user);
      const cartId = cart.id;

      // update in bulk del cart
      const lines = this.$store.state.userCart.userCart.map((el) => {
        return {
          merchandiseId: el.productVariantId,
          quantity: el.quantity,
        };
      });

      const cartFilled = await addProductToCart(
        domain,
        access_token,
        cartId,
        lines
      );
      // crea checkoutUrl
      let checkoutUrl = cartFilled.checkoutUrl + "/?";
      this.$store.state.user.user.customer.email &&
      (checkoutUrl += `&checkout[email]=${this.$store.state.user.user.customer.email}`);

      this.$store.state.user.user.customer.defaultAddress?.firstName &&
      (checkoutUrl += `&checkout[shipping_address][first_name]=${this.$store.state.user.user.customer.defaultAddress.firstName}`);

      this.$store.state.user.user.customer.defaultAddress?.lastName &&
      (checkoutUrl += `&checkout[shipping_address][last_name]=${this.$store.state.user.user.customer.defaultAddress.lastName}`);

      this.$store.state.user.user.customer.defaultAddress?.address1 &&
      (checkoutUrl += `&checkout[shipping_address][address1]=${this.$store.state.user.user.customer.defaultAddress.address1}`);

      this.$store.state.user.user.customer.defaultAddress?.address2 &&
      (checkoutUrl += `&checkout[shipping_address][address2]=${this.$store.state.user.user.customer.defaultAddress.address2}`);

      this.$store.state.user.user.customer.defaultAddress?.country &&
      (checkoutUrl += `&checkout[shipping_address][country]=${this.$store.state.user.user.customer.defaultAddress.country}`);

      this.$store.state.user.user.customer.defaultAddress?.province &&
      (checkoutUrl += `&checkout[shipping_address][province]=${this.$store.state.user.user.customer.defaultAddress.province}`);

      this.$store.state.user.user.customer.defaultAddress?.city &&
      (checkoutUrl += `&checkout[shipping_address][city]=${this.$store.state.user.user.customer.defaultAddress.city}`);

      this.$store.state.user.user.customer.defaultAddress?.zip &&
      (checkoutUrl += `&checkout[shipping_address][zip]=${this.$store.state.user.user.customer.defaultAddress.zip}`);
      // redirect al checkoutUrl

      window.location = checkoutUrl;
    },
  },
};
</script>
