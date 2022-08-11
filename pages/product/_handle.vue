<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-12 col-md-6">
        <h1>{{ product.title }}</h1>
        <p>{{ product.description }}</p>
        <p>
          Tags:
          <span
            v-for="tag in product.tags"
            :key="tag"
            class="badge badge-pill badge-dark-red mx-1"
            >{{ tag }}</span
          >
        </p>
        <p class="mb-0 text-muted" style="text-decoration: line-through">
          {{ product.variants.nodes[0].compareAtPrice }} €
        </p>
        <p class="mb-0 text-dark-red h4">
          {{ product.variants.nodes[0].price }} €
        </p>
      </div>
      <div class="col-12 col-md-6">
        <img
          :src="product.images.nodes[0].url"
          alt=""
          class="border border-dark mx-auto d-block"
        />
      </div>
      <div class="col-12 mt-5">
        <div>
          <b-tabs content-class="mt-3" fill>
            <b-tab title="Descrizione" active
              ><p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                Numquam, provident corrupti! Nam sapiente nesciunt sed unde
                neque illo suscipit ex. Vitae eaque modi animi, alias dolores
                quibusdam! Laborum dolorem qui doloremque nemo beatae
                praesentium ipsam cumque dolore, magnam perferendis itaque saepe
                culpa rerum velit soluta enim error sed quisquam totam. Minus
                eum totam perferendis. Ab odio, at fugit dolor temporibus, et
                debitis quidem voluptatem mollitia quia minus ut beatae vero
                quod voluptas ad quae! Consequatur aliquid velit labore nemo
                quibusdam perspiciatis maxime atque sunt nostrum quam, inventore
                iure quaerat. Repellendus fugiat, placeat quasi totam
                perferendis qui illum cumque possimus ea aut obcaecati sed?
                Autem dolorem soluta consequatur odit tempore? Culpa adipisci
                inventore consectetur earum quia tenetur eum praesentium
                voluptatum iure labore voluptate tempore, aliquid unde fugiat!
                Beatae perferendis accusamus vitae voluptatum fuga quia magni?
                Inventore, aliquam in repellendus voluptates ducimus optio quis
                nostrum assumenda, aut atque voluptatibus quisquam minima cum
                suscipit hic minus voluptate recusandae dolorem, omnis velit
                ullam eveniet quam iusto? Aspernatur fuga repellendus dolorem
                voluptatem perspiciatis excepturi repellat nulla possimus totam
                ipsa saepe quis repudiandae harum voluptates atque aperiam
                debitis doloremque sed eum eveniet, alias molestiae! Quia
                expedita esse doloremque ducimus voluptatem nulla laudantium
                earum eveniet. Ducimus, commodi.
              </p></b-tab
            >
            <b-tab title="Per gustarlo al meglio"
              ><p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta,
                quam? Nobis magni commodi explicabo quo facere! Placeat unde
                iusto, delectus distinctio veritatis, voluptates, ipsa quasi
                fuga quod sint vel deleniti!
              </p></b-tab
            >
            <b-tab title="Premi e riconoscimenti"
              ><p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quos
                veritatis, ipsam porro odio nulla fugiat non mollitia repellat
                a, voluptates expedita! Illum impedit, qui quasi id quia nam
                aspernatur quos cumque earum incidunt fugiat distinctio odio
                corporis cum sunt iusto itaque in voluptate placeat temporibus
                accusantium? Nostrum maiores reiciendis ullam blanditiis
                tenetur, odio dolorum atque voluptatem laborum. Expedita placeat
                eius enim quaerat quos beatae id omnis blanditiis recusandae.
                Dolore, nemo alias saepe amet veritatis fugiat obcaecati,
                voluptates inventore autem similique non, eligendi at
                repellendus! Repellendus fuga, beatae, eius quia vero quibusdam
                nemo id vitae rerum natus distinctio, error illum fugit?
              </p></b-tab
            >
            <b-tab title="Produttore"
              ><p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quos
                veritatis, ipsam porro odio nulla fugiat non mollitia repellat
                a, voluptates expedita! Illum impedit, qui quasi id quia nam
                aspernatur quos cumque earum incidunt fugiat distinctio odio
                corporis cum sunt iusto itaque in voluptate placeat temporibus
                accusantium? Nostrum maiores reiciendis ullam blanditiis
                tenetur, odio dolorum atque voluptatem laborum. Expedita placeat
                eius enim quaerat quos beatae id omnis blanditiis recusandae.
                Dolore, nemo alias saepe amet veritatis fugiat obcaecati,
                voluptates inventore autem similique non, eligendi at
                repellendus! Repellendus fuga, beatae, eius quia vero quibusdam
                nemo id vitae rerum natus distinctio, error illum fugit?
              </p></b-tab
            >
            <b-tab title="Abbinamenti"
              ><p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quos
                veritatis, ipsam porro odio nulla fugiat non mollitia repellat
                a, voluptates expedita! Illum impedit, qui quasi id quia nam
                aspernatur quos cumque earum incidunt fugiat distinctio odio
                corporis cum sunt iusto itaque in voluptate placeat temporibus
                accusantium? Nostrum maiores reiciendis ullam blanditiis
                tenetur, odio dolorum atque voluptatem laborum. Expedita placeat
                eius enim quaerat quos beatae id omnis blanditiis recusandae.
                Dolore, nemo alias saepe amet veritatis fugiat obcaecati,
                voluptates inventore autem similique non, eligendi at
                repellendus! Repellendus fuga, beatae, eius quia vero quibusdam
                nemo id vitae rerum natus distinctio, error illum fugit?
              </p></b-tab
            >
          </b-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { queryProductByHandle } from "../../utilities/productQueries";
const GRAPHQL_URL = "https://callmewine.myshopify.com/api/2022-07/graphql.json";

export default {
  data() {
    return {
      product: null,
    };
  },
  async asyncData({ params }) {
    const handle = params.handle;

    const productQuery = queryProductByHandle(params.handle);

    const GRAPHQL_BODY = {
      async: true,
      crossDomain: true,
      method: "POST",
      headers: {
        "X-Shopify-Storefront-Access-Token": "279d676bc21f056aea81490d952f5ec0",
        "Content-Type": "application/graphql",
      },
      body: productQuery,
    };
    const product = await fetch(GRAPHQL_URL, GRAPHQL_BODY)
      .then((res) => res.json())
      .then((res) => res.data.productByHandle);

    return { product };
  },
};
</script>

<style scoped>
:deep(.nav-tabs .nav-link) {
  margin-bottom: -1px;
  border: none;
  color: #666;
}

:deep(.nav-tabs) {
  border-bottom: 2px solid #666;
}

:deep(.nav-tabs .nav-link.active, .nav-tabs .nav-item.show .nav-link) {
  color: var(--dark-red);
  font-weight: bold;
  background-color: #fff;
  border-bottom: 4px solid var(--dark-red);
}
</style>
