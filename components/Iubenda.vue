<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    return {}
  },
})
</script>

<template>
  <div>
    <script type="text/javascript">
      (function (w, d) {
      const loader = function () {
      const s = d.createElement('script');
      const tag = d.getElementsByTagName('script')[0];
      s.src = 'https://cdn.iubenda.com/iubenda.js';
      tag.parentNode.insertBefore(s, tag)
      };
      if (w.addEventListener) {
      w.addEventListener('load', loader, false)
      } else if (w.attachEvent) {
      w.attachEvent('onload', loader)
      } else {
      w.onload = loader
      }
      })(window, document)
    </script>
    <a
      v-if="$cmwStore.isDe"
      href="https://www.iubenda.com/privacy-policy/57203394/cookie-policy"
      class="iubenda-noiframe iubenda-embed iubenda-noiframe " title="Cookie-Richtlinie "
    >
      Cookie-Richtlinie
    </a>
    <a
      v-if="$cmwStore.isUk"
      href="https://www.iubenda.com/privacy-policy/87214789/cookie-policy"
      class="iubenda-noiframe iubenda-embed iubenda-noiframe " title="Cookie Policy "
    >Cookie Policy</a>
    <a
      v-if="$cmwStore.isFr"
      href="https://www.iubenda.com/privacy-policy/41188771/cookie-policy"
      class="iubenda-white no-brand iubenda-noiframe iubenda-embed iubenda-noiframe " title="Politique relative aux Cookies "
    >Politique relative aux Cookies</a>
    <a
      v-if="($cmwStore.isIt || $cmwStore.isB2b) && $i18n.locale === 'en'"
      href="https://www.iubenda.com/privacy-policy/46741832/cookie-policy"
      class="iubenda-noiframe iubenda-embed iubenda-noiframe " title="Cookie Policy "
    >Cookie Policy</a>
    <a
      v-if="($cmwStore.isIt || $cmwStore.isB2b) && $i18n.locale === 'it'"
      href="https://www.iubenda.com/privacy-policy/48750088/cookie-policy" class="iubenda-white no-brand iubenda-noiframe iubenda-embed iubenda-noiframe "
      title="Cookie Policy "
    >Cookie Policy</a>
  </div>
</template>
