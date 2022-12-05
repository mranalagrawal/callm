<template>
  <div>
    <p v-if="!thirdLevel.marketing_cta" class="mb-2">
      <nuxt-link
        class="menu-link px-2"
        :to="thirdLevel.third_level_link || '/'"
        :style="styled"
      >
        <!-- {{ thirdLevel }} -->
        <!-- {{ $config.STORE }} -->

        <VueSvgIcon
          v-if="thirdLevel.selection"
          :data="require(`@/assets/svg/selections/${thirdLevel.selection}.svg`)"
          width="20px"
          class="img-selection"
        />{{ thirdLevel.third_level_name }}</nuxt-link>
    </p>
    <div
      v-else
      class="row align-items-center mb-4 mx-1"
      style="
        width: 100%;
        max-width: 450px;
        border-radius: 10px;
        height: 100px;
        background: #f8f8f8;
        border: 1px solid #ddd;
      "
    >
      <div
        class="col-3"
        style="
                height: 100%
                background-position: center;
                background-size: cover;
                border-radius: 10px 0px 0px 10px;
              "
        :style="{
          backgroundImage: 'url(' + thirdLevel.marketing_image.url + ')',
        }"
      ></div>

      <div class="col-9">
        <nuxt-link
          :to="thirdLevel.third_level_link || '/'"
          class="mb-0 text-decoration-none text-dark d-block"
          >{{ thirdLevel.third_level_name }}</nuxt-link
        >
        <nuxt-link
          v-if="thirdLevel.marketing_cta.length < 40"
          :to="thirdLevel.third_level_link || '/'"
          class="mb-0 text-decoration-none text-light-secondary small"
          >{{ thirdLevel.marketing_cta }}</nuxt-link
        >
        <nuxt-link
          v-else
          :to="thirdLevel.third_level_link || '/'"
          class="mb-0 text-decoration-none text-light-secondary small"
          >{{ thirdLevel.marketing_cta.substring(0, 40) }}...</nuxt-link
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["thirdLevel"],
  computed: {
    styled() {
      if (this.thirdLevel.third_level_style) {
        return JSON.parse(this.thirdLevel.third_level_style);
      }
      return null;
    },
  },
};
</script>

<style scoped>
.menu-link {
  color: black;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 300;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
.menu-link:hover {
  color: var(--dark-secondary);
  text-decoration: none;
}
</style>
