<script>
import { markRaw } from '@nuxtjs/composition-api'

export default {
  setup() {
    const socials = markRaw({
      CMW: [
        {
          icon: 'facebook',
          url: 'https://www.facebook.com/Callmewine/',
        },
        {
          icon: 'instagram',
          url: 'https://www.instagram.com/callmewine_official',
        },
        {
          icon: 'linkedin',
          url: 'https://it.linkedin.com/company/callmewine',
        },
        {
          icon: 'pinterest',
          url: 'https://www.pinterest.it/callmewine/',
        },
        {
          icon: 'telegram',
          url: 'https://t.me/Callmewine_YourPersonalSommelier',
        },
        {
          icon: 'youtube',
          url: 'https://www.youtube.com/@callmewine5156',
        },
      ],
      CMW_UK: [
        {
          icon: 'facebook',
          url: 'https://www.facebook.com/callmewineuk',
        },
        {
          icon: 'instagram',
          url: 'https://www.instagram.com/callmewine_uk/',
        },
      ],
      CMW_DE: [
        {
          icon: 'facebook',
          url: 'https://www.facebook.com/callmewine.de',
        },
        {
          icon: 'instagram',
          url: 'https://www.instagram.com/callmewine.de/',
        },
      ],
      CMW_FR: [
        {
          icon: 'facebook',
          url: 'https://www.facebook.com/callmewine.fr',
        },
        {
          icon: 'instagram',
          url: 'https://www.instagram.com/callmewine.fr',
        },
      ],
    })

    const mobileApps = markRaw({
      CMW: [
        {
          icon: 'android',
          url: 'https://play.google.com/store/apps/details?id=com.callmewine.appApp',
        },
        {
          icon: 'ios',
          url: 'https://apps.apple.com/it/app/callmewine/id1545381296',
        },
      ],
    })

    return { socials, mobileApps }
  },
}
</script>

<template>
  <div class="gap-4 grid items-center justify-items-center md:( grid-cols-2 justify-between justify-items-stretch)">
    <div class="flex gap-2">
      <a
        v-for="({ icon, url }) in socials[$config.STORE]" :key="icon" :href="url"
        :aria-label="$t(`enums.accessibility.labels.GO_TO_PAGE`, { url: icon })"
      >
        <VueSvgIcon :data="require(`@/assets/svg/social-${icon}.svg`)" color="white" width="30" height="auto" />
      </a>
    </div>
    <div v-if="$config.STORE === 'CMW'" class="grid max-w-300px grid-cols-2 gap-2 items-center justify-end md:ml-auto">
      <a
        href="https://apps.apple.com/us/app/callmewine/id1545381296?itsct=apps_box_badge&amp;itscg=30200"
        style="display: inline-block; overflow: hidden; border-radius: 13px; width: 100%; height: auto;"
      ><img
        src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83&amp;releaseDate=1617667200"
        alt="Download on the App Store" style="border-radius: 13px; width: 100%; height: auto;"
      ></a>
      <a href="https://play.google.com/store/apps/details?id=com.callmewine.app&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1">
        <img alt="Get it on Google Play" src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"></a>
    </div>
  </div>
</template>
