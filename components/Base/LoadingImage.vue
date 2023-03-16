<script>
import { onMounted, ref } from '@nuxtjs/composition-api'

export default {
  props: {
    /** @Type: {ImageType.Image} */
    thumbnail: { required: true },
    /** @Type: {ImageType.Image} */
    source: { required: true },
    ignoreObserver: { type: Boolean },
    imgClasses: { type: String },
  },
  setup(props) {
    const el = ref(null)
    const imgEl = ref(null)
    const imageIsLoaded = ref(false)
    const options = {
      root: null,
      threshold: 0,
    }

    const loadBigImage = (image) => {
      image.addEventListener('load', function handler() {
        imageIsLoaded.value = true
        this.removeEventListener('load', handler)
      })

      // eslint-disable-next-line no-console
      image.addEventListener('error', () => console.log('error'))

      image.src = image.dataset.src
    }

    const loadSmallImage = () => {
      if (imgEl.value) {
        imgEl.value.addEventListener('load', function handler() {
          setTimeout(() => {
            this.removeEventListener('load', handler)
            loadBigImage(imgEl.value)
          }, 100)
        })
        // eslint-disable-next-line no-console
        imgEl.value.addEventListener('error', () => console.log('error'))
        imgEl.value.src = imgEl.value.dataset.thumbnail
        imgEl.value.width = props.source.width
        imgEl.value.height = props.source.height
      }
    }

    const handleIntersect = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadSmallImage()
          el.value && observer.unobserve(el.value)
        }
      })
    }

    const createObserver = () => {
      const observer = new IntersectionObserver(handleIntersect, options)
      el.value && observer.observe(el.value)
    }

    onMounted(() => {
      (window.IntersectionObserver && !props.ignoreObserver)
        ? createObserver()
        : loadSmallImage()
    })
    return { el, imgEl, imageIsLoaded }
  },
}
</script>

<template>
  <div
    ref="el"
    class="w-full"
  >
    <img
      ref="imgEl"
      class="cmw-filter cmw-transition-lazy-image cmw-duration-600 cmw-text-xxs"
      :class="[imageIsLoaded ? 'cmw-blur-0' : 'cmw-blur-9', imgClasses]"
      :data-src="source.url"
      :data-thumbnail="thumbnail.url"
      :alt="thumbnail.altText"
      :width="thumbnail.width"
      :height="thumbnail.height"
    >
  </div>
</template>
