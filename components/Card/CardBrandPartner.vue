<script>
export default {
  name: 'CardBrandPartner',
  props: {
    brand: {
      type: Object,
    },
  },
}
</script>

<template>
  <NuxtLink :to="localePath({ name: 'winery-handle', params: { handle: `${brand.handle}-B${brand.brandId}.htm` } })">
    <div
      class="c-brand font-sans border-2 border-primary-400 rounded-sm border-gray-light overflow-hidden h-full
    hover:shadow-elevation"
    >
      <div class="c-brand__grid grid items-center text-body">
        <div class="c-brand__imgBox relative">
          <NuxtLink
            :to="localePath({ name: 'winery-handle', params: { handle: `${brand.handle}-B${brand.brandId}.htm` } })"
            class="cnw-flex w-full h-full"
          >
            <LoadingImage
              class="w-full h-full overflow-hidden"
              img-classes="w-full h-full object-cover"
              :thumbnail="{
                url: brand.image ? `${brand.image}?&width=20&height=10` : 'https://source.unsplash.com/Ls5oWV9e764',
                width: 20,
                height: 10,
                altText: brand.name,
              }"
              :source="{
                url: brand.image ? `${brand.image}?&width=337&height=330&crop=center` : 'https://source.unsplash.com/Ls5oWV9e764',
                width: 300,
                height: 540,
                altText: brand.name,
              }"
            />
          </NuxtLink>
          <div class="c-brand__mask absolute top-0 w-full h-full object-contain">
          <!--          <VueSvgIcon original :data="require(`@/assets/svg/brand-curve-desktop.svg`)" /> -->
          </div>
        </div>
        <div class="c-brand__contentContainer">
          <div class="c-brand__content p-4">
            <LoadingImage
              img-classes="m-auto max-w-[80%]"
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
              <div class="cmw-font-bold text-xl mt-4" v-text="brand.name" />
              <div v-text="brand.subtitle" />
              <div class="text-secondary-700" v-text="brand.region" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<style scoped>
.c-brand {
  --brand-img-height: 330px;
  --brand-mask-img: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIGlkPSJhIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNzAuNTMgMzI3Ij48cGF0aCBkPSJtNTguOTEsMzI3aDExMS42MlYwaC01Ljg4YzEuOTEsMTYuMDcsMi45MSwzMi40MiwyLjkxLDQ5LDAsMTA3LjI4LTQxLjIxLDIwNC45My0xMDguNjUsMjc4WiIgc3R5bGU9ImZpbGw6I2ZmZjsiLz48cGF0aCBkPSJtMTY0LjA2LDM5LjVjMCwxMTUuMjctNTEuOCwyMTguNDQtMTMzLjM5LDI4Ny41aDI4LjI0YzY3LjQ0LTczLjA3LDEwOC42NS0xNzAuNzIsMTA4LjY1LTI3OCwwLTE2LjU4LS45OS0zMi45My0yLjkxLTQ5aC0yLjY1YzEuMzUsMTIuOTgsMi4wNSwyNi4xNiwyLjA1LDM5LjVaIiBzdHlsZT0iZmlsbDojZDk0OTY1OyIvPjxwYXRoIGQ9Im0xNjQuMDYsMzkuNWMwLTEzLjM0LS43LTI2LjUyLTIuMDUtMzkuNWgtMi41N2MuNDEsNy4xMi42MiwxNC4yOC42MiwyMS41LDAsMTI2LjYxLTYzLjM0LDIzOC40My0xNjAuMDYsMzA1LjVoMzAuNjdDMTEyLjI2LDI1Ny45NCwxNjQuMDYsMTU0Ljc3LDE2NC4wNiwzOS41WiIgc3R5bGU9ImZpbGw6Izk5MjY0NTsiLz48L3N2Zz4=");
  --brand-mask-img-position: top right -1px;
  container: brand-card / inline-size;
}

.c-brand__grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.c-brand__imgBox {
  height: var(--brand-img-height);
}

.c-brand__mask {
  background-image: var(--brand-mask-img);
  background-repeat: no-repeat;
  background-position: var(--brand-mask-img-position);
}

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

/* We are handling this piece skipping mobile-first to reduce the amount of CSS  */
@container brand-card (max-width: 400px) {
  .c-brand__grid {
    grid-template-columns: 1fr;
  }

  .c-brand__imgBox {
    --brand-img-height: 145px;
  }

  .c-brand__mask {
    --brand-mask-img: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIGlkPSJiIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzNDAgMTAwLjUzIj48cGF0aCBkPSJtMCw2NC4yNHYzNi4yOGgzNDB2LTQ4LjE1Yy01NS4wOSwyNy41Mi0xMTcuMjMsNDMuMDEtMTgzLDQzLjAxLTU1LjYyLDAtMTA4LjY0LTExLjA4LTE1Ny0zMS4xNFoiIHN0eWxlPSJmaWxsOiNmZmY7Ii8+PHBhdGggZD0ibTEzOSw4NC4zOWMtNDkuMSwwLTk1Ljk5LTkuNC0xMzktMjYuNXY2LjM1YzQ4LjM2LDIwLjA2LDEwMS4zOCwzMS4xNCwxNTcsMzEuMTQsNjUuNzcsMCwxMjcuOTEtMTUuNDksMTgzLTQzLjAxdi0yNi4wOGMtNTguMTYsMzYuNzktMTI3LjA5LDU4LjA5LTIwMSw1OC4wOVoiIHN0eWxlPSJmaWxsOiNkOTQ5NjU7Ii8+PHBhdGggZD0ibTEyMSw3MS4zOWMtNDIuMzYsMC04My4wNy03LjEtMTIxLTIwLjE2djYuNjZjNDMuMDEsMTcuMDksODkuOSwyNi41LDEzOSwyNi41LDczLjkxLDAsMTQyLjg0LTIxLjMsMjAxLTU4LjA5VjBjLTYxLjQxLDQ0Ljg5LTEzNy4xMSw3MS4zOS0yMTksNzEuMzlaIiBzdHlsZT0iZmlsbDojOTkyNjQ1OyIvPjwvc3ZnPg==");
    --brand-mask-img-position: bottom left;
  }
}

@container brand-card-content (min-width: 500px) {
  .c-brand__content {
    grid-template-columns: 40% 60%;
  }
}
</style>
