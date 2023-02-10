<script>
export default {
  props: {
    collection: {
      type: [Object],
    },
  },
}
</script>

<template>
  <NuxtLink class="hover:(cmw-no-underline)" :to="localePath({ name: `selections-handle`, params: { handle: collection.handle } })">
    <div
      class="cmw-font-sans cmw-border cmw-border-gray-light cmw-rounded-sm cmw-border-gray-light cmw-overflow-hidden cmw-h-full
    hover:cmw-shadow-elevation"
    >
      <div class="c-collection__contentContainer cmw-h-full cmw-flex cmw-text-body hover:(cmw-text-body cmw-no-underline)">
        <div class="c-collection__content cmw-p-4">
          <img class="c-collection__contentImg cmw-mx-auto" :src="collection.image?.url || 'https://picsum.photos/id/75/300/200'" :alt="collection.image?.altText">
          <div>
            <div class="cmw-font-bold cmw-text-xl cmw-mt-4" v-text="collection.title" />
            <div class="cmw-line-clamp-2" v-text="collection.descriptionHtml" />
            <div class="cmw-text-secondary-700" v-text="collection.region" />
          </div>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<style scoped>
.c-collection__contentContainer {
  container: brand-card-content / inline-size;
}

.c-collection__content {
  display: grid;
  grid-template-columns: 1fr;
  width: 100%;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.c-collection__contentImg {
  max-width: 150px;
}

@container brand-card-content (min-width: 300px) {
  .c-collection__content {
    grid-template-columns: 40% 60%;
    text-align: left;
  }

  .c-collection__contentImg {
    max-width: 70%;
  }
}
</style>
