<script>
export default {
  props: ['product'],
}
</script>

<template>
  <div class="product-card shadow">
    <!-- {{ product.images.nodes[0].url }} -->
    <nuxt-link
      class="text-decoration-none text-dark"
      :to="`/product/${product.handle}`"
    >
      <div class="ribbon">
        <span><i class="fal fa-tag" /> PROMO</span>
      </div>

      <div class="row px-0 mx-0 h-100">
        <div class="col-12 col-md-6 h-100">
          <div
            class="img-wrapper"
            :style="{
              backgroundImage: `url(${product.images.nodes[0].url})`,
            }"
          />
        </div>
        <div class="col-12 col-md-6">
          <h3 class="font-weight-bold mt-5">
            {{ product.title }}
          </h3>
          <p class="lead">
            {{ product.description }}
          </p>
        </div>
      </div>
    </nuxt-link>
  </div>
</template>

<style scoped>
.product-card {
  /* height: 500px; */
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 0.25rem;
  /* width: 300px; */
}

.btn-cart {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  color: white;
  background: #da4865;
}

.img-wrapper {
  height: 320px;
  background-image: url(~/assets/images/img-test.jpeg);
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  /* border: 1px solid red; */
}

.ribbon1 {
  position: absolute;
  width: 90px;
  top: -6.1px;
  right: 10px;
}
.ribbon1:after {
  position: absolute;
  content: "";
  width: 0;
  height: 0;
  border-left: 45px solid transparent;
  border-right: 45px solid transparent;
  border-top: 10px solid var(--dark-primary);
}
.ribbon1 span {
  position: relative;
  display: block;
  text-align: center;

  font-size: 14px;
  line-height: 1;
  padding: 12px 8px 10px;
  border-top-right-radius: 8px;
}
.ribbon1 span:before,
.ribbon1 span:after {
  position: absolute;
  content: "";
}
.ribbon1 span:before {
  height: 6px;
  width: 6px;
  left: -6px;
  top: 0;
  background: black;
}
.ribbon1 span:after {
  height: 6px;
  width: 8px;
  left: -8px;
  top: 0;
  border-radius: 8px 8px 0 0;
  background: black;
}
</style>
