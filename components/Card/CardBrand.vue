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
  <NuxtLink :to="localePath(`/winery/${brand.handle}-B${brand.brandId}.htm`)">
    <div
      class="font-sans border border-gray-light rounded-sm border-gray-light overflow-hidden h-full
    hover:shadow-elevation"
    >
      <div class="c-brand__contentContainer h-full flex text-body">
        <div class="c-brand__content p-4">
          <LoadingImage
            img-classes="c-brand__contentImg mx-auto"
            :thumbnail="{
              url: brand.url ? `${brand.url}?&width=20&height=12` : 'https://picsum.photos/id/75/20/12',
              width: 20,
              height: 12,
              altText: brand.name,
            }"
            :source="{
              url: brand.url ? `${brand.url}?&width=265&height=164` : 'https://picsum.photos/id/75/265/164',
              width: 265,
              height: 164,
              altText: brand.name,
            }"
          />
          <div>
            <div class="font-bold text-xl mt-4" v-text="brand.name" />
            <div v-text="brand.subtitle" />
            <div class="text-secondary-700" v-text="brand.region" />
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
