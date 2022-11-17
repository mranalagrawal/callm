<template>
  <div class="">
    <Selection :selection="handle" />
  </div>
</template>

<script>
import Selection from "../../components/Selection.vue";
export default {
  layout(context) {
    return context.$config.STORE;
  },
  components: { Selection },
  data() {
    return {
      selection: null,
    };
  },

  async asyncData({ params }) {
    const handle = params.handle;
    return { handle };
  },
};
</script>

<style scoped></style>
