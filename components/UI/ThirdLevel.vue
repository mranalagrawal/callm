<template>
  <div>
    <p v-if="!thirdLevel.marketing_cta" class="mb-2">
      <!-- Note: on Nuxt 3 this will be handle by the navigation instead so we can properly use <NuxtLink /> -->
      <button class="menu-link px-2" :style="styled" @click="handleClick(thirdLevel.third_level_link)"><VueSvgIcon
        v-if="thirdLevel.selection"
        :data="require(`@/assets/svg/selections/${thirdLevel.selection}.svg`)"
        width="20px"
        class="img-selection"
      />{{ thirdLevel.third_level_name }}</button>
    </p>
    <Card v-else :bg-url="thirdLevel.marketing_image.url" :title="thirdLevel.third_level_name" :subtitle="thirdLevel.marketing_cta"
          @click.native="handleClick(thirdLevel.third_level_link)"/>
  </div>
</template>

<script>
export default {
  props: ["thirdLevel"],
  emits: ['close-banner'],
  computed: {
    styled() {
      if (this.thirdLevel.third_level_style) {
        return JSON.parse(this.thirdLevel.third_level_style);
      }
      return null;
    },
  },
  methods: {
    handleClick(to) {
      if (!to) {
        // FixMe: Shall we throw an error here? why is it navigation to home when no link provide?
        // throw new Error('No link provided')
        this.$router.push('/')
        return
      }
      this.$emit('close-banner')
      this.$router.push(to)
    }
  }
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
