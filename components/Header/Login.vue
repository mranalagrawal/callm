<template>
  <div>
    <div class="cmw-border-t-4 cmw-border-t-primary-900 cmw-py-4 cmw-px-6">
      <template v-if="!user.user">
        <ValidationObserver ref="formEl" v-slot="{ handleSubmit }" slim>
          <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">

            <InputField v-model="form.email"
                        name="user-email-navbar" :label="$t('email')" autocomplete="off"
                        placeholder="User email" rules="required|email"/>

            <InputField v-model="form.password"
                        :type="!passwordIsVisible ? 'password' : 'text'"
                        name="user-password-navbar" :label="$t('password')" autocomplete="off"
                        placeholder="User Password" rules="required|min:4"
                        :icon="passwordIsVisible ? eyeHideIcon : eyeShowIcon"
                        :click-icon="() => passwordIsVisible = !passwordIsVisible"
            />
            <p v-if="message" class="cmw-text-sm cmw-text-error mt-3">{{ message }}</p>

            <Button class="cmw-mt-8" type="submit" :disabled="isSubmitting" :label="$t('navbar.user.signIn').toString()"/>

            <NuxtLink to="/recover"
                      class="cmw-block cmw-w-max cmw-text-center cmw-my-3 cmw-mx-auto cmw-text-primary-400">
              {{ $t("navbar.user.forgotPassword") }}
            </NuxtLink>
          </form>
        </ValidationObserver>
      </template>
      <template v-else>
        <nav class="cmw-min-w-[425px]">
          <NuxtLink
            v-for="({to, label}) in userNavigation"
            :key="to" :to="localePath(to)"
            class="cmw-block cmw-mb-4 cmw-w-max cmw-text-body cmw-no-underline hover:(cmw-no-underline cmw-text-primary cmw-font-bold)"
          >{{ $t(label) }}</NuxtLink>
          <div class="mt-5">
            <Button
              variant="ghost"
              @click.native="logout"
            >
              {{ $t("navbar.user.logout") }}
            </Button>
          </div>
        </nav>
      </template>
    </div>
    <div v-if="!user.user" class="cmw-min-w-[425px] cmw-bg-gray-lightest cmw-py-4 cmw-flex cmw-justify-center cmw-gap-4 cmw-text-sm cmw-px-8 cmw-w-max">
      <div>{{ $t("navbar.user.notRegisteredYet") }}</div>
      <NuxtLink
        :to="localePath('/login')"
        class="text-uppercase cmw-text-primary-400"
      >{{ $t("navbar.user.register") }}
      </NuxtLink>
    </div>
  </div>
</template>

<script>
import userLogin from "~/utilities/userLogin";
import eyeShowIcon from '~/assets/svg/eye-show.svg'
import eyeHideIcon from '~/assets/svg/eye-hide.svg'
import {mapState} from "vuex";

export default {
  name: 'HeaderLogin',
  props: {
    show: {
      type: [Boolean],
    },
  },
  data() {
    return {
      eyeShowIcon,
      eyeHideIcon,
      passwordIsVisible: false,
      form: {
        email: "",
        password: "",
        remember: false,
      },
      message: "",
      isSubmitting: false,
      userNavigation: [
        {
          to: '/profile#orders',
          label: 'navbar.user.myOrders',
        },
        {
          to: '/profile#buyagain',
          label: 'navbar.user.buyAgain',
        },
        {
          to: '/profile#wishlist',
          label: 'navbar.user.favorites',
        },
        {
          to: '/profile#addresses',
          label: 'navbar.user.addresses',
        },
        {
          to: '/profile#accessData',
          label: 'navbar.user.accessData',
        },
      ]
    };
  },
  computed: {
    ...mapState(['user']),
  },
  methods: {
    logout() {
      this.$store.commit("user/setUser", null);
      this.$store.commit("cart/setCart", null);
      this.$router.push("/");
    },
    async onSubmit() {
      this.isSubmitting = true;
      const domain = this.$config.DOMAIN;
      const access_token = this.$config.STOREFRONT_ACCESS_TOKEN;
      const user = await userLogin(
        this.form.email,
        this.form.password,
        domain,
        access_token
      );

      if (!user) {
        this.message = this.$i18n.t('loginFailed');
        this.isSubmitting = false;
        return;
      }
      this.$store.commit("user/setUser", user);
      await this.$router.push("/profile");
    },
  },
};
</script>
