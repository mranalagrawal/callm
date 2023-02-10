<script>
export default {
  props: ['data'],
  data() {
    return {
      visible: false,
    }
  },
}
</script>

<template>
  <div class="w-100 d-block">
    <button
      v-b-toggle="`sidebar_${data.position}`"
      class="btn d-flex w-100 justify-content-between px-0"
    >
      <span class="small text-dark-secondary text-uppercase">{{
        data.name
      }}</span>
      <span><i
        class="fal fa-chevron-down text-light-secondary mr-3"
        :class="visible ? 'fa-rotate-180' : ''"
      /></span>
    </button>
    <b-sidebar
      :id="`sidebar_${data.position}`"
      shadow
      width="100%"
      z-index="1030"
      no-header
      right
    >
      <div class="px-3 py-2 mt-5">
        <div>
          <i
            v-b-toggle="`sidebar_${data.position}`"
            class="fas fa-chevron-left"
          />
        </div>
        <div
          v-for="(secondLevel, i) in data.items"
          :key="`secondLevel_${i}`"
          class="my-5"
        >
          <p class="text-uppercase text-center text-light-primary">
            {{ secondLevel.name }}
          </p>
          <div
            v-for="(thirdLevel, i) in secondLevel.items"
            :key="`thirdLevel_${i}`"
            class="py-2"
          >
            <div v-if="!thirdLevel.marketing_cta">
              <hr class="m-0 mb-3">
              <!-- {{ thirdLevel.third_level_link }} -->
              <nuxt-link
                :to="`${thirdLevel.third_level_link}`"
                class="text-decoration-none text-dark"
              >
                {{ thirdLevel.third_level_name }}
              </nuxt-link>
            </div>
            <div
              v-else
              class="shadow row align-items-center mb-4 ml-2"
              style="max-width: 350px; border-radius: 10px"
            >
              <div
                class="col-3"
                style="
                  height: 70px;
                  background-position: center;
                  background-size: cover;
                  border-radius: 10px 0px 0px 10px;
                "
                :style="{
                  backgroundImage:
                    `url(${thirdLevel.marketing_image.url})`,
                }"
              />

              <div class="col-9">
                <p class="mb-0">
                  {{ thirdLevel.third_level_name }}
                </p>
                <p class="mb-0 small text-light-secondary">
                  {{ thirdLevel.marketing_cta }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </b-sidebar>
    <!-- <div v-if="visible" class="content mb-5">
      <div v-for="(secondLevel, i) in data.items" :key="`secondLevel_${i}`">
        <p>{{ secondLevel.name }}</p>
        {{ secondLevel.items }}
      </div>

    </div> -->
  </div>
</template>

<style scoped>
:deep(.b-sidebar) {
  padding-top: 48px !important;
}
</style>
