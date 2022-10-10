<template>
  <div class="container-fluid background">
    <div class="container">
      <div class="row">
        <div class="col-12 col-md-8">
          <p
            class="lead d-none d-mb-block"
            style="font-size: 2rem; line-height: 1.5"
          >
            Callmewine, la tua enoteca online, il tuo personale sommelier
          </p>
          <p
            class="d-md-none text-center font-weight-bold"
            style="font-size: 1.6rem"
          >
            Callmewine, la tua enoteca online, il tuo personale sommelier
          </p>
          <p class="">
            L'idea di creare Callmewine, un'enoteca specializzata nella vendita
            di vino online, è nata dalla passione per il vino e per il mondo che
            lo circonda: il fascino delle cantine e delle loro tradizioni,
            l'impegno e la pazienza nascosti in ogni bottiglia, la bellezza
            delle colline coperte di vigne, i loro verdi estivi e i loro rossi e
            gialli autunnali, il profumo intenso di mosto che si sprigiona nelle
            giornate di ottobre, i paesaggi nebbiosi e coperti di bruma,
            l'allegria di certe serate con gli amici... Del vino ci affascina
            tutto, ma proprio tutto. Assaggio dopo assaggio, lavoriamo ogni
            giorno per migliorare la nostra offerta di vini rossi, vini bianchi,
            champagne e distillati: siamo convinti che selezionare sia più
            importante che proporre tutto indistintamente.
          </p>
          <p :class="!readMore && 'd-none'">
            E così su Callmewine proponiamo i migliori vini italiani, dai vini
            toscani ai vini piemontesi ai vini siciliani, e una selezione, che
            migliora di giorno in giorno, di vini francesi, grappe, whisky ed
            altri distillati. Nella nostra carta dei vini puoi trovare sia i
            vini famosi, dal Barolo al Chianti, dal Brunello di Montalcino
            all'Amarone, dal Franciacorta al Prosecco, sia quelli quasi
            sconosciuti, come il Timorasso, il Frappato e il Pelaverga. Su
            Callmewine puoi comprare vini provenienti da grandi cantine, come
            Gaja, Antinori, Bellavista e Ca' del Bosco, e da cantine piccole, ma
            capaci di fare vini meravigliosi, come Arianna Occhipinti e
            Zidarich. E di ogni cantina scegliamo solo i vini migliori. Ci
            piacciono i vini autentici, di grande personalità, capaci di
            raccontare il terroir da cui provengono e le fatiche nascoste dietro
            ai loro profumi e ai loro aromi. Ci piacciono le cantine per cui il
            vino nasce innanzitutto in vigna e la cui filosofia produttiva si
            basa il più possibile su principi vicini alla natura e all'uomo,
            senza artifici e scorciatoie. Per questo su Callmewine puoi trovare,
            oltre ad un'ampia selezione di vini biologici e vini biodinamici,
            moltissimi vini artigianali, fatti come una volta, vini fatti come
            deve essere fatto un buon vino.
          </p>
          <button
            v-if="!readMore"
            class="btn px-3 py-2 text-uppercase view-more"
            style="font-weight: 700"
            @click="readMore = true"
          >
            Leggi di più
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      readMore: false,
    };
  },
};
</script>

<style scoped>
.background {
  background-image: url("../../assets/images/enoteca.jpeg") !important;
  background-position: right;
  background-repeat: no-repeat;
}
</style>
