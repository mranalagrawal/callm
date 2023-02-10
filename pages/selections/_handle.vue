<script>
import Selection from '../../components/Selection.vue'
export default {
  components: { Selection },
  layout(context) {
    return context.$config.STORE
  },

  async asyncData({ params }) {
    const handle = params.handle
    return { handle }
  },
  data() {
    return {
      selection: null,
    }
  },
}
</script>

<template>
  <div class="">
    <Selection :selection="handle" />
  </div>
</template>

<style scoped></style>
