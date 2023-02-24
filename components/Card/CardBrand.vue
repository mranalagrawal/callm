<script>
export default {
  name: 'CardBrand',
  props: {
    brand: {
      type: [Object],
    },
  },
}
</script>

<template>
  <NuxtLink class="hover:(cmw-no-underline)" :to="localePath(`/winery/${brand.handle}-B${brand.brandId}`)">
    <div
      class="cmw-font-sans cmw-border cmw-border-gray-light cmw-rounded-sm cmw-border-gray-light cmw-overflow-hidden cmw-h-full
    hover:cmw-shadow-elevation"
    >
      <div class="c-brand__contentContainer cmw-h-full cmw-flex cmw-text-body hover:(cmw-text-body cmw-no-underline)">
        <div class="c-brand__content cmw-p-4">
          <LoadingImage
            img-classes="c-brand__contentImg cmw-mx-auto"
            :thumbnail="{
              url: brand.url ? `${brand.url}&width=20&height=12` : 'https://picsum.photos/id/75/20/12',
              width: 20,
              height: 12,
              altText: brand.name,
            }"
            :source="{
              url: brand.url ? `${brand.url}&width=265&height=164` : 'https://picsum.photos/id/75/265/164',
              width: 265,
              height: 164,
              altText: brand.name,
            }"
          />
          <div>
            <div class="cmw-font-bold cmw-text-xl cmw-mt-4" v-text="brand.name" />
            <div v-text="brand.subtitle" />
            <div class="cmw-text-secondary-700" v-text="brand.region" />
          </div>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<style scoped>
.c-brand__contentContainer {
  container: brand-card-content / inline-size;
}

.c-brand__content {
  display: grid;
  grid-template-columns: 1fr;
  width: 100%;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.c-brand__contentImg {
  max-width: 150px;
}

@container brand-card-content (min-width: 300px) {
  .c-brand__content {
    grid-template-columns: 40% 60%;
    text-align: left;
  }

  .c-brand__contentImg {
    max-width: 70%;
  }
}
</style>
